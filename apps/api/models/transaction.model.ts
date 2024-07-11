export type AddDOKUPayment = {
  userId: string;
  pId: string;
  rooms: DokuRoomBokingProperty[];
  checkIn: Date;
  checkOut: Date;
};

export type AddBokingProperty = {
  userId: string;
  pId: string;
  rooms: RoomBokingProperty[];
  checkIn: Date;
  checkOut: Date;
};

export type CheckBokingPropertyReq = {
  userId: string;
  invoiceId: string;
};

export type DokuRoomBokingProperty = {
  roomId: string;
  quantity: number;
};

export type RoomBokingProperty = {
  roomId: string;
  price: number;
  quantity: number;
};

export type OrderType = {
  id: string;
  userId: string;
  expDateTime: Date;
  status: string;
  totalPayment: number;
  invoiceId: string;
  urlPayment: string;
  checkIn: Date;
  checkOut: Date;
  orderProperty: OrderPropertyType;
  orderRooms: OrderRoomType[];
  createAt: Date;
  updateAt: Date;
};

export type OrderPropertyType = {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  image: string;
};

export type OrderRoomType = {
  id: string;
  image: string;
  description: string;
  type: string;
  quantity: number;
  price: number;
};

export type DOKUPaymentType = {
  order: Order;
  payment: Payment;
  customer: Customer;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
};

export type Order = {
  amount: number;
  invoice_number: string;
  currency: string;
  session_id: string;
  callback_url: string;
  line_items: LineItem[];
};

export type LineItem = {
  name: string;
  price: number;
  quantity: number;
};

export type LineItemCheckBookingRes = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  specialPrice: number | null;
  quantity: number;
};

export type Payment = {
  payment_due_date: number;
};

export const toAddBokingProperty = (order: OrderType) => order;

export const toGetBokingsProperty = (order: OrderType[]) => [...order];
