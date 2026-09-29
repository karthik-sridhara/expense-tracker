import { User } from "./user-management";

export interface UserDialogData {
  mode: 'add' | 'edit';
  user: User | null;
}

export interface UserDialogResult {
  saved: boolean;
}