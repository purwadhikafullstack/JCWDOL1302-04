import { createSlice } from '@reduxjs/toolkit';
import { z } from 'zod';
import {
  addTenantRoomThunk,
  deleteTenantDetailRoomThunk,
  getTenantDetailRoomThunk,
  getTenantRoomsThunk,
  updateTenantDetailRoomThunk,
} from './room-thunk';

export type TRoom = {
  id: string;
  description: string;
  price: number;
  type: string;
  image: string;
};

type InitialState = {
  rooms: TRoom[];
  room?: TRoom;
  isLoadingRooms: boolean;
  isLoadingRoom: boolean;
};

const initialState: InitialState = {
  rooms: [],
  isLoadingRooms: true,
  isLoadingRoom: true,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getTenantRoomsThunk.pending, (state) => {
      state.isLoadingRooms = true;
    });
    builder.addCase(getTenantRoomsThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.rooms = action.payload.error
          ? [...state.rooms]
          : [...action.payload.data];

      state.isLoadingRooms = false;
    });

    builder.addCase(addTenantRoomThunk.pending, (state) => {
      state.isLoadingRooms = true;
    });
    builder.addCase(addTenantRoomThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.rooms = action.payload.error
          ? [...state.rooms]
          : [action.payload.data, ...state.rooms];

      state.isLoadingRooms = false;
    });

    builder.addCase(getTenantDetailRoomThunk.pending, (state) => {
      state.isLoadingRoom = true;
    });
    builder.addCase(getTenantDetailRoomThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.room = action.payload.error ? undefined : action.payload.data;

      state.isLoadingRoom = false;
    });

    builder.addCase(updateTenantDetailRoomThunk.pending, (state) => {
      state.isLoadingRoom = true;
    });
    builder.addCase(updateTenantDetailRoomThunk.fulfilled, (state, action) => {
      if (action.payload)
        state.rooms = action.payload.error
          ? state.rooms
          : state.rooms.map((data) => {
              if (action.payload)
                if (action.payload.data.id === data.id)
                  return {
                    ...action.payload.data,
                  };

              return data;
            });

      state.isLoadingRoom = false;
    });

    builder.addCase(deleteTenantDetailRoomThunk.pending, (state) => {
      state.isLoadingRoom = true;
    });
    builder.addCase(deleteTenantDetailRoomThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.rooms = action.payload.error
          ? state.rooms
          : state.rooms.filter((data) => data.id !== action.payload!.data.id);
      }

      state.isLoadingRoom = false;
    });
  },
});

export const {} = roomSlice.actions;
export default roomSlice.reducer;
