import { Injectable } from '@angular/core';
import { UserInterface } from '../user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private users: UserInterface[] = [
    {
      id: 1,
      userName: 'Omar',
      password: '123456',
      role: 'User',
      isActive: true,
      email: 'omar@gmail.com',
      phone: '01114316342'
    },
    {
      id: 2,
      userName: 'Ahmed',
      password: '123456',
      role: 'Admin',
      isActive: true,
      email: 'ahmed@gmail.com',
      phone: '01004316342'
    },
    {
      id: 3,
      userName: 'Sarah',
      password: '789012',
      role: 'User',
      isActive: false,
      email: 'sarah@gmail.com',
      phone: '01234567890'
    },
    {
      id: 4,
      userName: 'Mohamed',
      password: '345678',
      role: 'User',
      isActive: true,
      email: 'mohamed@gmail.com',
      phone: '01123456789'
    }
  ];

  private nextId = 5;

  // Get all users
  getAllUsers(): UserInterface[] {
    return [...this.users];
  }

  // Get user by ID
  getUserById(id: number): UserInterface | undefined {
    return this.users.find(user => user.id === id);
  }

  // Add new user
  addUser(userData: Omit<UserInterface, 'id'>): UserInterface {
    const newUser: UserInterface = {
      ...userData,
      id: this.nextId++
    };
    this.users.push(newUser);
    return newUser;
  }

  // Update user
  updateUser(id: number, userData: Partial<UserInterface>): UserInterface | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      return this.users[userIndex];
    }
    return null;
  }

  // Delete user
  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    return false;
  }

  // Toggle user active status
  toggleUserStatus(id: number): UserInterface | null {
    const user = this.users.find(user => user.id === id);
    if (user) {
      user.isActive = !user.isActive;
      return user;
    }
    return null;
  }

  // Check if username exists (for validation)
  isUsernameExists(username: string, excludeId?: number): boolean {
    return this.users.some(user => 
      user.userName.toLowerCase() === username.toLowerCase() && 
      user.id !== excludeId
    );
  }

  // Check if email exists (for validation)
  isEmailExists(email: string, excludeId?: number): boolean {
    return this.users.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.id !== excludeId
    );
  }
}