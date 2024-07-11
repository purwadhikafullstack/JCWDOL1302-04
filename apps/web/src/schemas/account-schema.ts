import * as z from 'zod';

export const AccountSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Must be 3 or more characters long',
    })
    .trim(),
  birthdate: z.date({
    required_error: 'A date of birth is required.',
  }),
  gender: z
    .string()
    .min(1, {
      message: 'Must be 1 characters long',
    })
    .max(1, {
      message: 'Must be 1 characters long',
    }),
});
