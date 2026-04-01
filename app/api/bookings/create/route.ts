import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { createBooking, checkAvailability, getRoomById } from "@/lib/firestore";
import { differenceInCalendarDays, parseISO } from "date-fns";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── Auth ───────────────────────────────────────────────────────────────
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

  // ── Parse body ─────────────────────────────────────────────────────────
  const body = await req.json();
  const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, notes } = body;

  if (!roomId || !checkIn || !checkOut || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // ── Validate dates ─────────────────────────────────────────────────────
  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  if (nights < 1) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
  }

  // ── Check room exists ──────────────────────────────────────────────────
  const room = await getRoomById(roomId);
  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  // ── Availability check ─────────────────────────────────────────────────
  const available = await checkAvailability(roomId, checkIn, checkOut);
  if (!available) {
    return NextResponse.json(
      { error: "Selected dates are not available" },
      { status: 409 }
    );
  }

  // ── Create booking ─────────────────────────────────────────────────────
  const totalPrice = room.pricePerNight * nights;
  let bookingId: string;
  try {
    bookingId = await createBooking({
      roomId,
      guestId:    uid,
      guestName,
      guestEmail,
      guestPhone: guestPhone ?? "",
      checkIn,
      checkOut,
      nights,
      totalPrice,
      notes,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "DATES_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Selected dates are not available" },
        { status: 409 }
      );
    }
    throw err;
  }

  // ── Redirect to Step 2 ─────────────────────────────────────────────────
  const url = `/book/confirm?bookingId=${bookingId}`;

  return NextResponse.json({ bookingId, redirectUrl: url, totalPrice });
}

