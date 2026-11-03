import { Transaction } from './transaction';

export interface TransactionDialogData {
  mode: 'add' | 'edit';
  transaction: Transaction | null;
}

export interface TransactionDialogResult {
  saved: boolean;
}
