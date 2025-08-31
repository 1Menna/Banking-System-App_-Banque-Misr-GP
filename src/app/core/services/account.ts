import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountInterface } from '../interfaces/account-interface';
import { Transaction } from '../interfaces/transaction-interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Account';
  private transactionUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Transaction';

  constructor(private http: HttpClient) { }

  // ---------------- Accounts ----------------
  getAllAccounts(): Observable<AccountInterface[]> {
    return this.http.get<AccountInterface[]>(this.accountUrl);
  }

  getAccountById(id: string): Observable<AccountInterface> {
    return this.http.get<AccountInterface>(`${this.accountUrl}/${id}`);
  }

  updateAccount(id: string, account: AccountInterface): Observable<AccountInterface> {
    console.log('Updating account:', { id, account });
    return this.http.put<AccountInterface>(`${this.accountUrl}/${id}`, account);
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.accountUrl}/${id}`);
  }

  // ---------------- Transactions ----------------
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionUrl);
  }

  getTransactionsByAccount(accountNo: string): Observable<Transaction[]> {
  return this.http.get<Transaction[]>(this.transactionUrl).pipe(
    map(transactions =>
      transactions.filter(
        tx => tx.fromAccountNo === accountNo || tx.ToAccountNo === accountNo
      )
    )
  );
}

  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
    console.log('Creating transaction:', JSON.stringify(transaction, null, 2));
    
    // Validate required fields
    if (!transaction.fromAccountNo || !transaction.ToAccountNo) {
      return throwError(() => new Error('Missing required account numbers'));
    }
    
    if (!transaction.amount || transaction.amount <= 0) {
      return throwError(() => new Error('Invalid amount'));
    }
    
    if (!transaction.type || !['Debit', 'Credit'].includes(transaction.type)) {
      return throwError(() => new Error('Invalid transaction type'));
    }
    
    return this.http.post<Transaction>(this.transactionUrl, transaction);
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

  // ---------------- Fund Transfer ----------------
  fundTransfer(
    fromAccount: AccountInterface,
    toAccount: AccountInterface,
    amount: number,
    description: string
  ): Observable<any> {
    if (fromAccount.balance < amount) {
      return throwError(() => new Error('Insufficient balance'));
    }

    // Validate account numbers
    if (!fromAccount.accountNo || !toAccount.accountNo) {
      return throwError(() => new Error('Invalid account numbers'));
    }

    // 1️⃣ update balances
    const updatedSender = { ...fromAccount, balance: fromAccount.balance - amount };
    const updatedReceiver = { ...toAccount, balance: toAccount.balance + amount };

    // 2️⃣ create transaction objects with proper field names
    const debitTransaction: Omit<Transaction, 'id'> = {
      fromAccountNo: fromAccount.accountNo,
      ToAccountNo: toAccount.accountNo,   // API expects capital 'T'
      date: new Date().toISOString(),
      amount: Number(amount),
      type: 'Debit',
      description: description || `Transfer to ${toAccount.accountNo}`
    };

    const creditTransaction: Omit<Transaction, 'id'> = {
      fromAccountNo: fromAccount.accountNo,
      ToAccountNo: toAccount.accountNo,   // API expects capital 'T'
      date: new Date().toISOString(),
      amount: Number(amount),
      type: 'Credit',
      description: description || `Transfer from ${fromAccount.accountNo}`
    };

    console.log('Transfer details:', {
      fromAccount: fromAccount.accountNo,
      toAccount: toAccount.accountNo,
      amount,
      description
    });

    // 3️⃣ perform API calls in parallel
    return forkJoin([
      this.updateAccount(fromAccount.id.toString(), updatedSender),
      this.updateAccount(toAccount.id.toString(), updatedReceiver),
      this.addTransaction(debitTransaction),
      this.addTransaction(creditTransaction)
    ]).pipe(
      map(([senderRes, receiverRes, debitTx, creditTx]) => ({
        sender: senderRes,
        receiver: receiverRes,
        debitTx,
        creditTx
      }))
    );
  }
}
