import * as z from 'zod'

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

export const AvatarSchema = z.object({
  image: z
    .any()
    .refine(
      (file: File) => file.size <= 1000000, 
      { message: "Max image size is 1MB." }
    )
    .refine(
      (file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      { message: "Only .jpg, .jpeg, .png and .gif formats are supported." }
    )
});
