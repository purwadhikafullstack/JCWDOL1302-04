export type AddSpecialPriceReq = {
  price: number;
  fromDate: Date;
  toDate?: Date | null;
  roomId: string;
}

export type UpdateSpecialPriceReq = {
  price: number;
  fromDate: Date;
  toDate?: Date | null;
}

export type GetSpecialPriceRes = {
  name: string;
  type: string;
  roomId: string;
  specialPriceId: string;
  price: number;
  fromDate: Date;
  toDate: Date | null;
}
