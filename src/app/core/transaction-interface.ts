export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}
export interface Transaction {
  id: string | number;
  fromAccountNo: string;
  ToAccountNo: string;
  date: string | Date;
  amount: number;
  type: 'Debit' | 'Credit';
  description: string;
}

