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
  const { search = "", page = 1, pageSize = 10 } = Object.fromEntries(new URL(req.url).searchParams);

  const currentPage = parseInt(page, 10);
  const pageSizeNumber = parseInt(pageSize, 10);

  // Validate page and pageSize
  if (isNaN(currentPage) || isNaN(pageSizeNumber) || currentPage < 1 || pageSizeNumber < 1) {
    return NextResponse.json({ error: "Invalid page or pageSize." }, { status: 400 });
  }

  // Construct the query with filters and pagination
  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
      }
    : {};

  try {
    // Ensure Prisma findMany query is correctly formed
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where,
        skip: (currentPage - 1) * pageSizeNumber,
        take: pageSizeNumber,
      }),
      prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(totalPosts / pageSizeNumber);

    return NextResponse.json({ posts, totalPages, totalData: totalPosts });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Failed to fetch posts." }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    const formData = await req.formData();

    // Extract file and other fields
    const file = formData.get("file");
    const title = formData.get("title");
    const content = formData.get("content");

    // Validate data
    const validationErrors = validatePostData(title, content, file, false);
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
