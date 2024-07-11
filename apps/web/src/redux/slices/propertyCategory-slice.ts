import { createSlice } from "@reduxjs/toolkit";
import { deletePropertyCategoryThunk, getPropertyCategoryThunk, patchPropertyCategoryThunk, postPropertyCategoryThunk } from "./propertyCategory-thunk";

export type TPropertyCategory = {
  id: number;
  name: string;
};

type InitialState = {
  data: TPropertyCategory[];
  isLoading: boolean;
}

const initialState: InitialState = {
  data: [],
  isLoading: true
}

const propertyCategorySlice = createSlice({
  name: "propertyCategory",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPropertyCategoryThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPropertyCategoryThunk.fulfilled, (state, action) => {
      if (action.payload) state.data = action.payload.data;

      state.isLoading = false;
    });

    builder.addCase(postPropertyCategoryThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(postPropertyCategoryThunk.fulfilled, (state, action) => {
      if (action.payload) state.data = action.payload.error ? [ ...state.data ] : [ ...state.data, action.payload.data ];

      state.isLoading = false;
    })

    builder.addCase(patchPropertyCategoryThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(patchPropertyCategoryThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.data = action.payload.error ? [ ...state.data ] : state.data.map((d) => d.id === action.payload?.data.id ? {...d, name: action.payload.data.name} : d)
      };

      state.isLoading = false;
    })

    builder.addCase(deletePropertyCategoryThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deletePropertyCategoryThunk.fulfilled, (state, action) => {
      if (action.payload) state.data = action.payload.error ? [ ...state.data ] : state.data.filter((d) => d.id !== action.payload?.data.id);

      state.isLoading = false;
    })
  }
})

export const {} = propertyCategorySlice.actions;
export default propertyCategorySlice.reducer;
