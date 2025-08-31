import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { importProvidersFrom } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('banking_system_app');
}
