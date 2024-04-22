import z from 'zod';

export const pinValidator = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  commentable: z.boolean(),
  photos: z.string().array(),
  showTags: z.boolean().optional(),
  tags: z.string().array().optional().nullable(),
  albumId: z.string().optional().nullable(),
});

export type PinValidator = z.infer<typeof pinValidator>;