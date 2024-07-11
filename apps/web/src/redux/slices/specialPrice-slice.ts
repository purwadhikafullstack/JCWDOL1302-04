import { createSlice } from "@reduxjs/toolkit";
import { deleteSpecialPrice, getSpecialPrices, patchSpecialPrice, postSpecialPrice } from "./specialPrice-thunk";

export type TSpecialPrice = {
  name: string;
  type: string;
  roomId: string;
  specialPriceId: string;
  price: number;
  fromDate: Date;
  toDate: Date | null;
}

type InitialState = {
  specialPrices: TSpecialPrice[];
  isLoading: boolean;
  refetch: boolean;
};

const initialState: InitialState = {
  specialPrices: [],
  isLoading: true,
  refetch: false,
};

const specialPriceSlice = createSlice({
  name: 'specialPrice',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getSpecialPrices.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getSpecialPrices.fulfilled, (state, action) => {
      if (action.payload)
        state.specialPrices = action.payload.error
          ? []
          : action.payload.data;

      state.isLoading = false;
    })

    builder.addCase(postSpecialPrice.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(postSpecialPrice.fulfilled, (state, action) => {
      if (action.payload)
        state.specialPrices = action.payload.error
          ? [...state.specialPrices]
          : [...state.specialPrices, action.payload.data];

      state.isLoading = false;
      state.refetch = false;
    })

    builder.addCase(patchSpecialPrice.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(patchSpecialPrice.fulfilled, (state, action) => {
      if (action.payload)
        state.specialPrices = action.payload.error
          ? [...state.specialPrices]
          : state.specialPrices.map((sp) => {
              if (action.payload)
                if (sp.specialPriceId === action.payload?.data.id)
                  return {...sp, price: action.payload.data.price, fromDate: action.payload.data.fromDate, toDate: action.payload.data.toDate};
              
              return sp;
            })

      state.isLoading = false;
      state.refetch = false;
    })

    builder.addCase(deleteSpecialPrice.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(deleteSpecialPrice.fulfilled, (state, action) => {
      if (action.payload)
        state.specialPrices = action.payload.error
          ? [...state.specialPrices]
          : state.specialPrices.filter((d) => d.specialPriceId !== action.payload?.data.id);

      state.isLoading = false;
      state.refetch = false;
    })
  }
})

export const {} = specialPriceSlice.actions;
export default specialPriceSlice.reducer;
