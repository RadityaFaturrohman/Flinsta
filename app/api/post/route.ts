import { NextRequest, NextResponse } from "next/server";
import vine, { errors } from "@vinejs/vine";
import { CustomErrorReporter } from "@/utils/validators/CustomErrorReporter";
import { postSchema } from "@/utils/validators/postSchema";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "@/utils/auth";
import { imagevalidator } from "@/utils/validators/imageValidator";
import { join } from "path";
import { writeFile } from "fs/promises";
import { getRandomNumber } from "@/utils/utils";
import prisma from "@/utils/prisma";


export async function POST(request: NextRequest) {
  try {
    const session: CustomSession | null = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ status: 401, message: "Un-Authorized" });
    }
    const formData = await request.formData();
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      albumId: formData.get("albumId"),
      allowComment: true,
      image: "",
    };
    vine.errorReporter = () => new CustomErrorReporter();
    const validator = vine.compile(postSchema);
    const payload = await validator.validate(data);

    const image = formData.get("image") as File | null;
    let imageName = "";
    // * IF image exists
    if (image) {
      const isImageNotValid = imagevalidator(image.name, image.size);
      if (isImageNotValid) {
        return NextResponse.json({
          status: 400,
          errors: {
            content: isImageNotValid,
          },
        });
      }
      // Extract the file name from the FormData object
      const imageFile = formData.get("image") as File;
      imageName = imageFile.name;
      // * Upload image if all good
      try {
        const buffer = Buffer.from(await image!.arrayBuffer());
        const uploadDir = join(process.cwd(), "public", "/uploads");
        const uniqueNmae = Date.now() + "_" + getRandomNumber(1, 999999);
        const imgExt = imageName.split(".");
        const filename = uniqueNmae + "." + imgExt?.[1];
        await writeFile(`${uploadDir}/${filename}`, buffer);
        data.image = filename;
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          status: 500,
          message: "Something went wrong. Please try again later.",
        });
      }
    }
    
    const albumId: string = payload.albumId || '';

    await prisma.pin.create({
      data: {
        title: payload.title,
        description: payload.description,
        userId: session.user!.id!,
        Photos: {
          create: [{ photo: data.image }]
        },
        Boards: {
          connect: [{ boardId: albumId }] // Assuming boardId is the correct field name
        },
      },
    });
    
    

    return NextResponse.json({
      status: 200,
      message: "Post created successfully!",
    });
  } catch (error : any) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { status: 400, errors: error.messages },
        { status: 200 }
      );
    }
  }
}