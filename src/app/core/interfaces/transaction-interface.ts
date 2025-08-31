export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}
export interface Transaction {
  id: string ;
  fromAccountNo: string;
  ToAccountNo: string;
  date: string | Date;
  amount: number;
  type: 'Debit' | 'Credit';
  description: string;
}

