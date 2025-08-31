// transactions.ts
import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../core/interfaces/transaction-interface';
import { TransactionFilterPipe } from '../../core/pipes/transaction-filter.pipe';
import { AccountService } from '../../core/services/account';
import { Auth } from '../../core/services/auth';
import { AccountInterface } from '../../core/interfaces/account-interface';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, TransactionFilterPipe],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class Transactions {
  transactions: Transaction[] = [];
  userTransactions: Transaction[] = [];
  userAccounts: AccountInterface[] = [];
  query: string = '';
  typeFilter: string = '';
  selectedTransaction: Transaction | null = null;
  visibleCount = 10;

  // new state handling
  isLoading = false;
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.loadUserAccounts();
  }

  loadUserAccounts() {
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.userAccounts = accounts || [];
        
        // Get current user
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          // Filter accounts for current user
          this.userAccounts = this.userAccounts.filter(
            acc => acc.userId?.toString() === currentUser.id?.toString()
          );
          
          // Now load transactions for user's accounts
          this.fetchUserTransactions();
        } else {
          this.errorMessage = 'User not logged in';
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  fetchUserTransactions() {
    this.isLoading = true;
    this.accountService.getTransactions().subscribe({
      next: data => {
        this.transactions = data || [];
        
        // Filter transactions to only show those relevant to user's accounts
        this.userTransactions = this.transactions.filter(tx => {
          const fromAccount = this.userAccounts.find(acc => acc.accountNo === tx.fromAccountNo);
          const toAccount = this.userAccounts.find(acc => acc.accountNo === tx.ToAccountNo);
          
          // For transfers, show the transaction relevant to the user's perspective
          if (tx.description.includes('Transfer to') || tx.description.includes('Transfer from')) {
            if (fromAccount && tx.type === 'Debit') {
              // User is sender - show debit transaction (money leaving their account)
              return true;
            } else if (toAccount && tx.type === 'Credit') {
              // User is receiver - show credit transaction (money arriving to their account)
              return true;
            }
            return false; // Don't show the other side of the transfer
          }
          
          // For non-transfer transactions, show if user is sender or receiver
          return fromAccount || toAccount;
        });
        
        console.log('Filtered transactions:', {
          total: this.transactions.length,
          userTransactions: this.userTransactions.length,
          userAccounts: this.userAccounts.map(acc => acc.accountNo)
        });
        
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Failed to load transactions';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get visibleTransactions() {
    return this.userTransactions.slice(0, this.visibleCount);
  }

  loadMore() {
    this.visibleCount += 10;
  }

  showDetails(t: Transaction) {
    this.selectedTransaction = t;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }

  refreshTransactions() {
    this.loadUserAccounts();
  }
  onDelete(id: string) {
    if(confirm('Are you sure you want to delete this transaction?')) {
      this.accountService.deleteTransaction(id).subscribe(() => {
        this.transactions = this.transactions.filter(tx => tx.id !== id);
        alert('Transaction deleted successfully');
      });
    }
  }
}
