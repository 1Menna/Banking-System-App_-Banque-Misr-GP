import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { Footer } from "./components/footer/footer";
import { UserLayout } from './layouts/user-layout/user-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer,UserLayout,AdminLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('banking_system_app');
}
