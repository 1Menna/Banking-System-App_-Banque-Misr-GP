import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-my-account',
   imports: [CurrencyPipe],
  templateUrl: './my-account.html',
  styleUrls: ['./my-account.css']
})
export class MyAccount {
  account = {
    name: "John Doe",
    accountNumber: "1234 5678 9101",
    balance: 2500.75,
    email: "john.doe@email.com",
    phone: "+20123456789"
  };

  constructor() {}

  ngOnInit(): void {}
}

