import { createSlice } from '@reduxjs/toolkit';
import {
  addBookingClientThunk,
  cancelBookingsClientThunk,
  checkBookingClientThunk,
  getBookingsClientThunk,
  updateBookingsClientThunk,
} from './transaction-thunk';

export type TOrderData = {
  id: string;
  expDateTime: Date;
  status: string;
  totalPayment: number;
  urlPayment: string;
  checkIn: Date;
  checkOut: Date;
  invoiceId: string;
  userId: string;
  orderRooms: TOrderRoom[];
  orderProperty: TOrderProperty;
  createAt: Date;
  updateAt: Date;
};

export type TOrderProperty = {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  category: string;
};

export type TOrderRoom = {
  id: string;
  image: string;
  description: string;
  type: string;
  quantity: number;
  price: number;
};

export type TCheckBooking = {
  totalAmount: number;
  line_items: TLineItem[];
};

export type TLineItem = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  specialPrice: number | null;
  quantity: number;
};

type TInitialState = {
  isLoadingCheckBooking: boolean;
  isLoadingAddBooking: boolean;
  isLoadingGetBookings: boolean;
  orderList: TOrderData[];
  preOrderList?: TCheckBooking;
};

const initialState: TInitialState = {
  isLoadingCheckBooking: false,
  isLoadingAddBooking: false,
  isLoadingGetBookings: true,
  orderList: [],
};

const transactionClientSlice = createSlice({
  name: 'transactionClient',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    // addBookingClientThunk
    builder.addCase(addBookingClientThunk.pending, (state) => {
      state.isLoadingAddBooking = true;
    });
    builder.addCase(addBookingClientThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orderList = action.payload.error
          ? [...state.orderList]
          : [...state.orderList, action.payload.data];

      state.isLoadingAddBooking = false;
    });

    builder.addCase(getBookingsClientThunk.pending, (state) => {
      state.isLoadingGetBookings = true;
    });
    builder.addCase(getBookingsClientThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orderList = action.payload.error
          ? [...state.orderList]
          : [...action.payload.data];

      state.isLoadingGetBookings = false;
    });

    builder.addCase(updateBookingsClientThunk.pending, (state) => {
      state.isLoadingGetBookings = true;
    });
    builder.addCase(updateBookingsClientThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orderList = action.payload.error
          ? state.orderList
          : state.orderList.map((data) => {
              if (action.payload)
                if (action.payload.data.id === data.id)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoadingGetBookings = false;
    });

    builder.addCase(cancelBookingsClientThunk.pending, (state) => {
      state.isLoadingGetBookings = true;
    });
    builder.addCase(cancelBookingsClientThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.orderList = action.payload.error
          ? state.orderList
          : state.orderList.map((data) => {
              if (action.payload)
                if (action.payload.data.id === data.id)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoadingGetBookings = false;
    });

    builder.addCase(checkBookingClientThunk.pending, (state) => {
      state.isLoadingCheckBooking = true;
      state.preOrderList = undefined;
    });
    builder.addCase(checkBookingClientThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.preOrderList = action.payload.error
          ? undefined
          : action.payload.data;

      state.isLoadingCheckBooking = false;
    });
  },
});

export const {} = transactionClientSlice.actions;
export default transactionClientSlice.reducer;
