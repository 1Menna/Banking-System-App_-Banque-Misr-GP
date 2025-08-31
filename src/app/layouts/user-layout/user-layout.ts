import { Component } from '@angular/core';
import { UserNav } from "../../components/user-nav/user-nav";
import { UserHome } from "../../components/user-home/user-home";
import { MyAccount } from "../../components/my-account/my-account";
import { Transactions } from "../../components/transactions/transactions";
import { Transfer } from "../../components/transfer/transfer";
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-user-layout',
  imports: [UserNav,RouterOutlet,Footer],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css'
})
export class UserLayout {

}
