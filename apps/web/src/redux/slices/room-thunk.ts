import { api } from '@/lib/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as z from 'zod';
import { RoomSchema, UpdateRoomSchema } from '@/schemas/room-schema';

export const getTenantRoomsThunk = createAsyncThunk(
  'tenant/getTenantRooms',
  async (props: { token: string; id: string; pId: string }) => {
    try {
      const res = await api.get(`rooms/all/${props.id}/${props.pId}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      return { success: 'Success Get Rooms!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const getTenantDetailRoomThunk = createAsyncThunk(
  'tenant/getTenantDetailRoom',
  async (props: { token: string; id: string; pId: string; rId: string }) => {
    try {
      const res = await api.get(
        `rooms/detail/${props.id}/${props.pId}/${props.rId}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      );

      return { success: 'Success Get Room!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const updateTenantDetailRoomThunk = createAsyncThunk(
  'tenant/updateTenantDetailRoom',
  async (props: {
    token: string;
    id: string;
    pId: string;
    rId: string;
    body: z.infer<typeof UpdateRoomSchema>;
  }) => {
    try {
      const res = await api.patch(
        `rooms/update/${props.id}/${props.pId}/${props.rId}`,
        { ...props.body },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return { success: 'Success Update Room!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const deleteTenantDetailRoomThunk = createAsyncThunk(
  'tenant/deleteTenantDetailRoom',
  async (props: { token: string; id: string; pId: string; rId: string }) => {
    try {
      const res = await api.delete(
        `rooms/delete/${props.id}/${props.pId}/${props.rId}`,
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        },
      );

      return { success: 'Success Delete Room!', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);

export const addTenantRoomThunk = createAsyncThunk(
  'tenant/addTenantRoom',
  async (props: {
    token: string;
    id: string;
    pId: string;
    body: z.infer<typeof RoomSchema>;
  }) => {
    try {
      const res = await api.post(
        `rooms/create/${props.id}/${props.pId}`,
        { ...props.body },
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return {
        success: 'Success Add Room!',
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
