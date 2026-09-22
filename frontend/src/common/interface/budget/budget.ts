import { BudgetType } from '../../enum/budget';
import { Category } from '../category/category';

export interface Budget {
  id: number;
  category: Category;
  durationType: BudgetType;
  amount: number;
  createdAt: string;
  modifiedAt: string | null;
  userId: number;
}


