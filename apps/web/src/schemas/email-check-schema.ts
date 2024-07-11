import * as z from 'zod';

export const EmailCheckSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address',
    })
    .trim(),
});
