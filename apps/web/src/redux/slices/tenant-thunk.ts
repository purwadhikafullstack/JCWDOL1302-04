import { api } from '@/lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as z from 'zod';
import {
  PropertySchema,
  UpdatePropertySchema,
} from '@/schemas/property-schema';
import { TProperty } from './tenant-slice';

export const getTenantPropertyCategoryThunk = createAsyncThunk(
  'tenant/getTenantPropertyCategory',
  async (props: { token: string }) => {
    try {
      const res = await api.get('properties/categories', {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      return { success: 'Success Get Category!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const getTenantPropertiesThunk = createAsyncThunk(
  'tenant/getTenantProperties',
  async (props: { token: string; id: string }) => {
    try {
      const res = await api.get(`properties/all/${props.id}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      return { success: 'Success Get Properties!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const getTenantDetailPropertyThunk = createAsyncThunk(
  'tenant/getTenantDetailProperty',
  async (props: { token: string; id: string; pId: string }) => {
    try {
      const res = await api.get(`properties/${props.id}/${props.pId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      return { success: 'Success Get Property!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const updateTenantDetailPropertyThunk = createAsyncThunk(
  'tenant/updateTenantDetailProperty',
  async (props: {
    token: string;
    id: string;
    pId: string;
    body: z.infer<typeof UpdatePropertySchema>;
  }) => {
    try {
      const res = await api.patch(
        `properties/${props.id}/${props.pId}`,
        { ...props.body },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return { success: 'Success Update Property!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const deleteTenantDetailPropertyThunk = createAsyncThunk(
  'tenant/deleteTenantDetailProperty',
  async (props: { token: string; id: string; pId: string }) => {
    try {
      const res = await api.delete(
        `properties/delete/${props.id}/${props.pId}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      );

      return { success: 'Success Delete Property!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const addTenantPropertyThunk = createAsyncThunk(
  'tenant/addTenantProperty',
  async (props: {
    token: string;
    email: string;
    body: z.infer<typeof PropertySchema>;
  }) => {
    try {
      const res = await api.post(
        'properties/',
        { email: props.email, ...props.body },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return {
        success: 'Success Add Property!',
        data: res.data.data,
      };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);
