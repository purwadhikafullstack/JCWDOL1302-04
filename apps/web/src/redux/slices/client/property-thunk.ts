import { api } from '@/lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CodeSquare } from 'lucide-react';

export const getPropertiesClientThunk = createAsyncThunk(
  'properties/client',
  async (reqQuery: {name: string | null; fromDate: string | null; toDate: string | null; sortPrice: string | null; page: string | null;}) => {
    try {
      let {name, fromDate, toDate, sortPrice, page} = reqQuery;
      if (!name) name = '';
      if (!fromDate) fromDate = '';
      if (!toDate) toDate = '';
      if (!sortPrice) sortPrice = '';
      if (!page) page = '';

      const res = await api.get(`properties/client?name=${name}&fromDate=${fromDate}&toDate=${toDate}&sortPrice=${sortPrice}&page=${page}`);

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

export const getPropertyDetailClientThunk = createAsyncThunk(
  'propertiesClient/getPropertyDetailClient',
  async ({ id }: { id: string }) => {
    try {
      const res = await api.get(`properties/client/${id}`);

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

export const getThreeTopPropertyClientThunk = createAsyncThunk(
  'propertiesClient/getThreeTopPropertyClient',
  async () => {
    try {
      const res = await api.get(`properties/client/top-property`);

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
