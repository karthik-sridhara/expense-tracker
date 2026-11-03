import { Category } from '../category/category';

export interface Payment {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  categoryId: number;
  categoryName: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

export interface PaymentForListing extends Payment {
  category: Category | null;
}