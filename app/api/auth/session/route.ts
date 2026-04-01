import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

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

// DELETE /api/auth/session — clear session cookie on logout
export async function DELETE() {
  const res = NextResponse.json({ status: "ok" });
  res.cookies.delete("session");
  return res;
}
