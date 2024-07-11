'use server';

import * as z from 'zod';
import { AuthError, CredentialsSignin } from 'next-auth';
import { signIn, signOut } from '@/auth';
import { SigninSchema, SignupSchema } from '@/schemas/auth-schema';
import { api } from '@/lib/axios';
import axios, { AxiosError } from 'axios';
import { DEFAULT_LOGIN_REDIRECT_AS_USER } from '@/routes';

export const singup = async (values: z.infer<typeof SignupSchema>) => {
  try {
    await api.post('users/', { ...values });

    return { success: 'Success signup!' };
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return {
        error: e.response?.data.message,
      };
    }
  }
};

export const signin = async (values: z.infer<typeof SigninSchema>) => {
  try {
    await signIn('credentials', {
      ...values,
      redirectTo: DEFAULT_LOGIN_REDIRECT_AS_USER,
    });
  } catch (e) {
    if (e instanceof AuthError) {
      if (e.cause?.err instanceof AxiosError) {
        return { error: e.cause.err.response?.data.message };
      }

      return { error: 'Something went wrong!' };
    }
    throw e;
  }
};

export const signout = async () => {
  await signOut({ redirectTo: '/signin', redirect: true });
};
