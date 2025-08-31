export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}
export interface Transaction {
  id: string | number;
  fromAccountNo: string;
  ToAccountNo: string;  // API expects capital 'T' based on existing data
  date: string | Date;
  amount: number;
  type: 'Debit' | 'Credit';
  description: string;
}

