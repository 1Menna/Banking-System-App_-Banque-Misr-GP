import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { UserInterface } from '../../core/interfaces/user-interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf , CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  
  errorMessage = '';

  constructor(private _authService: Auth, private _Router:Router) { }

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  submit(): void
  { 
    if (this.loginForm.valid)
    {
      const { userName, password } = this.loginForm.value;
      const user:UserInterface | undefined = this._authService.login(userName ??'', password ??'');

      if (user)
      {
        if (user.role === 'Admin')
        { 
          this._Router.navigate(['/admin']);
        }
        else {
          this._Router.navigate(['/user']);
        }
        this.loginForm.reset();
      }
      else
      {
        this.errorMessage = 'Username or password is incorrect';
      }
    }
    else
    {
      this.errorMessage ='Please fill in all required fields';
    }
  }

}
