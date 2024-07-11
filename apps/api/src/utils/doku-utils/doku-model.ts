export type DOKURes = {
  message: string[];
  response: Response;
};

export type Response = {
  order: Order;
  payment: Payment;
  customer: Customer;
  additional_info: AdditionalInfo;
  uuid: number;
  headers: Headers;
};

export type AdditionalInfo = {
  origin: Origin;
  line_items: LineItem[];
};

export type LineItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Origin = {
  product: string;
  system: string;
  apiFormat: string;
  source: string;
};

export type Customer = {
  email: string;
  phone: string;
  name: string;
  address: string;
  country: string;
};

export type Headers = {
  request_id: string;
  signature: string;
  date: Date;
  client_id: string;
};

export type Order = {
  amount: string;
  invoice_number: string;
  currency: string;
  session_id: string;
  callback_url: string;
  line_items: LineItem[];
};

export type Payment = {
  payment_method_types: string[];
  payment_due_date: number;
  token_id: string;
  url: string;
  expired_date: string;
};

//

export type DOKUCheckRes = {
  order: Order;
  transaction: Transaction;
  service: Channel;
  acquirer: Acquirer;
  channel: Channel;
  virtual_account_info: VirtualAccountInfo;
  virtual_account_inquiry: VirtualAccountInquiry;
  virtual_account_payment: VirtualAccountPayment;
  additional_info: AdditionalInfo;
};

export type Acquirer = {
  id: string;
  name: string;
};

export type Channel = {
  id: string;
};

export type Transaction = {
  status: string;
  type: string;
  date: Date;
  original_request_id: string;
};

export type VirtualAccountInfo = {
  virtual_account_number: string;
  created_date: string;
  expired_date: string;
  reusable_status: boolean;
};

export type VirtualAccountInquiry = {
  status: string;
  date: string;
  channel_code: string;
};

export type VirtualAccountPayment = {
  identifier: Identifier[];
  date: string;
  status: string;
};

export type Identifier = {
  name: string;
  value: string;
};

//

export type AddDOKUPaymentRes = {
  message: string[];
  response: ResponseAddDOKUPaymentRes;
};

export type ResponseAddDOKUPaymentRes = {
  order: OrderAddDOKUPaymentRes;
  payment: Payment;
  customer: Customer;
  additional_info: AdditionalInfo;
  uuid: number;
  headers: Headers;
};

export type LineItemAddDOKUPaymentRes = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type HeadersAddDOKUPaymentRes = {
  request_id: string;
  signature: string;
  date: Date;
  client_id: string;
};

export type OrderAddDOKUPaymentRes = {
  amount: string;
  invoice_number: string;
  currency: string;
  session_id: string;
  callback_url: string;
  line_items: LineItemAddDOKUPaymentRes[];
};
