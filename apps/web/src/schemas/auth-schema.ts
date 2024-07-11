import * as z from 'zod'

export const SignupSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Must be 3 or more characters long'
    })
    .trim(),
  email: z
    .string()
    .email({
      message: 'Invalid email address'
    })
    .trim(),
  password: z
    .string()
    .min(6, {
      message: 'Must be 6 or more characters long'
    })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .trim(),
  role: z
    .string()
    .toUpperCase()
    .trim()
});

export const SigninSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address'
    })
    .trim(),
  password: z
    .string()
    .min(1, {
      message: 'Password is required'
    })
    .trim()
});
