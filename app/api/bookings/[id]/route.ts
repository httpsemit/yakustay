import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getBookingById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

  const booking = await getBookingById(params.id);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.guestId !== uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json(booking);
}
