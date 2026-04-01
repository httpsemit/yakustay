import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getUserById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Verify admin session cookie
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Check admin role
  const user = await getUserById(uid);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { bookingId, status } = await req.json();
  if (!bookingId || !status) {
    return NextResponse.json({ error: "bookingId and status are required" }, { status: 400 });
  }

  const allowed = ["pending", "confirmed", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${allowed.join(", ")}` }, { status: 400 });
  }

  await adminDb.collection("bookings").doc(bookingId).update({
    status,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, bookingId, status });
}
