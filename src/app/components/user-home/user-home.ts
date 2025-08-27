import { Component } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-home',
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, RouterLink],
  templateUrl: './user-home.html',
  styleUrl: './user-home.css'
})
export class UserHome {
  longText = `The Chihuahua is a Mexican breed of toy dog. It is named for the
  Mexican state of Chihuahua and is among the smallest of all dog breeds. It is
  usually kept as a companion animal or for showing.`;
}
