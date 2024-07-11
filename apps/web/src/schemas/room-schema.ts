import * as z from 'zod';

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

export const RoomSchema = z.object({
  description: z.string().min(1, {
    message: 'Description of the room is required',
  }),
  type: z.string().min(1, {
    message: 'Type of the room is required',
  }),
  price: z.string({
    message: 'Price of the room is required',
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

export const UpdateRoomSchema = z.object({
  description: z.string().min(1, {
    message: 'Description of the room is required',
  }),
  type: z.string().min(1, {
    message: 'Type of the room is required',
  }),
  price: z.string({
    message: 'Price of the room is required',
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
