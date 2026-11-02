import { RecurringType } from '../../enum/recurring-payment';

export interface RecurringPaymentUpsertRequest {
  name: string;
  description: string | null;
  recurring: RecurringType;
  day: number | null;
  month: number | null;
  amount: number;
  category: number;
  endDate: string | null;
}
