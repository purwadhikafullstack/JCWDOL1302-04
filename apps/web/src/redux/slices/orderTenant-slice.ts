import { createSlice } from '@reduxjs/toolkit';
import {
  acceptOrderByTenantThunk,
  cancelOrderByTenantThunk,
  getOrderByUserId,
  rejectOrderByTenantThunk,
} from './orderTenant-thunk';

type TGetRoomsByUserId = {
  orderId: string;
  quantity: number;
  price: number;
  type: string;
};

export type TGetOrdersByUserId = {
  orderId: string;
  name: string;
  propertyCategory: string;
  status: string;
  totalPayment: number;
  checkIn: string;
  checkOut: string;
  expDateTime: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerGender?: string | null;
  rooms: TGetRoomsByUserId[];
};

type InitialState = {
  orders: TGetOrdersByUserId[];
  isLoading: boolean;
};

const initialState: InitialState = {
  orders: [],
  isLoading: true,
};

const orderTenantSlice = createSlice({
  name: 'orderTenant',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getOrderByUserId.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getOrderByUserId.fulfilled, (state, action) => {
      if (action.payload)
        state.orders = action.payload.error ? [] : action.payload.data;

      state.isLoading = false;
    });

    builder.addCase(cancelOrderByTenantThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(cancelOrderByTenantThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orders = action.payload.error
          ? state.orders
          : state.orders.map((data) => {
              if (action.payload)
                if (action.payload.data.orderId === data.orderId)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoading = false;
    });

    builder.addCase(acceptOrderByTenantThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(acceptOrderByTenantThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orders = action.payload.error
          ? state.orders
          : state.orders.map((data) => {
              if (action.payload)
                if (action.payload.data.orderId === data.orderId)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoading = false;
    });

    builder.addCase(rejectOrderByTenantThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(rejectOrderByTenantThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orders = action.payload.error
          ? state.orders
          : state.orders.map((data) => {
              if (action.payload)
                if (action.payload.data.orderId === data.orderId)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoading = false;
    });
  },
});

export const {} = orderTenantSlice.actions;
export default orderTenantSlice.reducer;
