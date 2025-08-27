import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-user-nav',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './user-nav.html',
  styleUrl: './user-nav.css'
})
export class UserNav {

}
