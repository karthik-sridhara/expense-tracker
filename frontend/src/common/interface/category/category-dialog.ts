import { Category } from "./category";


export interface CategoryDialogData {
  mode: 'add' | 'edit';
  category: Category | null;
}

export interface CategoryDialogResult {
  saved: boolean;
}