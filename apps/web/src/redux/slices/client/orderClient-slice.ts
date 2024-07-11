import { createSlice } from "@reduxjs/toolkit";
import { getOrderByClientOrderId } from "./orderClient-thunk";

type TRooms = {
  quantity: number;
  price: number;
  type: string;
  specialPrice: number | null;
  image: string;
  totalPrice: number;
};

type TGetOrdersByClientOrderId = {
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
  rooms: TRooms[]
}

type TInitialState = {
  orderDetail: TGetOrdersByClientOrderId;
  isLoading: boolean;
}

const initialState: TInitialState = {
  orderDetail: {} as TGetOrdersByClientOrderId,
  isLoading: true
}

const orderClientSlice = createSlice({
  name: "orderClient",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrderByClientOrderId.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getOrderByClientOrderId.fulfilled, (state, action) => {
      if (action.payload) {
        if (!action.payload.error)
          state.orderDetail = action.payload.data;
      };

      state.isLoading = false;
    })
  },
})

const {} = orderClientSlice.actions;
export default orderClientSlice.reducer;
