import { z } from "zod";

export const ReviewSchema = z.object({
  orderId: z.string(),
  point: z.enum(["1", "2", "3", "4", "5"], {
    required_error: "You need to select a star.",
  }),
  comment: z
    .string()
    .min(10, {
      message: "Comment must be at least 10 characters.",
    })
    .max(400, {
      message: "Comment must not be longer than 400 characters.",
    }),
})