export type TGetOrdersByUserId = {
  orderId: string;
  name: string;
  propertyCategory: string;
  status: string;
  totalPayment: number;
  checkIn: Date | string;
  checkOut: Date | string;
  expDateTime: Date | string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerGender: string | null;
};

export type TGetRoomsByUserId = {
  orderId: string;
  quantity: number;
  price: number;
  type: string;
  specialPrice?: number | null;
  totalPrice?: number;
};

export type CancelOrderReq = {
  userId: string;
  tenantId: string;
  invoiceId: string;
};

export type TGetOrdersByClientOrderId = {
  orderId: string;
  name: string;
  status: string;
  totalPayment: number;
  checkIn: Date | string;
  checkOut: Date | string;
  createAt: Date | string;
  expDateTime: Date | string;
  propertyId: string;
  totalDays: number;
  reviewId: string | null;
}

// Transform function
export const toGetOrdersByUserIdRes = ({
  orders,
  rooms,
}: {
  orders: TGetOrdersByUserId[];
  rooms: TGetRoomsByUserId[];
}) => {
  return orders.map((o) => {
    return {
      ...o,
      rooms: rooms.filter((r) => r.orderId === o.orderId),
    };
  });
};

export const toCancelOrderRes = (
  order: TGetOrdersByUserId & { rooms: TGetRoomsByUserId[] },
) => {
  return {
    order,
  };
};

export const toGetOrdersByClientOrderIdRes = ({
  orders,
  rooms,
}: {
  orders: TGetOrdersByClientOrderId[];
  rooms: TGetRoomsByUserId[];
}) => {
  return {
    ...orders[0],
    rooms: rooms
  }
};
