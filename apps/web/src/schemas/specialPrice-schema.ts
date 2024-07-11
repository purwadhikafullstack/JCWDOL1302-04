import * as z from 'zod';

export const FormSpecialPriceSchema = z.object({
  roomId: z
    .string()
    .min(1, {
      message: "Please select one room."
    })
    .trim(),
  price: z
    .string({
      message: 'Price is required',
    })
    .min(6, {
      message: "Min price 100.000"
    }),
  fromDate: z
    .date({
      required_error: "A from date is required",
    }),
  toDate: z
    .date()
    .optional(),
});
