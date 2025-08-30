import { Pipe, PipeTransform } from '@angular/core';
import { Transaction } from '../interfaces/transaction-interface';

@Pipe({
  name: 'transactionFilter',
  standalone: true
})
export class TransactionFilterPipe implements PipeTransform {
  transform(transactions: Transaction[], query: string = '', typeFilter: string = ''): Transaction[] {
    if (!transactions) return [];
    
    const q = query.trim().toLowerCase();

    return transactions.filter(t => {
      const matchType = !typeFilter || t.type === typeFilter;
      const matchText = !q || t.description.toLowerCase().includes(q);
      return matchType && matchText;
    });
  }
}

