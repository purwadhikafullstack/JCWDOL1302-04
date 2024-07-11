import { api } from "@/lib/axios";
import { FromRoomAvailabilityPriceSchema } from "@/schemas/form-room-availability-price-schema";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";

export const getSalesReportProperties = createAsyncThunk(
  'sales-report/user/:userId',
  async (props: {token: string; userId: string;}) => {
    const {userId, token} = props;
    try {
      const res = await api.get(`sales-report/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: 'Success Get Sales Report Property', data: res.data.data };
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return {
          error: e.response?.data.message,
        };
      }
    }
  }
)
