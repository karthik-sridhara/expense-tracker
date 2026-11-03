import { Category } from '../category/category';

export interface Transaction {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  category: Category;
  transactionDate: string;
  createdAt: string;
  modifiedAt: string | null;
  userId: number;
}
