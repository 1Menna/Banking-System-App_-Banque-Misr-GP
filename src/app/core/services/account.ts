import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountInterface } from '../interfaces/account-interface';
import { Transaction } from '../interfaces/transaction-interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Account';
  private transactionUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Transaction';

  constructor(private http: HttpClient) {}


  getAccounts(): Observable<AccountInterface[]> {
    return this.http.get<AccountInterface[]>(this.accountUrl);
  }

  getAccountById(id: string): Observable<AccountInterface> {
    return this.http.get<AccountInterface>(`${this.accountUrl}/${id}`);
  }

  updateAccount(id: string, account: AccountInterface): Observable<AccountInterface> {
    return this.http.put<AccountInterface>(`${this.accountUrl}/${id}`, account);
  }


  getTransactionsByAccount(accountNo: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionUrl, {
      params: { fromAccountNo: accountNo }
    });
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionUrl, transaction);
  }
  
  getTransactions(): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(this.transactionUrl);
}

getTransactionById(id: string): Observable<Transaction> {
  return this.http.get<Transaction>(`${this.transactionUrl}/${id}`);
}

updateTransaction(id: string, transaction: Transaction): Observable<Transaction> {
  return this.http.put<Transaction>(`${this.transactionUrl}/${id}`, transaction);
}

deleteTransaction(id: string): Observable<void> {
  return this.http.delete<void>(`${this.transactionUrl}/${id}`);
}

}

