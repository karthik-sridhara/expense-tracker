import { Budget } from "./budget";

export interface BudgetDialogData {
  mode: 'add' | 'edit';
  budget: Budget | null;
}

export interface BudgetDialogResult {
  saved: boolean;
}