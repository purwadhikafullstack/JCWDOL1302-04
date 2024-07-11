import * as z from 'zod'

export const PropertyCategorySchema = z.object({
  id: z
    .string()
    .optional(),
  name: z
    .string()
    .min(1, {
      message: "Name of the property category is required"
    })
    .trim()
});
