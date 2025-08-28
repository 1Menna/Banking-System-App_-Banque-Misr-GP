import { Component } from '@angular/core';
import { CurrencyPipe, NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgClass],
  templateUrl: './my-account.html',
  styleUrls: ['./my-account.css']
})
export class MyAccount {
  account = {
    accountNumber: "ACC001",
    accountType: "Savings",
    balance: 5000.00,
  };

  transactions = [
    { description: "Salary deposit", date: "Jan 15, 2024", amount: 1000, type: "credit" },
    { description: "Grocery shopping", date: "Jan 14, 2024", amount: -250, type: "debit" },
    { description: "Freelance payment", date: "Jan 13, 2024", amount: 500, type: "credit" }
  ];
}