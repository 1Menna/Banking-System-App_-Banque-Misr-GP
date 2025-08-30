import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { UserInterface } from '../../core/interfaces/user-interface';

@Component({
  selector: 'app-admin-nav',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.css'
})
export class AdminNav implements OnInit {
  constructor(private _Auth:Auth,private _Router:Router){}
  currentUser!:null|UserInterface;
 ngOnInit(): void {
     this.currentUser = this._Auth.getCurrentUser();
 }
  logout() {
    this._Auth.logout();
    this._Router.navigate(['/login']); 
  }

}
