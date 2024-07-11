import { createSlice } from "@reduxjs/toolkit";
import { getSalesReportProperties } from "./salesReport-thunk";

export type TSalesReportProperty = {
  name: string;
  location: string;
  type: string;
  maxQuantity: number;
  totalQuantity: string;
  totalPenghasilan: number;
};

type InitialState = {
  salesReports: TSalesReportProperty[];
  isLoading: boolean;
};

const initialState: InitialState = {
  salesReports: [],
  isLoading: true,
};

const salesReportSlice = createSlice({
  name: 'salesReport',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getSalesReportProperties.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getSalesReportProperties.fulfilled, (state, action) => {
      if (action.payload)
        if (!action.payload.error)
          state.salesReports = action.payload.data

      state.isLoading = false;
    })
  },
})

const {} = salesReportSlice.actions;
export default salesReportSlice.reducer;