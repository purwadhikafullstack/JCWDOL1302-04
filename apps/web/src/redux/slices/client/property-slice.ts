import { createSlice } from '@reduxjs/toolkit';
import {
  getPropertiesClientThunk,
  getPropertyDetailClientThunk,
  getThreeTopPropertyClientThunk,
} from './property-thunk';

export type TPropertiesClient = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  rating: number | null;
};

export type TThreeTopProperties = {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  review: number;
};

export type TPropertyDetailClient = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  category: string;
  rooms: TRoomClient[];
};

export type TRoomClient = {
  id: string;
  type: string;
  description: string;
  image: string;
  roomPrice: number;
  specialPrices: SpecialPrice[];
  roomAvailabilities: RoomAvailability[];
};

export type RoomAvailability = {
  id: string;
  fromDate: Date;
  toDate: Date;
  roomId: string;
  price: number;
};

export type SpecialPrice = {
  id: string;
  fromDate: Date;
  toDate: Date;
  roomId: string;
  price: number;
};

type TInitialState = {
  properties: TPropertiesClient[];
  threeTopProperties: TThreeTopProperties[];
  properyDetail?: TPropertyDetailClient;
  totalPage?: number;
  totalResult?: number;
  isLoading: boolean;
  isPropertyDetailLoading: boolean;
  isThreeTopPropertyLoading: boolean;
};

const initialState: TInitialState = {
  properties: [],
  threeTopProperties: [],
  isLoading: true,
  isPropertyDetailLoading: true,
  isThreeTopPropertyLoading: true,
};

const propertiesClientSlice = createSlice({
  name: 'propertiesClient',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPropertiesClientThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPropertiesClientThunk.fulfilled, (state, action) => {
      if (action.payload) {
        if (!action.payload.error) {
          state.properties = action.payload.data.properties;
          state.totalPage = action.payload.data.totalPage;
          state.totalResult = action.payload.data.totalResult;
        }
      }

      state.isLoading = false;
    });

    builder.addCase(getPropertyDetailClientThunk.pending, (state) => {
      state.isPropertyDetailLoading = true;
    });
    builder.addCase(getPropertyDetailClientThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.properyDetail = action.payload.data;
      } else {
        state.properyDetail = undefined;
      }

      state.isPropertyDetailLoading = false;
    });

    builder.addCase(getThreeTopPropertyClientThunk.pending, (state) => {
      state.isThreeTopPropertyLoading = true;
    });
    builder.addCase(
      getThreeTopPropertyClientThunk.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.threeTopProperties =
            action.payload.error || !action.payload.data
              ? state.threeTopProperties
              : action.payload.data;
        }
        state.isThreeTopPropertyLoading = false;
      },
    );
  },
});

export const {} = propertiesClientSlice.actions;
export default propertiesClientSlice.reducer;
