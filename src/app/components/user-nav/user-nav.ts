import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { UserInterface } from '../../core/interfaces/user-interface';


@Component({
  selector: 'app-user-nav',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './user-nav.html',
  styleUrl: './user-nav.css'
})
export class UserNav implements OnInit{
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
