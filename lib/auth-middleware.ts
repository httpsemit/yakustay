import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
