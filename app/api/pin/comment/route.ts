import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { commentValidator } from "@/utils/validators/comment";
import { z } from "zod";

export async function PATCH (req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }

    const data = await req.json();

    const { pinId, content, replyToId } = commentValidator.parse(data);

    await prisma.comment.create({
      data: {
        pinId,
        content,
        userId: session.user.id,
        replyToId,
      }
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", {
        status: 422,
      })
    };

    return new Response("Could not create comment at this time, please try again later", {
      status: 500
    })
  }
}