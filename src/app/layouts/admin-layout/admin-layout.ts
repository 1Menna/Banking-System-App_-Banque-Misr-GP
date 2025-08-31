import { Component } from '@angular/core';
import { AdminNav } from "../../components/admin-nav/admin-nav";
import { AdminHome } from "../../components/admin-home/admin-home";
import { AdminPanel } from "../../components/admin-panel/admin-panel";
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../components/footer/footer';


@Component({
  selector: 'app-admin-layout',
  imports: [AdminNav, RouterOutlet,Footer],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

}
