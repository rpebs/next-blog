import prisma from "@/lib/prisma.js";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { validatePostData } from "../../../lib/validators.js"; // Sesuaikan path sesuai lokasi file


export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for file uploads
  },
};

export const GET = async (req) => {
  const post = await prisma.post.findMany();

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
};

export const POST = async (req) => {
  try {
    const formData = await req.formData();

    // Extract file and other fields
    const file = formData.get("file");
    const title = formData.get("title");
    const content = formData.get("content");

    // Validate data
    const validationErrors = validatePostData(title, content, file);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/ /g, "_");
    const filePath = path.join(process.cwd(), "public/uploads", filename);

    await fs.writeFile(filePath, buffer);

    // Insert post into database
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: `/uploads/${filename}`, // Image path accessible in the public folder
      },
    });

    return NextResponse.json({ message: "Success", post }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Failed", error: error.message },
      { status: 500 }
    );
  }
};
