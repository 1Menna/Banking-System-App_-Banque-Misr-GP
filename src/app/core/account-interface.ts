export interface AccountInterface {
  id: number;
  accountNo: string;
  accountType: 'Savings' | 'Current';
  balance: number;
  userId: number;
}
