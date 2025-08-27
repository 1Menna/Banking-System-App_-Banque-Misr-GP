import { Injectable } from '@angular/core';
import { UserInterface } from '../user-interface';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  
  private users: UserInterface[] = [
    {
      id: 0,
      userName: 'Omar',
      password: '123456',
      role: 'User',
      isActive: true,
      email: 'omar@gmail.com',
      phone: '01114316342'
    },
    {
      id: 1,
      userName: 'Ahmed',
      password: '123456',
      role: 'Admin',
      isActive: true,
      email: 'ahmed@gmail.com',
      phone: '01004316342'
    },
  ]

  private storageKey = 'currentUser';

  login(_userName: string, _password: string): UserInterface | undefined {
    const username = _userName.trim();
    const password = _password.trim();

    const foundUser = this.users.find(
      user =>
        user.userName.toLowerCase() === username.toLowerCase() &&
        user.password === password &&
        user.isActive
    );

    if (foundUser) {
      // Save to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(foundUser));
    }

    return foundUser;
  }

  isLoggedIn()
  { 
    return !!localStorage.getItem(this.storageKey); 
  }

  getCurrentUser(): UserInterface | null {
    const userData = localStorage.getItem(this.storageKey);
    return userData ? JSON.parse(userData) : null;
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
