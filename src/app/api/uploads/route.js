import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
// import { db } from "../../../../lib/db";

dotenv.config();

// const uploadDir = process.env.UPLOAD_DIR;
// first api name api/upload
const uploadDir = path.join(process.cwd(), "public", "uploads");
console.log("Upload dir resolved to:", uploadDir);

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("image");

    if (!file || typeof file === "string") {
      throw new Error("No file uploaded or invalid file type");
    }

    const fileType = file.type; // e.g., "image/png", "application/pdf"
    const extension = fileType === "application/pdf" ? "pdf" : "webp";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!uploadDir) {
      throw new Error("UPLOAD_DIR is not defined in .env.local");
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = Date.now();
    const filename = `Testing_${uniqueName}.${extension}`;
    const filePath = path.join(uploadDir, filename);

    if (fileType === "application/pdf") {
      // Just write the file directly
      await writeFile(filePath, buffer);
    } else {
      // Use sharp for image processing
      await sharp(buffer)
        .webp({ quality: 75 })
        .toFile(filePath);
    }

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: filename,
      type: fileType
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}





export async function DELETE(req) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ success: false, message: "Missing fileName" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public");
    const filePath = path.join(uploadDir, fileName);

    console.log("Attempting to delete:", filePath);

    // 1. Delete from disk
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }


    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
