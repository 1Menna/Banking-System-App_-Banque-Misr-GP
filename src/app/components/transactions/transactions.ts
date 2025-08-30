import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Transaction } from '../../core/interfaces/transaction-interface';
import { FormsModule} from '@angular/forms'; 
import { HttpClient } from '@angular/common/http';
import { TransactionFilterPipe } from '../../core/pipes/transaction-filter.pipe'; // import pipe

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, NgClass, TransactionFilterPipe],
  standalone: true,
  templateUrl: './transactions.html',
  styleUrls: ['./transactions.css']
})
export class Transactions  {
  transactions: Transaction[] = [];
  query: string='';
  typeFilter: string = ''; 
  selectedTransaction: Transaction | null= null;
  visibleCount = 10; // initially show 10

  get visibleTransactions() {
  return this.transactions.slice(0, this.visibleCount);
  }

  loadMore() {
  this.visibleCount += 10;
  }
  constructor(private http: HttpClient) {}

  ngOnInit(){
    this.http.get<Transaction[]>('https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Transaction')
      .subscribe(data=> {
        this.transactions = data; // <-- all 71 transactions loaded here
      });
  }

  showDetails(t: Transaction) {
    this.selectedTransaction = t;
  }

  closeDetails() {
    this.selectedTransaction = null;
  }
}
