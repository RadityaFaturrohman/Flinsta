import { getAuthSession } from "@/utils/auth"
import prisma from "@/utils/prisma";
import { boardValidator } from "@/utils/validators/board";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return new Response('Unauthorized', {
        status: 401,
      });
    };

    const data = req.json();

    const { name, description, isPrivate } = boardValidator.parse(data);

    const board = await prisma.board.create({
      data: {
        name,
        description,
        privacy: isPrivate ? 'private' : 'public',
        userId: session.user.id,
      }
    });

    return new Response(JSON.stringify(board));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    };

    return new Response(
      "Could not create a new board at this time, please try again later.",
      { status: 500 }
    );
  }
};

export const PATCH = async (req: Request) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const data = req.json();

    const { name, description, isPrivate, id } = boardValidator.parse(data);

    const board = await prisma.board.update({
      where: {
        id: id!,
      },
      data: {
        name,
        description,
        privacy: isPrivate ? 'private' : 'public',
      }
    });

    return new Response(JSON.stringify(board));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    };

    return new Response(
      "Could not update your board at this time, please try again later.",
      { status: 500 }
    );
  }
};

export const DELETE = async (req: Request) => {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const data = req.json();

    const { id, userId } = (await req.json()) as {
      id: string;
      userId: string;
    };


  } catch (error) {
    
  }
}