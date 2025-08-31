import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgClass, DatePipe, NgIf } from "@angular/common";
import { AccountInterface } from '../../core/interfaces/account-interface';
import { Transaction } from '../../core/interfaces/transaction-interface';
import { AccountService } from '../../core/services/account';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgClass,DatePipe ,NgIf],
  
  templateUrl: './my-account.html',
  styleUrls: ['./my-account.css']
})
export class MyAccount  implements OnInit{
  account: AccountInterface | null = null;
  transactions: Transaction[] = [];
  displayedTransactions: Transaction[] = [];
  loading: boolean = true;
  error: string | null = null;
  itemsPerPage: number = 5; 
  currentPage: number = 1;
  constructor(private _AccountService:AccountService,
    private _Auth:Auth
  ) {}

  ngOnInit() {
    const user = this._Auth.getCurrentUser();
    if (!user) {
      this.error = 'User not logged in';
      this.loading = false;
      return;
    }
       this._AccountService.getAllAccounts().subscribe({
      next: (accounts) => {
        console.log('Accounts from API:', accounts);
    console.log('Current User:', user);
        this.account = accounts.find(acc => Number(acc.userId) === Number(user.id)) || null;
        console.log('Matched Account:', this.account);

        if (this.account) {
          this._AccountService.getTransactionsByAccount(this.account.accountNo).subscribe({
            next: (txs) => {
              this.transactions = txs;
               this.displayedTransactions = this.transactions.slice(0, this.itemsPerPage);
              this.loading = false;
            },
            error: () => {
              this.error = 'Failed to load transactions';
              this.loading = false;
            }
          });
        } else {
          this.error = 'No account found for this user';
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Failed to load account';
        this.loading = false;
      }
    });
  }
    loadMore() {
    this.currentPage++;
    const nextItems = this.transactions.slice(0, this.itemsPerPage * this.currentPage);
    this.displayedTransactions = nextItems;
  }
}