import { createSlice } from '@reduxjs/toolkit';
import { z } from 'zod';
import {
  addTenantPropertyThunk,
  deleteTenantDetailPropertyThunk,
  getTenantDetailPropertyThunk,
  getTenantPropertiesThunk,
  getTenantPropertyCategoryThunk,
  updateTenantDetailPropertyThunk,
} from './tenant-thunk';
import { TPropertyCategory } from './propertyCategory-slice';

export type TProperty = {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  propertyCategoryId: number;
};

type InitialState = {
  properties: TProperty[];
  property?: TProperty;
  categories: TPropertyCategory[];
  isLoadingCategories: boolean;
  isLoadingProperties: boolean;
  isLoadingProperty: boolean;
};

const initialState: InitialState = {
  properties: [],
  categories: [],
  isLoadingCategories: true,
  isLoadingProperties: true,
  isLoadingProperty: true,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getTenantPropertyCategoryThunk.pending, (state) => {
      state.isLoadingCategories = true;
    });
    builder.addCase(
      getTenantPropertyCategoryThunk.fulfilled,
      (state, action) => {
        if (action.payload) state.categories = action.payload.data;

        state.isLoadingCategories = false;
      },
    );

    builder.addCase(getTenantPropertiesThunk.pending, (state) => {
      state.isLoadingProperties = true;
    });
    builder.addCase(getTenantPropertiesThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.properties = action.payload.error
          ? [...state.properties]
          : [...action.payload.data];

      state.isLoadingProperties = false;
    });

    builder.addCase(addTenantPropertyThunk.pending, (state) => {
      state.isLoadingProperties = true;
    });
    builder.addCase(addTenantPropertyThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.properties = action.payload.error
          ? [...state.properties]
          : [action.payload.data, ...state.properties];

      state.isLoadingProperties = false;
    });

    builder.addCase(getTenantDetailPropertyThunk.pending, (state) => {
      state.isLoadingProperty = true;
    });
    builder.addCase(getTenantDetailPropertyThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.property = action.payload.error ? undefined : action.payload.data;

      state.isLoadingProperty = false;
    });

    builder.addCase(updateTenantDetailPropertyThunk.pending, (state) => {
      state.isLoadingProperty = true;
    });
    builder.addCase(
      updateTenantDetailPropertyThunk.fulfilled,
      (state, action) => {
        if (action.payload)
          state.properties = action.payload.error
            ? state.properties
            : state.properties.map((data) => {
                if (action.payload)
                  if (action.payload.data.id === data.id)
                    return {
                      ...action.payload.data,
                    };

                return data;
              });

        state.isLoadingProperty = false;
      },
    );

    builder.addCase(deleteTenantDetailPropertyThunk.pending, (state) => {
      state.isLoadingProperty = true;
    });
    builder.addCase(
      deleteTenantDetailPropertyThunk.fulfilled,
      (state, action) => {
        if (action.payload) {
          state.properties = action.payload.error
            ? state.properties
            : state.properties.filter(
                (data) => data.id !== action.payload!.data.id,
              );
        }

        state.isLoadingProperty = false;
      },
    );
  },
});

export const {} = tenantSlice.actions;
export default tenantSlice.reducer;
