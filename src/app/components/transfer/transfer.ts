import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account';
import { AccountInterface } from '../../core/interfaces/account-interface';
import { Transaction } from '../../core/interfaces/transaction-interface';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css']
})
export class Transfer implements OnInit {
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
  query: string = '';
  typeFilter: string = '';
  selectedTransaction: Transaction | null = null;
  selectedFromAccount: AccountInterface | null = null;
  constructor(private fb: FormBuilder, private accountService: AccountService) {}
  
  ngOnInit() {
  this.transferForm = this.fb.group({
    fromAccount: [null, Validators.required],
    toAccount: [null, Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    description: ['']
  });
  
    this.loadAccounts();
  }
onFromAccountChange() {
  this.selectedFromAccount = this.transferForm.value.fromAccount;

  if (this.selectedFromAccount) {
    console.log("Selected From Account:", this.selectedFromAccount);

    // Example: reset amount if it's > balance
    const amount = this.transferForm.get('amount')?.value;
    if (amount && amount > this.selectedFromAccount.balance) {
      this.transferForm.get('amount')?.setValue(null);
    }
  }
}
  // 🔹 Load Accounts
  loadAccounts() {
  this.accountService.getAllAccounts().subscribe({
    next: (accounts) => {
      this.accounts = accounts;

      const userId = localStorage.getItem('userId');
      console.log("userId from localStorage:", userId);
      console.log("RAW accounts from API:", accounts);

      this.userAccounts = accounts.filter(acc => acc.userId?.toString() === userId);
      console.log("Filtered user accounts:", this.userAccounts);
    },
    error: () => this.errorMessage = "Failed to load accounts"
  });
}

  // 🔹 Load Transactions
  loadTransactions() {
    this.isLoading = true;
    this.accountService.getTransactions().subscribe({
      next: (txs) => {
        this.transactions = txs.reverse(); // latest first
        this.updateVisibleTransactions();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load transactions";
        this.isLoading = false;
      }
    });
  }

  // 🔹 Load More Transactions
  loadMore() {
    this.visibleCount += 5;
    this.updateVisibleTransactions();
  }

  updateVisibleTransactions() {
    this.visibleTransactions = this.transactions.slice(0, this.visibleCount);
  }

  // 🔹 Transfer Funds
  onSubmit() {
    if (this.transferForm.invalid) return;

    const { fromAccount, toAccount, amount, description } = this.transferForm.value;

     const sender: AccountInterface = fromAccount;
     const receiver: AccountInterface = toAccount;

    if (!sender || !receiver) {
      this.error = 'Invalid account selected.';
      return;
    }

    this.accountService.fundTransfer(sender, receiver, amount, description).subscribe({
      next: ({ debitTx, creditTx }) => {
        this.message = '✅ Transfer successful!';
        this.error = '';
        this.transactions.unshift(debitTx, creditTx); // push on top
        this.updateVisibleTransactions();
        this.loadAccounts(); // refresh balances
        this.transferForm.reset();
      },
      error: (err) => {
        this.error = err.message || '❌ Transfer failed.';
        this.message = '';
      }
    });
  }

  // 🔹 Show Transaction Details
  showDetails(tx: Transaction) {
    this.selectedTransaction = tx;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }
}
