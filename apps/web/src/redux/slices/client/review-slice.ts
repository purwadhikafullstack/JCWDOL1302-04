import { createSlice } from "@reduxjs/toolkit";
import { getReviewsByPropertyId, postReview } from "./review-thunk";

export type TGetReviewsByPropertyId = {
  id: string;
  point: number;
  comment: string;
  createAt: Date | string;
  updateAt: Date | string;
  name: string;
  image: string | null;
  orderRooms: TGetOrderRooms[]
}

type TGetOrderRooms = {
  type: string;
}

type InitialState = {
  propertyReviews: TGetReviewsByPropertyId[];
  isLoading: boolean;
  refetch: boolean;
}

const initialState: InitialState = {
  propertyReviews: [],
  isLoading: true,
  refetch: false,
}

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(postReview.pending, (state) => {
      state.refetch = true;
    })
    builder.addCase(postReview.fulfilled, (state, action) => {
      state.refetch = false;
    })

    builder.addCase(getReviewsByPropertyId.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getReviewsByPropertyId.fulfilled, (state, action) => {
      if (action.payload)
        if (!action.payload.error)
          state.propertyReviews = action.payload.data

      state.isLoading = false;
    })
  },
})

const {} = reviewSlice.actions;
export default reviewSlice.reducer;