import * as z from 'zod';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

export const PropertySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name of the property is required',
    })
    .max(255, {
      message: 'Name of the property is max 255 char',
    }),
  description: z.string().min(1, {
    message: 'Description of the property is required',
  }),
  location: z
    .string()
    .min(1, {
      message: 'Location of the property is required',
    })
    .max(100, {
      message: 'Location of the property is max 100 char',
    }),
  propertyCategoryId: z.number({
    message: 'Category of the property is number required',
  }),
  image: z

    .instanceof(File, { message: 'Image is required.' })
    .refine((file: File) => file.size <= 1000000, {
      message: 'Max image size is 1MB.',
    })
    .refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Only .jpg, .jpeg, .png and .gif formats are supported.',
    }),
});

export const UpdatePropertySchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name of the property is required',
    })
    .max(255, {
      message: 'Name of the property is max 255 char',
    }),
  description: z.string().min(1, {
    message: 'Description of the property is required',
  }),
  location: z
    .string()
    .min(1, {
      message: 'Location of the property is required',
    })
    .max(100, {
      message: 'Location of the property is max 100 char',
    }),
  propertyCategoryId: z.number({
    message: 'Category of the property is number required',
  }),
  image: z
    .any()
    .optional()
    .refine(
      (file) =>
        !file ||
        (file.size <= 1000000 && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      {
        message:
          'Max image size is 1MB and only .jpg, .jpeg, .png and .gif formats are supported.',
      },
    ),
});
