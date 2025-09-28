export interface Wish {
  id: number;
  symbol: string;
  description: string;
  amount: number;
  userId: string;
  date: Date;
  formattedDate?: string;
}

export interface CreateWishDto {
  currenyId: number;
  description: string;
  amount: number;
  date: string;
}
