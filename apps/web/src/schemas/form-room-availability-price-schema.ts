import * as z from 'zod';

export const FromRoomAvailabilityPriceSchema = z.object({
  roomId: z
    .string()
    .min(1, {
      message: "Please select one room."
    })
    .trim(),
  fromDate: z.date({
    required_error: "A from date is required.",
  }),
  toDate: z.date({
    required_error: "A to date is required.",
  }),
});
