import { api } from "@/lib/axios";
import { FormSpecialPriceSchema } from "@/schemas/specialPrice-schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";

export const getSpecialPrices = createAsyncThunk(
  'special-price/get',
  async (props: {token: string; userId: string;}) => {
    const {token, userId} = props;
    try {
      const res = await api.get(`special-price/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success get special prices', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const postSpecialPrice = createAsyncThunk(
  'special-price/post',
  async (props: {token: string, payload: z.infer<typeof FormSpecialPriceSchema>}) => {
    const {payload, token} = props;
    try {
      const res = await api.post(`special-price/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success add special room price', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const patchSpecialPrice = createAsyncThunk(
  'special-price/patch',
  async (props: {token: string, payload: z.infer<typeof FormSpecialPriceSchema>, id: string}) => {
    const {payload, token, id} = props;
    const newPayload = {price: payload.price, fromDate: payload.fromDate, toDate: payload.toDate};
    try {
      const res = await api.patch(`special-price/${id}`, newPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success update special room price', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)

export const deleteSpecialPrice = createAsyncThunk(
  'special-price/delete',
  async (props: {token: string; id: string;}) => {
    const {token, id} = props;
    try {
      const res = await api.delete(`special-price/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success delete special room price', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)
