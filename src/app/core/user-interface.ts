export interface UserInterface {
  id: number;
  userName: string;
  password: string;
  role: 'Admin' | 'User';
  isActive: boolean;
  email: string;
  phone: string;
}
