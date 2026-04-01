import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = await adminAuth.verifyIdToken(sessionCookie);
    const formData = await req.formData();
    const bookingId = formData.get("bookingId") as string;

    if (!bookingId) {
      return NextResponse.redirect(new URL("/account/bookings?error=missing_id", req.url));
    }

    // Verify booking belongs to user
    const docRef = adminDb.collection("bookings").doc(bookingId);
    const doc = await docRef.get();
    
    if (!doc.exists || doc.data()?.guestId !== decoded.uid) {
      return NextResponse.redirect(new URL("/account/bookings?error=unauthorized", req.url));
    }

    // Update status to cancelled
    await docRef.set({
      status: "cancelled",
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // STUB: Stripe Refund and SendGrid Email
    console.log(`[STUB] Processed Stripe refund for booking ${bookingId}`);
    console.log(`[STUB] Sent cancellation email to ${doc.data()?.guestEmail} via SendGrid`);

    return NextResponse.redirect(new URL("/account/bookings?success=cancelled", req.url));

  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.redirect(new URL("/account/bookings?error=server_error", req.url));
  }
}
