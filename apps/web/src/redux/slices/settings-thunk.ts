import { api } from '@/lib/axios';
import { AccountSchema } from '@/schemas/account-schema';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { z } from 'zod';

export const updateAccountThunk = createAsyncThunk(
  'settings/updateAccount',
  async (input: { id: string; values: z.infer<typeof AccountSchema> }) => {
    try {
      const res = await api.put(`users/account/${input.id}`, input.values);

      return { success: 'Success Account Update!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const getAccountThunk = createAsyncThunk(
  'settings/getAccount',
  async (id: string) => {
    try {
      const res = await api.get(`users/account/${id}`);

      return { success: 'Success Get Account!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const changeUserpasswordThunk = createAsyncThunk(
  'settings/changeUserpassword',
  async (input: { email: string; password: string }) => {
    try {
      const res = await api.post(`users/change-password/`, input);

      return { success: 'Success Update Account!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const checkEmailThunk = createAsyncThunk(
  'settings/checkEmail',
  async (input: { email: string }) => {
    try {
      const res = await api.post(`users/check-email/`, input);

      return { success: 'Success Check Email!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);
