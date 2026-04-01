import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { getBookingById, getRoomById, creditLoyaltyPoints, processReferralReward } from "@/lib/firestore";
import { sendBookingConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook signature verification failed: ${err.message}`);
    }
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      console.log(`Fulfilling booking ${bookingId}`);
      
      const booking = await getBookingById(bookingId);
      if (booking) {
        // 1. Mark booking as confirmed
        await adminDb.collection("bookings").doc(bookingId).update({
          status: "confirmed",
          stripeSessionId: session.id,
        });

        // 2. Trigger SendGrid Confirmation Email
        const room = await getRoomById(booking.roomId);
        if (room) {
          await sendBookingConfirmationEmail(
            booking.guestEmail,
            booking.guestName,
            booking.checkIn,
            booking.checkOut,
            room.name,
            bookingId
          );
        }

        // 3. Trigger Loyalty Points (Credit and Deduct)
        if (booking.pointsRedeemed > 0) {
          await creditLoyaltyPoints(
            booking.guestId,
            -booking.pointsRedeemed,
            `Redeemed points for booking ${bookingId}`
          );
        }
        if (booking.pointsEarned > 0) {
          await creditLoyaltyPoints(
            booking.guestId,
            booking.pointsEarned,
            `Points earned from booking ${bookingId}`
          );
        }

        // 4. Check for Referrals
        await processReferralReward(booking.guestId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
