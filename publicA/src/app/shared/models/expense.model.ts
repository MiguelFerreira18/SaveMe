export interface Expense {
  id: number;
  category: string;
  symbol: string;
  description: string;
  amount: number;
  userId: string;
  date: Date;
}
