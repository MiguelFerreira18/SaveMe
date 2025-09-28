export interface Expense {
  id: number;
  category: string;
  symbol: string;
  description: string;
  amount: number;
  userId: string;
  date: Date;
  formattedDate?: string;
}

export interface CreateExpenseDto {
  currencyId: number;
  categoryId: number;
  amount: number;
  description: string;
  date: string;
}
