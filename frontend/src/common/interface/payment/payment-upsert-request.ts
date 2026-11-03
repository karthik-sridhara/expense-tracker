export interface PaymentUpsertRequest {
  name: string;
  description: string | null;
  amount: number;
  categoryId: number;
  dueDate: string;
}
