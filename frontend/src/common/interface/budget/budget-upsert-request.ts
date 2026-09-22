import { BudgetType } from '../../enum/budget';

export interface BudgetUpsertRequest {
  category: number;
  durationType: BudgetType;
  amount: number;
}