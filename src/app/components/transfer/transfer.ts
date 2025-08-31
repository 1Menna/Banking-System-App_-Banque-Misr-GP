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

  constructor(private fb: FormBuilder, private accountService: AccountService) { }

  ngOnInit() {
    this.transferForm = this.fb.group({
      fromAccount: [null, Validators.required],
      toAccount: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: ['']
    });

    this.loadAccounts();
    this.loadTransactions();

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

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts || [];

        let currentUser: any = null;
        try {
          currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        } catch {
          currentUser = null;
        }
        const userId = currentUser?.id;

        this.userAccounts = this.accounts.filter(
          acc => acc.userId?.toString() === userId?.toString()
        );
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts';
        console.error(err);
      }
    });
  }

  loadTransactions() {
    this.isLoading = true;
    this.accountService.getTransactions().subscribe({
      next: (txs) => {
        this.transactions = (txs || []).slice().reverse();
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

  onSubmit() {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    const { fromAccount, toAccount, amount, description } = this.transferForm.value;

    const sender: AccountInterface | null = fromAccount;
    const receiver: AccountInterface | null = toAccount;
    const amt = Number(amount);

    if (!sender || !receiver) {
      this.error = '❌ Invalid account selected.';
      return;
    }

    if (sender.id === receiver.id) {
      this.error = '❌ Cannot transfer to the same account.';
      return;
    }

    if (isNaN(amt) || amt <= 0) {
      this.error = '❌ Invalid transfer amount.';
      return;
    }

    if (amt > (sender.balance ?? 0)) {
      this.error = '❌ Insufficient balance.';
      return;
    }

    if (!sender.accountNo || !receiver.accountNo) {
      this.error = '❌ Invalid account numbers.';
      return;
    }

    console.log('Selected accounts:', {
      sender: {
        id: sender.id,
        accountNo: sender.accountNo,
        accountType: sender.accountType,
        balance: sender.balance
      },
      receiver: {
        id: receiver.id,
        accountNo: receiver.accountNo,
        accountType: receiver.accountType,
        balance: receiver.balance
      },
      amount: amt,
      description
    });

    this.isLoading = true;
    this.error = '';
    this.message = '';

    this.accountService.fundTransfer(sender, receiver, amt, description).subscribe({
      next: (res) => {
        const updatedSender: AccountInterface = res.sender ?? { ...sender, balance: sender.balance - amt };
        const updatedReceiver: AccountInterface = res.receiver ?? { ...receiver, balance: receiver.balance + amt };
        const debitTx: Transaction | null = res.debitTx ?? null;
        const creditTx: Transaction | null = res.creditTx ?? null;

        this.accounts = this.accounts.map(acc => {
          if (acc.id === updatedSender.id) return updatedSender;
          if (acc.id === updatedReceiver.id) return updatedReceiver;
          return acc;
        });

        this.userAccounts = this.userAccounts.map(acc =>
          acc.id === updatedSender.id ? updatedSender : acc
        );

        if (debitTx && !this.transactions.find(tx => tx.id === debitTx.id)) {
          this.transactions.unshift(debitTx);
        }
        if (creditTx && !this.transactions.find(tx => tx.id === creditTx.id)) {
          this.transactions.unshift(creditTx);
        }
        this.updateVisibleTransactions();

        this.message = '✅ Transfer successful!';
        this.error = '';
        this.transferForm.reset();
        this.selectedFromAccount = null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Transfer error:', err);
        this.isLoading = false;
        
        if (err.status === 400) {
          console.error('400 Error details:', err.error);
          if (err.error === 'Max number of elements reached for this resource!') {
            this.error = '❌ API limit reached. Please contact support or try again later.';
          } else {
            this.error = '❌ Invalid request data. Please check your transfer details.';
          }
        } else if (err.status === 404) {
          this.error = '❌ Account not found. Please refresh and try again.';
        } else if (err.status === 500) {
          this.error = '❌ Server error. Please try again later.';
        } else if (err.status === 0) {
          this.error = '❌ Network error. Please check your connection.';
        } else {
          this.error = err?.error?.message ?? err?.message ?? '❌ Transfer failed. Please try again.';
        }
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

  onFromAccountChange() {
    const acc = this.transferForm.get('fromAccount')?.value as AccountInterface | null;
    this.selectedFromAccount = acc;

    const amountCtrl = this.transferForm.get('amount');
    if (amountCtrl && acc) {
      if (amountCtrl.value && Number(amountCtrl.value) > (acc.balance ?? 0)) {
        amountCtrl.setValue(null);
      }
    }
  }
}
