'use server';

import * as z from 'zod';
import { AccountSchema } from '@/schemas/account-schema';
import { api } from '@/lib/axios';
import axios from 'axios';

export const updateAccount = async (values: z.infer<typeof AccountSchema>) => {
  try {
    await api.put('users/account', values);

    return { success: 'Success Account Update!' };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        error: e.response?.data.message,
      };
    }
  }
};
