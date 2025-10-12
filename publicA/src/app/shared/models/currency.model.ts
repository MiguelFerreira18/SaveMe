export interface Currency {
  id: number;
  name: string;
  symbol: string;
}

export interface CreateCurrencyDto {
  name: string;
  symbol: string;
}
