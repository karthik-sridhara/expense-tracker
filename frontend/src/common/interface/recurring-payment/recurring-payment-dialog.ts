import { RecurringPayment } from './recurring-payment';

export interface RecurringPaymentDialogData {
  mode: 'add' | 'edit';
  recurringPayment: RecurringPayment | null;
}

export interface RecurringPaymentDialogResult {
  saved: boolean;
}
