import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface AccountInterface {
  id: number;
  accountNo: string;
  accountType: 'Savings' | 'Current';
  balance: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://68a063076e38a02c58188d9c.mockapi.io/bankingsystem/Account'; 

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<AccountInterface[]> {
    return this.http.get<AccountInterface[]>(this.apiUrl);
  }
}