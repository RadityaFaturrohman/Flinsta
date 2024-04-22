import { getAuthSession } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { userFollowValidator } from "@/utils/validators/follow";
import { getSession } from "next-auth/react";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { userId, followed } = userFollowValidator.parse(body);

    const session = await getAuthSession();
    
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const existingFollow = await prisma.userFollow.findFirst({
      where: {
        followerId: session.user.id,
        followedUserId: userId,
      },
    });

    console.log(session.user.id)

    if (followed) {
      if (!existingFollow) {
        console.log('running');
        await prisma.userFollow.create({
          data: {
            followed,
            followerId: session.user.id,
            followedUserId: userId,
          },
        });
      }
    } else {
      if (existingFollow) {
        console.log('running');
        await prisma.userFollow.deleteMany({
          where: {
            followerId: session.user.id,
            followedUserId: userId,
          },
        });
      }
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}