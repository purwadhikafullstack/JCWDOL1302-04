import { api } from "@/lib/axios";
import { FromRoomAvailabilityPriceSchema } from "@/schemas/form-room-availability-price-schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";

export const getPropretyRooms = createAsyncThunk(
  'properties/rooms/:userId',
  async (props: {token: string; userId: string;}) => {
    const {userId, token} = props;
    try {
      const res = await api.get(`properties/rooms/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success Get Property Rooms!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const getRoomAvailability = createAsyncThunk(
  'room-availability/get',
  async (props: {token: string; userId: string;}) => {
    const {token, userId} = props;
    try {
      const res = await api.get(`room-availability/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success get room availability', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const postRoomAvailability = createAsyncThunk(
  'room-availability/post',
  async (props: {token: string, payload: z.infer<typeof FromRoomAvailabilityPriceSchema>}) => {
    const {payload, token} = props;
    try {
      const res = await api.post(`room-availability/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success add room availability', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const patchRoomAvailability = createAsyncThunk(
  'room-availability/patch',
  async (props: {token: string, payload: z.infer<typeof FromRoomAvailabilityPriceSchema>, id: string}) => {
    const {payload, token, id} = props;
    const newPayload = {fromDate: payload.fromDate, toDate: payload.toDate};
    try {
      const res = await api.patch(`room-availability/${id}`, newPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success update room availability', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const deleteRoomAvailability = createAsyncThunk(
  'room-availability/delete',
  async (props: {token: string; id: string;}) => {
    const {token, id} = props;
    try {
      const res = await api.delete(`room-availability/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success delete room availability', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)
