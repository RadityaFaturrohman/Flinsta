import { z } from "zod";

export const commentValidator = z.object({
  pinId: z.string(),
  content: z.string(),
  replyToId: z.string().nullable(),
});

export type CommentValidator = z.infer<typeof commentValidator>;