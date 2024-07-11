import * as z from 'zod';

export const ChangePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: 'Must be 6 or more characters long',
      })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .trim(),
    password_confirm: z
      .string()
      .min(6, {
        message: 'Must be 6 or more characters long',
      })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .trim(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'password tidak cocok',
    path: ['password_confirm'],
  });
