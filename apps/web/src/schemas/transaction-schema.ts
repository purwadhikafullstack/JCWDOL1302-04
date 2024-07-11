import * as z from 'zod';

export const BookingDateRangeSchema = z.object({
  dateRange: z.object({
    from: z.date({
      required_error: 'A from date is required.',
    }),
    to: z.date({
      required_error: 'A to date is required.',
    }),
  }),
});
