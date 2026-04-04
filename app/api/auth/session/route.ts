import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

// POST /api/auth/session — set session cookie after login
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    await adminAuth.verifyIdToken(token);
    const res = NextResponse.json({ status: "ok" });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 24, // 24 hours
      path:     "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// GET /api/auth/session — get current user data
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    
    // Fetch user data from Firestore
    const userData = await getUserById(decoded.uid);
    
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// DELETE /api/auth/session — clear session cookie on logout
export async function DELETE() {
  const res = NextResponse.json({ status: "ok" });
  res.cookies.delete("session");
  return res;
}
