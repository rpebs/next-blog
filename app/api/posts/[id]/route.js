import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { validatePostData } from "../../../../lib/validators"; // Sesuaikan path

export const config = {
  api: {
    bodyParser: false,
  },
};

export const GET = async (req, { params }) => {
  const { id } = params;

  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
};

export const DELETE = async (req, { params }) => {
  const { id } = params;

  const existingPost = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  const imagePath = path.join(process.cwd(), "public/uploads", path.basename(existingPost.image));

  try {
    await fs.unlink(imagePath);
  } catch (err) {
    console.error("Error removing old image:", err);
  }
  
  const delPost = await prisma.post.delete({
    where: { id: Number(id) },
  });

  if (!delPost) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }


  return NextResponse.json({ message: "Success", delPost }, { status: 200 });
};

export const PUT = async (req, { params }) => {
  const { id } = params;

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

    // Get the existing post
    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    let imagePath = existingPost.image;

    if (file) {
      // Remove old image if exists
      if (imagePath) {
        const oldImagePath = path.join(
          process.cwd(),
          "public/uploads",
          path.basename(imagePath)
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error("Error removing old image:", err);
        }
      }

      // Save the new image
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = file.name.replace(/ /g, "_");
      imagePath = `/uploads/${filename}`;
      const newImagePath = path.join(process.cwd(), "public/uploads", filename);
      await fs.writeFile(newImagePath, buffer);
    }

    // Update post in the database
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        image: imagePath || undefined, // Keep existing image if not updated
      },
    });

    return NextResponse.json({ message: "Success", post }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Failed", error: error.message },
      { status: 500 }
    );
  }
};
