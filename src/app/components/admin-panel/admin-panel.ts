import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../core/services/user';
import { UserInterface } from '../../core/user-interface';

@Component({
  selector: 'app-admin-panel',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit, OnDestroy {
  
  users: UserInterface[] = [];
  displayedColumns: string[] = ['username', 'email', 'phone', 'role', 'status', 'actions'];
  
  // Form states
  isEditing = false;
  editingUserId: number | null = null;
  showAddForm = false;
  
  // Messages
  successMessage = '';
  errorMessage = '';
  
  // User form
  userForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('User', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  // Handle clicking outside modal to close
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.hideForm();
    }
  }
  
  // Handle ESC key to close modal
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showAddForm) {
      this.hideForm();
    }
  }
  
  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }
  
  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }
  
  // Show add user form
  showAddUserForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.patchValue({ role: 'User' });
    this.clearMessages();
    this.lockBodyScroll();
  }
  
  // Hide form
  hideForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.clearMessages();
    this.unlockBodyScroll();
  }
  
  // Edit user
  editUser(user: UserInterface): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.showAddForm = true;
    this.userForm.patchValue({
      userName: user.userName,
      password: user.password,
      email: user.email,
      role: user.role,
      phone: user.phone
    });
    this.clearMessages();
    this.lockBodyScroll();
  }
  
  // Submit form (add or edit)
  submitForm(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      if (this.isEditing && this.editingUserId) {
        // Check for duplicate username/email (excluding current user)
        if (this.userService.isUsernameExists(formData.userName!, this.editingUserId)) {
          this.showError('Username already exists');
          return;
        }
        if (this.userService.isEmailExists(formData.email!, this.editingUserId)) {
          this.showError('Email already exists');
          return;
        }
        
        // Update user
        const updatedUser = this.userService.updateUser(this.editingUserId, {
          userName: formData.userName!,
          password: formData.password!,
          email: formData.email!,
          role: formData.role as 'Admin' | 'User',
          phone: formData.phone!
        });
        
        if (updatedUser) {
          this.showSuccess(`User "${updatedUser.userName}" updated successfully`);
          this.loadUsers();
          this.hideForm();
        }
      } else {
        // Check for duplicate username/email
        if (this.userService.isUsernameExists(formData.userName!)) {
          this.showError('Username already exists');
          return;
        }
        if (this.userService.isEmailExists(formData.email!)) {
          this.showError('Email already exists');
          return;
        }
        
        // Add new user
        const newUser = this.userService.addUser({
          userName: formData.userName!,
          password: formData.password!,
          email: formData.email!,
          role: formData.role as 'Admin' | 'User',
          phone: formData.phone!,
          isActive: true
        });
        
        this.showSuccess(`User "${newUser.userName}" added successfully`);
        this.loadUsers();
        this.hideForm();
      }
    } else {
      this.showError('Please fill in all required fields correctly');
    }
  }
  
  // Delete user
  deleteUser(user: UserInterface): void {
    const success = this.userService.deleteUser(user.id);
    if (success) {
      this.showSuccess(`User "${user.userName}" deleted successfully`);
      this.loadUsers();
    } else {
      this.showError('Failed to delete user');
    }
  }
  
  // Toggle user status
  toggleUserStatus(user: UserInterface): void {
    const previousState = user.isActive;
    const updatedUser = this.userService.toggleUserStatus(user.id);
    if (updatedUser) {
      const statusText = updatedUser.isActive ? 'activated' : 'deactivated';
      this.showSuccess(`User "${user.userName}" ${statusText} successfully`);
      this.loadUsers();
    } else {
      this.showError('Failed to update user status');
      // Revert the visual change if the update failed
      user.isActive = previousState;
    }
  }
  
  // Utility methods
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.clearMessages(), 5000); // Auto-dismiss after 5 seconds
  }
  
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.clearMessages(), 5000); // Auto-dismiss after 5 seconds
  }
  
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
  
  // Computed properties for template
  get activeUsersCount(): number {
    return this.users.filter(u => u.isActive).length;
  }
  
  get adminUsersCount(): number {
    return this.users.filter(u => u.role === 'Admin').length;
  }
  
  // Modal body scroll management
  private lockBodyScroll(): void {
    document.body.classList.add('modal-open');
  }
  
  private unlockBodyScroll(): void {
    document.body.classList.remove('modal-open');
  }
  
  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName} must be at least ${requiredLength} characters`;
      }
      if (field.errors['email']) return 'Please enter a valid email address';
    }
    return '';
  }
}
