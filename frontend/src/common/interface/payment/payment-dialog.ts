import { Payment, PaymentForListing } from './payment';

export interface PaymentDialogData {
  mode: 'add' | 'edit';
  payment: PaymentForListing | null;
}

export interface PaymentDialogResult {
  saved: boolean;
}
