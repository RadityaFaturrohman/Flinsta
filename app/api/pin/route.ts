import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/prisma";
import { pinValidator } from "@/utils/validators/pin";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const data = await req.json();

    const { title, description, link, commentable, tags, albumId, photos, showTags } = pinValidator.parse(data);

    const pin = await prisma.pin.create({
      data: {
        title,
        description,
        link,
        allowComments: commentable,
        showTags,
        userId: session.user.id,
      },
    })

    if (photos.length > 0) {
      for (const photo of photos) {
        await prisma.photo.create({
          data: {
            pinId: pin.id,
            photo: photo,
          }
        })
      }
    }

    if (tags) {
      for (const tag of tags) {
        await prisma.tag.create({
          data: {
            pinId: pin.id,
            tag: tag,
          }
        })
      }
    }

    if (albumId) {
      await prisma.pinOnBoards.create({
        data: {
          pinId: pin.id,
          boardId: albumId,
          userId: session.user.id
        }
      })
    }

    return new Response(JSON.stringify(pin));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    };

    return new Response(
      "Could not publish a new board at this time, please try again later.",
      { status: 500 }
    );
  }
}