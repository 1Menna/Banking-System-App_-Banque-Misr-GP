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
  
  // Pagination properties
  currentPage = 1;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  
  // Loading states
  isLoading = true; // Start with loading state
  isSubmitting = false;
  
  // Search and filter properties
  searchTerm = '';
  selectedRole: 'Admin' | 'User' | '' = '';
  selectedStatus: boolean | '' = '';
  
  // Form states
  isEditing = false;
  editingUserId: string | null = null;
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
  
  constructor(private userService: UserService,
      @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Start with loading state until data is ready
    this.isLoading = true;
  }
  
  ngOnInit(): void {
    this.initializeData();
  }

  // Initialize data with proper loading state management
  private initializeData(): void {
    this.isLoading = true;
    
    // Check if user service has data loaded
    if (this.userService.isUserDataLoaded()) {
      // Data is already available, load immediately
      this.loadUsers();
    } else {
      // Wait a moment for service to initialize, then load
      setTimeout(() => {
        this.loadUsers();
      }, 100);
    }
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
    this.isLoading = true;
    
    // Small delay to ensure smooth loading experience
    setTimeout(() => {
      try {
        if (this.searchTerm || this.selectedRole || this.selectedStatus !== '') {
          // Apply search and filters
          const filters: any = {};
          if (this.selectedRole) filters.role = this.selectedRole;
          if (this.selectedStatus !== '') filters.isActive = this.selectedStatus;
          
          const filteredUsers = this.userService.searchUsers(this.searchTerm, filters);
          
          // Apply pagination to filtered results
          const startIndex = (this.currentPage - 1) * this.pageSize;
          const endIndex = startIndex + this.pageSize;
          this.users = filteredUsers.slice(startIndex, endIndex);
          this.totalUsers = filteredUsers.length;
          this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
          this.hasNext = this.currentPage < this.totalPages;
          this.hasPrevious = this.currentPage > 1;
        } else {
          // Use built-in pagination
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
    }, 200); // Slightly longer delay for better UX
  }
  
  // Refresh data manually
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
    this.currentPage = 1; // Reset to first page
    this.loadUsers();
  }
  
  // Search and filter methods
  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.loadUsers();
  }
  
  onFilterChange(): void {
    this.currentPage = 1; // Reset to first page when filtering
    this.loadUsers();
  }
  
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadUsers();
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
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.userForm.value;
      
      // Simulate async operation
      setTimeout(() => {
        if (this.isEditing && this.editingUserId) {
          // Check for duplicate username/email (excluding current user)
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
          
          // Update user
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
          // Check for duplicate username/email
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
          
          // Add new user
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
      }, 500); // Simulate network delay
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
    return this.userService.getAllUsers().filter(u => u.isActive).length;
  }
  
  get adminUsersCount(): number {
    return this.userService.getAllUsers().filter(u => u.role === 'Admin').length;
  }
  
  get totalUsersCount(): number {
    return this.userService.getAllUsers().length;
  }
  
  // Get page numbers for pagination display
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
  
  // Modal body scroll management
  
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
  
  // Utility method to get starting index for current page
  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }
  
  // Utility method to get ending index for current page
  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalUsers);
  }
}
