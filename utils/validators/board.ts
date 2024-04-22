import { z } from "zod";

export const boardValidator = z.object({
  name: z.string(),
  description: z.string().nullable(),
  isPrivate: z.boolean().nullable(),
  id: z.string().optional(),
});

export type BoardValidator = z.infer<typeof boardValidator>;