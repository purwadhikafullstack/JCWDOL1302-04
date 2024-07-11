import { createSlice } from "@reduxjs/toolkit";
import { deleteRoomAvailability, getPropretyRooms, getRoomAvailability, patchRoomAvailability, postRoomAvailability } from "./roomAvailability-thunk";

export type TPropertiesRooms = {
  name: string;
  rooms: {
    id: string;
    type: string;
    roomAvailabilitiesId: string | undefined
  }[]
}

export type TRoomAvailability = {
  name: string;
  type: string;
  roomId: string;
  roomAvailaId: string;
  fromDate: Date;
  toDate: Date;
}

type InitialState = {
  propertiesRooms: TPropertiesRooms[];
  roomAvailabilities: TRoomAvailability[];
  isLoading: boolean;
  refetch: boolean;
};

const initialState: InitialState = {
  propertiesRooms: [],
  roomAvailabilities: [],
  isLoading: true,
  refetch: false,
};

const roomAvailabilitySlice = createSlice({
  name: 'roomAvailability',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPropretyRooms.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getPropretyRooms.fulfilled, (state, action) => {
      if (action.payload)
        state.propertiesRooms = action.payload.error
          ? []
          : action.payload.data;

      state.isLoading = false;
    })

    builder.addCase(getRoomAvailability.pending, (state) => {
      state.isLoading = true;
    })
    builder.addCase(getRoomAvailability.fulfilled, (state, action) => {
      if (action.payload)
        state.roomAvailabilities = action.payload.error
          ? []
          : action.payload.data;

      state.isLoading = false;
    })

    builder.addCase(postRoomAvailability.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(postRoomAvailability.fulfilled, (state, action) => {
      if (action.payload)
        state.roomAvailabilities = action.payload.error
          ? [...state.roomAvailabilities]
          : [...state.roomAvailabilities, action.payload.data];

      state.isLoading = false;
      state.refetch = false;
    })

    builder.addCase(patchRoomAvailability.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(patchRoomAvailability.fulfilled, (state, action) => {
      if (action.payload)
        state.roomAvailabilities = action.payload.error
          ? [...state.roomAvailabilities]
          : state.roomAvailabilities.map((ra) => {
              if (action.payload)
                if (ra.roomAvailaId === action.payload?.data.id)
                  return {...ra, fromDate: action.payload.data.fromDate, toDate: action.payload.data.toDate};
              
              return ra;
            })

      state.isLoading = false;
      state.refetch = false;
    })

    builder.addCase(deleteRoomAvailability.pending, (state) => {
      state.isLoading = true;
      state.refetch = true;
    })
    builder.addCase(deleteRoomAvailability.fulfilled, (state, action) => {
      if (action.payload)
        state.roomAvailabilities = action.payload.error
          ? [...state.roomAvailabilities]
          : state.roomAvailabilities.filter((d) => d.roomAvailaId !== action.payload?.data.id);

      state.isLoading = false;
      state.refetch = false;
    })
  },
})

export const {} = roomAvailabilitySlice.actions;
export default roomAvailabilitySlice.reducer;
