import { api } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrderByClientOrderId = createAsyncThunk(
  'propertiesClient/getPropertyDetailClient',
  async ({ token, orderId }: { token: string; orderId: string }) => {
    try {
      const res = await api.get(`order/detail/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: "Success get order detail", data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  },
);