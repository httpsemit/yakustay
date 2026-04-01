import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { getBookingById, getLoyaltyProfile, creditLoyaltyPoints, processReferralReward } from "@/lib/firestore";
import { createCheckoutSession } from "@/lib/stripe";
import { sendBookingConfirmationEmail } from "@/lib/email";

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
  const { bookingId, paymentMethod, usePoints, phone } = body;

  if (!bookingId || !paymentMethod) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // ── Verify booking ─────────────────────────────────────────────────────
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.guestId !== uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (booking.status !== "pending") {
    return NextResponse.json({ error: "Booking is not pending" }, { status: 400 });
  }

  let remainingBalance = booking.totalPrice;
  let pointsRedeemed = 0;
  let pointsEarned = 0;

  // ── Loyalty Points Logic ───────────────────────────────────────────────
  if (usePoints) {
    const loyalty = await getLoyaltyProfile(uid);
    if (loyalty && loyalty.pointsBalance > 0) {
      // 10 points = 1 rupee discount
      const maxDiscountFromPoints = Math.floor(loyalty.pointsBalance / 10);
      
      const discountToApply = Math.min(maxDiscountFromPoints, remainingBalance);
      pointsRedeemed = discountToApply * 10;
      remainingBalance -= discountToApply;
    }
  }

  // Points earned: 1 point per 100 rupees of out-of-pocket spend
  pointsEarned = Math.floor(remainingBalance / 100);

  // Temporarily store intent in booking (to be finalized by Stripe webhook or Stub)
  await adminDb.collection("bookings").doc(bookingId).update({
    paymentMethod,
    pointsRedeemed,
    pointsEarned,
    ...(phone && { guestPhone: phone }),
  });

  // ── Pay at Hotel ───────────────────────────────────────────────────────
  if (paymentMethod === "hotel") {
    await adminDb.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    });
    
    // Stub fulfillment: Deduct points if any, award earned points
    if (pointsRedeemed > 0) {
      await creditLoyaltyPoints(uid, -pointsRedeemed, `Redeemed points for booking ${bookingId}`);
    }
    if (pointsEarned > 0) {
      await creditLoyaltyPoints(uid, pointsEarned, `Earned points from booking ${bookingId}`);
    }
    await processReferralReward(uid).catch(() => {});

    // Send confirmation email
    const roomSnap = await adminDb.collection("rooms").doc(booking.roomId).get();
    const roomName = roomSnap.exists ? roomSnap.data()?.name ?? "Room" : "Room";
    await sendBookingConfirmationEmail(booking.guestEmail, booking.guestName, booking.checkIn, booking.checkOut, roomName, bookingId).catch(() => {});

    return NextResponse.json({ redirectUrl: `/payment/success?bookingId=${bookingId}` });
  }

  // ── Online Payment ─────────────────────────────────────────────────────
  if (remainingBalance === 0) {
    // Loyalty points covered the entire booking, no Stripe session needed
    await adminDb.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    });
    
    // Deduct points, award earned points
    if (pointsRedeemed > 0) {
      await creditLoyaltyPoints(uid, -pointsRedeemed, `Redeemed points for booking ${bookingId}`);
    }
    if (pointsEarned > 0) {
      await creditLoyaltyPoints(uid, pointsEarned, `Earned points from booking ${bookingId}`);
    }
    await processReferralReward(uid).catch(() => {});

    const roomSnap = await adminDb.collection("rooms").doc(booking.roomId).get();
    const roomName = roomSnap.exists ? roomSnap.data()?.name ?? "Room" : "Room";
    await sendBookingConfirmationEmail(booking.guestEmail, booking.guestName, booking.checkIn, booking.checkOut, roomName, bookingId).catch(() => {});

    return NextResponse.json({ redirectUrl: `/payment/success?bookingId=${bookingId}` });
  }

  // Create Stripe Checkout Session for remaining balance
  const { url, sessionId } = await createCheckoutSession(bookingId, remainingBalance);

  // If running without Stripe (stub mode), fulfill immediately
  if (!process.env.STRIPE_SECRET_KEY) {
    await adminDb.collection("bookings").doc(bookingId).update({
      status: "confirmed",
      stripeSessionId: sessionId,
      updatedAt: new Date().toISOString(),
    });

    if (pointsRedeemed > 0) {
      await creditLoyaltyPoints(uid, -pointsRedeemed, `Redeemed points for booking ${bookingId}`);
    }
    if (pointsEarned > 0) {
      await creditLoyaltyPoints(uid, pointsEarned, `Points from booking ${bookingId}`);
    }

    await processReferralReward(uid).catch(() => {});

    const roomSnap = await adminDb.collection("rooms").doc(booking.roomId).get();
    const roomName = roomSnap.exists ? roomSnap.data()?.name ?? "Room" : "Room";
    await sendBookingConfirmationEmail(booking.guestEmail, booking.guestName, booking.checkIn, booking.checkOut, roomName, bookingId).catch(() => {});
  }

  return NextResponse.json({ redirectUrl: url });
}
