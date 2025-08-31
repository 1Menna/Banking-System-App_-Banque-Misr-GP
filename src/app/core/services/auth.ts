import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user-interface';
import { UserService } from './user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  private storageKey = 'currentUser';

  constructor(private userService: UserService) {}

  login(_userName: string, _password: string): UserInterface | undefined {
    const username = _userName.trim();
    const password = _password.trim();

    const users = this.userService.getAllUsers();
    const foundUser = users.find(
      user =>
        user.userName.toLowerCase() === username.toLowerCase() &&
        user.password === password &&
        user.isActive
    );

    if (foundUser) {
      localStorage.setItem(this.storageKey, JSON.stringify(foundUser));
    }

    return foundUser;
  }

  isLoggedIn()
  { 
    return !!localStorage.getItem(this.storageKey); 
  }

 getCurrentUser() {
  if (typeof window !== 'undefined' && localStorage) {
    const user = localStorage.getItem(this.storageKey); 
    return user ? JSON.parse(user) : null;
  }
  return null;
}

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  getUserRole() : string | null { 
    const userData = localStorage.getItem(this.storageKey);
    if (userData)
    { 
      const user: UserInterface = JSON.parse(userData);
      return user.role;
    }
    return null;
  }

}
