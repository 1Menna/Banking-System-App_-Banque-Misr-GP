import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('banking_system_app');
}
