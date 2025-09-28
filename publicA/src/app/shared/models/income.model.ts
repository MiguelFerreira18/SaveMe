export interface Income {
  id: number;
  symbol: string;
  description: string;
  amount: number;
  userId: string;
  date: Date;
  formattedDate?: string;
}

export interface CreateIncomeDto {
  currencyId: number;
  amount: number;
  description: string;
  date: string;
}
