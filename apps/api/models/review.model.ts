export type AddReviewReq = {
  orderId: string;
  point: number;
  comment: string;
};

export type TGetReviewsByPropertyId = {
  id: string;
  point: number;
  comment: string;
  order_id: string;
  createAt: Date | string;
  updateAt: Date | string;
  name: string;
  image: string | null;
}

export type TGetOrderRooms = {
  orderId: string;
  type: string;
}

export const toGetReviewsByPropertyIdRes = ({
  reviews,
  orderRooms
}:{
  reviews: TGetReviewsByPropertyId[];
  orderRooms: TGetOrderRooms[];
}) => {
  return reviews.map((r) => {
    return {
      ...r,
      orderRooms: orderRooms.filter((ors) => ors.orderId === r.order_id)
    };
  });
};
