export interface Investment {
  id: number;
  strategyType: string;
  symbol: string;
  description: string;
  amount: number;
  userId: string;
  date: Date;
  formattedDate?: string;
}

export interface CreateInvestmentDto {
  currencyId: number;
  strategyTypeId: number;
  amount: number;
  description: string;
  date: string;
}
