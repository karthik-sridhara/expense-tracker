export interface TransactionUpsertRequest {
  name: string;
  description: string | null;
  amount: number;
  category: number;
  transactionDate: string;
}
