import { Component, OnInit, OnDestroy, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../core/services/user';
import { Role, UserInterface } from '../../core/interfaces/user-interface';

@Component({
  selector: 'app-admin-panel',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
  
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  
  isLoading = true;
  isSubmitting = false;
  
  searchTerm = '';
  selectedRole: 'Admin' | 'User' | '' = '';
  selectedStatus: string = '';
  
  isEditing = false;
  editingUserId: string | null = null;
  showAddForm = false;
  
  successMessage = '';
  errorMessage = '';
  
  userForm
  userForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('User', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });
  
  constructor(private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoading = true;
  }
  
  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.isLoading = true;
    
    if (this.userService.isUserDataLoaded()) {
      this.loadUsers();
    } else {
      setTimeout(() => {
        this.loadUsers();
      }, 100);
    }
  }
  
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.hideForm();
    }
  }
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
    this.isLoading = true;
    
    setTimeout(() => {
      try {
        if (this.searchTerm || this.selectedRole || this.selectedStatus !== '') {
          const filters: any = {};
          if (this.selectedRole) filters.role = this.selectedRole;
          if (this.selectedStatus !== '') {
            filters.isActive = this.selectedStatus === 'true';
          }
          
          console.log('Applying filters:', { searchTerm: this.searchTerm, filters });
          const filteredUsers = this.userService.searchUsers(this.searchTerm, filters);
          console.log('Filtered users count:', filteredUsers.length);
          
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.users = filteredUsers.slice(startIndex, endIndex);
          this.totalUsers = filteredUsers.length;
          this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
          this.hasNext = this.currentPage < this.totalPages;
          this.hasPrevious = this.currentPage > 1;
        } else {
          const paginationResult = this.userService.getUsersPaginated(this.currentPage, this.pageSize);
          this.users = paginationResult.users;
          this.totalUsers = paginationResult.totalCount;
          this.totalPages = paginationResult.totalPages;
          this.hasNext = paginationResult.hasNext;
          this.hasPrevious = paginationResult.hasPrevious;
        }
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error loading users:', error);
        this.showError('Failed to load users. Please try again.');
        this.isLoading = false;
      }
    }, 200);
  }
  
  refreshData(): void {
    this.userService.reloadFromStorage();
    this.currentPage = 1;
    this.loadUsers();
    this.showSuccess('Data refreshed successfully');
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }
  
  nextPage(): void {
    if (this.hasNext) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  previousPage(): void {
    if (this.hasPrevious) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  changePageSize(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1;
    this.loadUsers();
  }
  
  onSearch(): void {
    this.currentPage = 1;
    console.log('Search triggered:', { searchTerm: this.searchTerm, selectedRole: this.selectedRole, selectedStatus: this.selectedStatus });
    this.loadUsers();
  }
  
  onFilterChange(): void {
    this.currentPage = 1;
    console.log('Filter changed:', { searchTerm: this.searchTerm, selectedRole: this.selectedRole, selectedStatus: this.selectedStatus });
    this.loadUsers();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadUsers();
  }
  
  showAddUserForm(): void {
    this.showAddForm = true;
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.patchValue({ role: 'User' });
    this.clearMessages();
    this.lockBodyScroll();
  }
  
  hideForm(): void {
    this.showAddForm = false;
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.clearMessages();
    this.unlockBodyScroll();
  }
  
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
  
  submitForm(): void {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.userForm.value;
      
      setTimeout(() => {
        if (this.isEditing && this.editingUserId) {
          if (this.userService.isUsernameExists(formData.userName!, this.editingUserId)) {
            this.showError('Username already exists');
            this.isSubmitting = false;
            return;
          }
          if (this.userService.isEmailExists(formData.email!, this.editingUserId)) {
            this.showError('Email already exists');
            this.isSubmitting = false;
            return;
          }
          
          const updatedUser = this.userService.updateUser(this.editingUserId, {
            userName: formData.userName!,
            password: formData.password!,
            email: formData.email!,
            role: formData.role === 'Admin' ? Role.Admin : Role.User,
            phone: formData.phone!
          });
          
          if (updatedUser) {
            this.showSuccess(`User "${updatedUser.userName}" updated successfully`);
            this.loadUsers();
            this.hideForm();
          }
        } else {
          if (this.userService.isUsernameExists(formData.userName!)) {
            this.showError('Username already exists');
            this.isSubmitting = false;
            return;
          }
          if (this.userService.isEmailExists(formData.email!)) {
            this.showError('Email already exists');
            this.isSubmitting = false;
            return;
          }
          
          const newUser = this.userService.addUser({
            userName: formData.userName!,
            password: formData.password!,
            email: formData.email!,
           role: formData.role === 'Admin' ? Role.Admin : Role.User,
            phone: formData.phone!,
            isActive: true
          });
          
          this.showSuccess(`User "${newUser.userName}" added successfully`);
          this.loadUsers();
          this.hideForm();
        }
        
        this.isSubmitting = false;
      }, 500);
    } else {
      this.showError('Please fill in all required fields correctly');
    }
  }
  
  deleteUser(user: UserInterface): void {
    const success = this.userService.deleteUser(user.id);
    if (success) {
      this.showSuccess(`User "${user.userName}" deleted successfully`);
      this.loadUsers();
    } else {
      this.showError('Failed to delete user');
    }
  }
  
  toggleUserStatus(user: UserInterface): void {
    const previousState = user.isActive;
    const updatedUser = this.userService.toggleUserStatus(user.id);
    if (updatedUser) {
      const statusText = updatedUser.isActive ? 'activated' : 'deactivated';
      this.showSuccess(`User "${user.userName}" ${statusText} successfully`);
      this.loadUsers();
    } else {
      this.showError('Failed to update user status');
      user.isActive = previousState;
    }
  }
  
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.clearMessages(), 5000);
  }
  
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.clearMessages(), 5000);
  }
  
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
  
  get activeUsersCount(): number {
    return this.userService.getAllUsers().filter(u => u.isActive).length;
  }
  
  get adminUsersCount(): number {
    return this.userService.getAllUsers().filter(u => u.role === 'Admin').length;
  }
  
  get totalUsersCount(): number {
    return this.userService.getAllUsers().length;
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  private lockBodyScroll(): void {
     if (isPlatformBrowser(this.platformId)) {
    document.body.classList.add('modal-open');
  }
  }
  private unlockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }
  
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
  
  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalUsers);
  }
  
  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.selectedRole || this.selectedStatus !== '');
  }
  
  getActiveFilterCount(): number {
    let count = 0;
    if (this.searchTerm) count++;
    if (this.selectedRole) count++;
    if (this.selectedStatus !== '') count++;
    return count;
  }
}
