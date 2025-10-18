export interface Currency {
  id: number;
  name: string;
  symbol: string;
}

export function createEmptyCurrency(): Currency {
  return {
    id: 0,
    name: '',
    symbol: '',
  };
}

export interface CreateCurrencyDto {
  name: string;
  symbol: string;
}
