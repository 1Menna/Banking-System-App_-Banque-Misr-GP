
export enum Role {
  Admin = 'Admin',
  User = 'User'
}
export interface UserInterface {
  id: string;
  userName: string;
  password: string;
  role: Role;
  isActive: boolean;
  email: string;
  phone: string;
}
