import { RecurringType } from '../../enum/recurring-payment';
import { Category } from '../category/category';

export interface RecurringPayment {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  category: Category;
  recurring: RecurringType;
  day: number | null;
  month: number | null;
  endDate: string | null;
  active: boolean;
  createdAt: string;
  modifiedAt: string | null;
  userId: number;
}
