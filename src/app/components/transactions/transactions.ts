// transactions.ts
import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../core/interfaces/transaction-interface';
import { TransactionFilterPipe } from '../../core/pipes/transaction-filter.pipe';
import { AccountService } from '../../core/services/account';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass, TransactionFilterPipe],
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class Transactions {
  transactions: Transaction[] = [];
  query: string = '';
  typeFilter: string = '';
  selectedTransaction: Transaction | null = null;
  visibleCount = 10;

  // new state handling
  isLoading = false;
  errorMessage = '';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.isLoading = true;
    this.accountService.getTransactions().subscribe({
      next: data => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = ' Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  get visibleTransactions() {
    return this.transactions.slice(0, this.visibleCount);
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
}
