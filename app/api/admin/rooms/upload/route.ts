import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(token);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    try {
      // Upload to Cloudinary
      const result = await uploadImageToCloudinary(file, 'rooms');
      
      return NextResponse.json({ 
        url: result.secure_url,
        publicId: result.public_id,
        filename: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
