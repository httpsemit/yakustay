import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getUserById, getAllBookings, getRoomById } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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

  const user = await getUserById(uid);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bookings = await getAllBookings();
  const enriched = await Promise.all(
    bookings.map(async (b) => {
      const room = await getRoomById(b.roomId);
      return { ...b, roomName: room?.name || "Unknown Room" };
    })
  );

  return NextResponse.json({ bookings: enriched });
}
