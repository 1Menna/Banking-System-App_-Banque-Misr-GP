import { Component } from '@angular/core';
import { AdminNav } from "../../components/admin-nav/admin-nav";
import { AdminHome } from "../../components/admin-home/admin-home";
import { AdminPanel } from "../../components/admin-panel/admin-panel";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-layout',
  imports: [AdminNav, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
