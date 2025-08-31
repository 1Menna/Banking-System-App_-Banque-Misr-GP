import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Role, UserInterface } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private readonly STORAGE_KEY = 'banking_app_users';
  private defaultUsers: UserInterface[] = [
    {
    //  
    id: "1",
    userName: "john_doe",
    password: "s3cur3P@ss1",
    role: Role.User,
    isActive: true,
    email: "john.doe@example.com",
    phone: "+15551234567"
  },
  {
    id: "2",
    userName: "admin_alice",
    password: "Adm!nP@ss2023",
    role: Role.Admin,
    isActive: true,
    email: "alice.admin@bank.com",
    phone: "+15559876543"
  },
  {
    id: "3",
    userName: "m_smith",
    password: "TempP@ss123",
    role: Role.User,
    isActive: false,
    email: "m.smith@example.com",
    phone: "+15557778888"
  },
  {
    id: "4",
    userName: "jane_white",
    password: "J@n3Wh!t3",
    role: Role.User,
    isActive: true,
    email: "jane.white@example.com",
    phone: "+15553334444"
  },
  {
    id: "5",
    userName: "sys_admin",
    password: "R00t@Bank!",
    role: Role.Admin,
    isActive: true,
    email: "sysadmin@bank.com",
    phone: "+15556667777"
  },
  {
    id: "6",
    userName: "inactive_user",
    password: "OldP@ss123",
    role: Role.User,
    isActive: false,
    email: "inactive@example.com",
    phone: "+15551112222"
  },
  {
    id: "7",
    userName: "robert_k",
    password: "R0b3rtK!",
    role: Role.User,
    isActive: true,
    email: "robert.k@example.com",
    phone: "+15554445555"
  },
  {
    id: "8",
    userName: "audit_admin",
    password: "Aud!tP@ss",
    role: Role.Admin,
    isActive: true,
    email: "audit@bank.com",
    phone: "+15558889999"
  },
  {
    id: "9",
    userName: "lisa_green",
    password: "L!s@2023",
    role: Role.User,
    isActive: true,
    email: "lisa.green@example.com",
    phone: "+15550001111"
  },
  {
    id: "10",
    userName: "support_admin",
    password: "Supp0rt!23",
    role: Role.Admin,
    isActive: true,
    email: "support@bank.com",
    phone: "+15552223333"
  },
  {
    id: "11",
    userName: "david_m",
    password: "D@v1dM#",
    role: Role.User,
    isActive: false,
    email: "david.m@example.com",
    phone: "+15556669999"
  },
  {
    id: "12",
    userName: "finance_admin",
    password: "F!n@nc3",
    role: Role.Admin,
    isActive: true,
    email: "finance@bank.com",
    phone: "+15557770000"
  },
  {
    id: "13",
    userName: "sarah_k",
    password: "S@r@h123",
    role: Role.User,
    isActive: true,
    email: "sarah.k@example.com",
    phone: "+15558881111"
  },
  {
    id: "14",
    userName: "security_admin",
    password: "S3cur!ty@",
    role: Role.Admin,
    isActive: true,
    email: "security@bank.com",
    phone: "+15559992222"
  },
  {
    id: "15",
    userName: "thomas_b",
    password: "Th0m@sB",
    role: Role.User,
    isActive: false,
    email: "thomas.b@example.com",
    phone: "+15551113333"
  },
  {
    id: "16",
    userName: "hr_admin",
    password: "Hr@Bank1",
    role: Role.Admin,
    isActive: true,
    email: "hr@bank.com",
    phone: "+15552224444"
  },
  {
    id: "17",
    userName: "emily_r",
    password: "3m!lyR#",
    role: Role.User,
    isActive: true,
    email: "emily.r@example.com",
    phone: "+15553335555"
  },
  {
    id: "18",
    userName: "it_admin",
    password: "1T@dmin!",
    role: Role.Admin,
    isActive: true,
    email: "it@bank.com",
    phone: "+15554446666"
  },
  {
    id: "19",
    userName: "inactive_customer",
    password: "OldP@ss456",
    role: Role.User,
    isActive: false,
    email: "inactive.customer@example.com",
    phone: "+15555557777"
  },
  {
    id: "20",
    userName: "marketing_admin",
    password: "M@rk3t!ng",
    role: Role.Admin,
    isActive: true,
    email: "marketing@bank.com",
    phone: "+15556668888"
  },
  {
    id: "21",
    userName: "peter_w",
    password: "P3t3rW!",
    role: Role.User,
    isActive: true,
    email: "peter.w@example.com",
    phone: "+15557779999"
  },
  {
    id: "22",
    userName: "operations_admin",
    password: "0p3r@t0r",
    role: Role.Admin,
    isActive: true,
    email: "operations@bank.com",
    phone: "+15558880000"
  },
  {
    id: "23",
    userName: "olivia_m",
    password: "0l!v1@M",
    role: Role.User,
    isActive: false,
    email: "olivia.m@example.com",
    phone: "+15559991111"
  },
  {
    id: "24",
    userName: "ceo_admin",
    password: "CE0@Bank!",
    role: Role.Admin,
    isActive: true,
    email: "ceo@bank.com",
    phone: "+15550002222"
  },
  {
    id: "25",
    userName: "james_l",
    password: "J@m3sL#",
    role: Role.User,
    isActive: true,
    email: "james.l@example.com",
    phone: "+15551114444"
  },
  {
    id: "26",
    userName: "compliance_admin",
    password: "C0mply!23",
    role: Role.Admin,
    isActive: true,
    email: "compliance@bank.com",
    phone: "+15552225555"
  },
  {
    id: "27",
    userName: "sophia_c",
    password: "S0ph!@C",
    role: Role.User,
    isActive: false,
    email: "sophia.c@example.com",
    phone: "+15553336666"
  },
  {
    id: "28",
    userName: "risk_admin",
    password: "R!sk@456",
    role: Role.Admin,
    isActive: true,
    email: "risk@bank.com",
    phone: "+15554447777"
  },
  {
    id: "29",
    userName: "daniel_t",
    password: "D@n13lT",
    role: Role.User,
    isActive: true,
    email: "daniel.t@example.com",
    phone: "+15555558888"
  },
  {
    id: "30",
    userName: "backend_admin",
    password: "B@ck3nd!",
    role: Role.Admin,
    isActive: true,
    email: "backend@bank.com",
    phone: "+15556669999"
  }
  ];

  private users: UserInterface[] = [];
  private nextId = '1';
  private isDataLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeUsers();
  }

  // Initialize users immediately and synchronously when possible
  private initializeUsers(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedUsers = localStorage.getItem(this.STORAGE_KEY);
      if (savedUsers) {
        try {
          this.users = JSON.parse(savedUsers);
          this.nextId = this.users.length 
            ? (Math.max(...this.users.map(u => +u.id)) + 1).toString()
            : '1';
          this.isDataLoaded = true;
          return;
        } catch (error) {
          console.error('Error parsing users from localStorage:', error);
          // Clear corrupted data
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    }
    
    // If no saved data or not in browser, use default users
    this.loadDefaultUsers();
  }

  // Load default users and save to storage
  private loadDefaultUsers(): void {
    this.users = [...this.defaultUsers];
    this.nextId = (this.users.length 
      ? (Math.max(...this.users.map(u => +u.id)) + 1) 
      : 1).toString();
    this.isDataLoaded = true;
    
    // Save default data to localStorage
    this.saveToStorage();
  }

  // Save users to localStorage
  private saveToStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
      } catch (error) {
        console.error('Error saving users to localStorage:', error);
      }
    }
  }



  // Get all users (now returns immediately available data)
  getAllUsers(): UserInterface[] {
    return [...this.users];
  }

  // Check if data has been loaded
  isUserDataLoaded(): boolean {
    return this.isDataLoaded;
  }

  // Force reload from localStorage (for manual refresh scenarios)
  reloadFromStorage(): void {
    this.initializeUsers();
  }

  // Get user by ID
  getUserById(id: string): UserInterface | undefined {
    return this.users.find(user => user.id === id);
  }

  // Add new user
  addUser(userData: Omit<UserInterface, 'id'>): UserInterface {
    const newUser: UserInterface = {
      ...userData,
      id: this.nextId
    };
    this.users.push(newUser);
    this.nextId = (parseInt(this.nextId) + 1).toString();
    this.saveToStorage();
    return newUser;
  }

  // Update user
  updateUser(id: string, userData: Partial<UserInterface>): UserInterface | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...userData };
      this.saveToStorage();
      return this.users[userIndex];
    }
    return null;
  }

  // Delete user
  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Toggle user active status
  toggleUserStatus(id: string): UserInterface | null {
    const user = this.users.find(user => user.id === id);
    if (user) {
      user.isActive = !user.isActive;
      this.saveToStorage();
      return user;
    }
    return null;
  }

  // Check if username exists (for validation)
  isUsernameExists(username: string, excludeId?: string): boolean {
    return this.users.some(user => 
      user.userName.toLowerCase() === username.toLowerCase() && 
      user.id !== excludeId
    );
  }

  // Check if email exists (for validation)
  isEmailExists(email: string, excludeId?: string): boolean {
    return this.users.some(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.id !== excludeId
    );
  }

  // Pagination and lazy loading methods
  getUsersPaginated(page: number = 1, pageSize: number = 10): {
    users: UserInterface[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  } {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = this.users.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.users.length / pageSize);

    return {
      users: paginatedUsers,
      totalCount: this.users.length,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }

  // Search and filter users
  searchUsers(searchTerm: string, filters?: {
    role?: 'Admin' | 'User';
    isActive?: boolean;
  }): UserInterface[] {
    console.log('UserService.searchUsers called with:', { searchTerm, filters });
    let filteredUsers = this.users;
    console.log('Total users before filtering:', filteredUsers.length);

    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.userName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
      console.log('Users after text search:', filteredUsers.length);
    }

    // Apply filters
    if (filters) {
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
        console.log('Users after role filter:', filteredUsers.length);
      }
      if (filters.isActive !== undefined) {
        console.log('Applying isActive filter:', filters.isActive);
        filteredUsers = filteredUsers.filter(user => user.isActive === filters.isActive);
        console.log('Users after isActive filter:', filteredUsers.length);
      }
    }

    console.log('Final filtered users:', filteredUsers.length);
    return filteredUsers;
  }

  // Clear all data and reset to defaults
  resetToDefaults(): void {
    this.users = [...this.defaultUsers];
    this.nextId = (this.users.length 
      ? (Math.max(...this.users.map(u => +u.id)) + 1) 
      : 1).toString();
    this.saveToStorage();
  }
}