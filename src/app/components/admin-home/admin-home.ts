import { Component } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, RouterLink],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css'
})
export class AdminHome {

}
