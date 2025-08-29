import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Transaction, TransactionType } from '../../core/transaction-interface';
import { FormsModule} from '@angular/forms'; 
@Component({
  selector: 'app-transactions',
  imports: [CommonModule, NgClass, FormsModule],
  standalone: true,
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions  {
  transactions: Transaction[] = [];
  query: string='';
  typeFilter: string = ''; // 'Credit' | 'Debit' | ''

  filtered(): Transaction[] {
    const q=this.query.trim().toLowerCase();

    return this.transactions.filter(t =>{
      const matchType  = !this.typeFilter || t.type === this.typeFilter as TransactionType;
      const matchText = !q || t.description.toLocaleLowerCase().includes(q);
      return matchType  && matchText;
    })
  }
  get filteredTransactions(): Transaction[] {
  return this.filtered();
}
}
