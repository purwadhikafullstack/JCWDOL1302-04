import { api } from '@/lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addBookingClientThunk = createAsyncThunk(
  'transactionClient/addBookingClient',
  async ({
    userId,
    pId,
    checkIn,
    checkOut,
    rooms,
    token,
  }: {
    userId: string;
    pId: string;
    checkIn: Date;
    checkOut: Date;
    rooms: {
      roomId: string;
      quantity: number;
    }[];
    token: string;
  }) => {
    try {
      const res = await api.post(
        `transaction/booking`,
        {
          userId,
          pId,
          checkIn,
          checkOut,
          rooms: rooms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { success: 'Success Add Order', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const checkBookingClientThunk = createAsyncThunk(
  'transactionClient/checkBookingClient',
  async ({
    userId,
    pId,
    checkIn,
    checkOut,
    rooms,
    token,
  }: {
    userId: string;
    pId: string;
    checkIn: Date;
    checkOut: Date;
    rooms: {
      roomId: string;
      quantity: number;
    }[];
    token: string;
  }) => {
    try {
      const res = await api.post(
        `transaction/checking`,
        {
          userId,
          pId,
          checkIn,
          checkOut,
          rooms: rooms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { success: res.data.success, data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const getBookingsClientThunk = createAsyncThunk(
  'transactionClient/getBookingsClient',
  async ({ userId, token }: { userId: string; token: string }) => {
    try {
      const res = await api.get(`transaction/bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: res.data.success, data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const updateBookingsClientThunk = createAsyncThunk(
  'transactionClient/updateBookingsClient',
  async ({
    userId,
    invoiceId,
    token,
  }: {
    userId: string;
    invoiceId: string;
    token: string;
  }) => {
    try {
      const res = await api.get(
        `transaction/booking/check/${userId}/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { success: res.data.success, data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const cancelBookingsClientThunk = createAsyncThunk(
  'transactionClient/cancelBookingsClientThunk',
  async ({
    userId,
    invoiceId,
    token,
  }: {
    userId: string;
    invoiceId: string;
    token: string;
  }) => {
    try {
      const res = await api.patch(
        `transaction/booking/cancel/${userId}/${invoiceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return { success: res.data.success, data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);
