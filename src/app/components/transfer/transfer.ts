import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AccountService } from '../../core/services/account';
import { AccountInterface } from '../../core/interfaces/account-interface';
import { Transaction } from '../../core/interfaces/transaction-interface';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class Transfer implements OnInit, OnDestroy {
  transferForm!: FormGroup;
  accounts: AccountInterface[] = [];
  userAccounts: AccountInterface[] = [];
  transactions: Transaction[] = [];
  visibleTransactions: Transaction[] = [];
  visibleCount: number = 5;

  message: string = '';
  error: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedTransaction: Transaction | null = null;
  selectedFromAccount: AccountInterface | null = null;

  private subs = new Subscription();

  constructor(private fb: FormBuilder, private accountService: AccountService) {}

  ngOnInit() {
    this.transferForm = this.fb.group({
      fromAccount: [null, Validators.required],  // will hold AccountInterface object
      toAccount: [null, Validators.required],    // will hold AccountInterface object
      amount: [null, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    // IMPORTANT: load accounts and transactions so userAccounts is populated
    this.loadAccounts();
    this.loadTransactions();

    // keep selectedFromAccount in sync and update amount validator to not exceed balance
    const fromCtrl = this.transferForm.get('fromAccount');
    if (fromCtrl) {
      this.subs.add(
        fromCtrl.valueChanges.subscribe((acc: AccountInterface | null) => {
          this.selectedFromAccount = acc;
          const amountCtrl = this.transferForm.get('amount');
          if (amountCtrl) {
            const validators = [Validators.required, Validators.min(1)];
            if (acc && typeof acc.balance === 'number') {
              validators.push(Validators.max(acc.balance));
            }
            amountCtrl.setValidators(validators);
            amountCtrl.updateValueAndValidity({ emitEvent: false });
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  // safer: read selected account value from the form control
  onFromAccountChange() {
    const acc = this.transferForm.get('fromAccount')?.value as AccountInterface | null;
    this.selectedFromAccount = acc;
    const amountCtrl = this.transferForm.get('amount');
    if (amountCtrl && acc && amountCtrl.value && amountCtrl.value > acc.balance) {
      amountCtrl.setValue(null);
    }
  }

  // ---------------- Accounts ----------------
loadAccounts() {
  this.accountService.getAllAccounts().subscribe({
    next: (accounts) => {
      this.accounts = accounts || [];

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser?.id;

      this.userAccounts = this.accounts.filter(acc => acc.userId?.toString() === userId?.toString());

      console.log('all accounts:', this.accounts);
      console.log('userAccounts:', this.userAccounts);
    },
    error: (err) => {
      this.errorMessage = 'Failed to load accounts';
      console.error(err);
    }
  });
}

  // ---------------- Transactions ----------------
  loadTransactions() {
    this.isLoading = true;
    this.accountService.getTransactions().subscribe({
      next: (txs) => {
        this.transactions = (txs || []).slice().reverse(); // latest first
        this.updateVisibleTransactions();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load transactions';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadMore() {
    this.visibleCount += 5;
    this.updateVisibleTransactions();
  }

  updateVisibleTransactions() {
    this.visibleTransactions = this.transactions.slice(0, this.visibleCount);
  }

  // ---------------- Transfer ----------------
  onSubmit() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const { fromAccount, toAccount, amount, description } = this.transferForm.value;

    const sender: AccountInterface | null = fromAccount;
    const receiver: AccountInterface | null = toAccount;

    if (!sender || !receiver) {
      this.error = 'Invalid account selected.';
      return;
    }

    if (sender.id === receiver.id) {
      this.error = '❌ Cannot transfer to the same account.';
      return;
    }

    if (amount > sender.balance) {
      this.error = '❌ Insufficient balance.';
      return;
    }

    this.accountService.fundTransfer(sender, receiver, amount, description).subscribe({
      next: (res) => {
        // res: { sender, receiver, debitTx, creditTx } per your service map
        const debitTx: Transaction = res.debitTx;
        const creditTx: Transaction = res.creditTx;
        const updatedSender = res.sender || { ...sender, balance: sender.balance - amount };
        const updatedReceiver = res.receiver || { ...receiver, balance: receiver.balance + amount };

        // update local accounts arrays (so UI updates immediately)
        this.accounts = this.accounts.map(acc => {
          if (acc.id === updatedSender.id) return updatedSender;
          if (acc.id === updatedReceiver.id) return updatedReceiver;
          return acc;
        });
        this.userAccounts = this.userAccounts.map(acc => acc.id === updatedSender.id ? updatedSender : acc);

        // add transactions to top
        this.transactions.unshift(debitTx, creditTx);
        this.updateVisibleTransactions();

        this.message = '✅ Transfer successful!';
        this.error = '';
        this.transferForm.reset();
        this.selectedFromAccount = null;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.message ?? '❌ Transfer failed.';
        this.message = '';
      }
    });
  }

  showDetails(tx: Transaction) {
    this.selectedTransaction = tx;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }
}
