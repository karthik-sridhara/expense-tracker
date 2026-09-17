export interface CategoryUpsertRequest {
  name: string;
  description: string;
  icon: string;
  isIncome: boolean;
  isUniversal: boolean;
  isActive: boolean;
}