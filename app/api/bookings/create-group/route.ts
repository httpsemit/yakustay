import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { createMultipleBookings } from "@/lib/firestore";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
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

  // ── Parse body ────────────────────────────────────────────────────────────
  const body = await req.json();
  const {
    roomTypeId,
    quantity = 1,
    checkIn,
    checkOut,
    pricePerNight,
    guestName,
    guestEmail,
    guestPhone,
    notes,
  } = body;

  if (!roomTypeId || !checkIn || !checkOut || !pricePerNight || !guestName || !guestEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (typeof quantity !== "number" || quantity < 1 || quantity > 20) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  // ── Validate dates ────────────────────────────────────────────────────────
  const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  if (nights < 1) {
    return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });
  }

  // ── Create bookings ───────────────────────────────────────────────────────
  // bookingGroupId ties all room bookings in this session together
  const bookingGroupId = randomUUID();

  let bookingIds: string[];
  try {
    bookingIds = await createMultipleBookings({
      roomTypeId,
      quantity,
      guestId:      uid,
      guestName,
      guestEmail,
      guestPhone:   guestPhone ?? "",
      checkIn,
      checkOut,
      nights,
      pricePerNight,
      notes,
      bookingGroupId,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.startsWith("INSUFFICIENT_AVAILABILITY")) {
        return NextResponse.json({ error: err.message }, { status: 409 });
      }
      if (err.message.startsWith("RACE_CONDITION")) {
        return NextResponse.json(
          { error: "A room became unavailable during booking. Please try again." },
          { status: 409 }
        );
      }
    }
    throw err;
  }

  const totalPrice = pricePerNight * nights * quantity;

  // Redirect to confirmation for the first booking in the group
  const redirectUrl = `/book/confirm?bookingId=${bookingIds[0]}&groupId=${bookingGroupId}&quantity=${quantity}`;

  return NextResponse.json({ bookingIds, bookingGroupId, totalPrice, redirectUrl });
}
