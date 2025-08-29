import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Transaction, TransactionType } from '../../core/transaction-interface';
import { FormsModule} from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule,NgClass],
  standalone: true,
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class Transactions  {
  transactions: Transaction[] = [];
  query: string='';
  typeFilter: string = ''; // 'Credit' | 'Debit' | ''
  selectedTransaction: Transaction | null= null;
  

constructor(private http: HttpClient) {}

  ngOnInit(){
    this.http.get<Transaction[]>('https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Transaction').subscribe(data=> {
      this.transactions = data;
    })
  }

  filtered(): Transaction[] {
    const q=this.query.trim().toLowerCase();

    return this.transactions.filter(t =>{
      const matchType  = !this.typeFilter || t.type === this.typeFilter as TransactionType;
      const matchText = !q || t.description.toLocaleLowerCase().includes(q);
      return matchType  && matchText;
    });
  }
    showDetails(t: Transaction) {
    this.selectedTransaction = t;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }
  get filteredTransactions(): Transaction[] {
  return this.filtered();
}
}
