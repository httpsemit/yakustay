import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getBookingById } from "@/lib/firestore";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await params;

    // Get booking details
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ Missing RESEND_API_KEY. Invoice email not sent.");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL || "hello@yakustay.online";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Chello Yaku Guest House <onboarding@resend.dev>";

    // Generate invoice URL
    const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invoice/${bookingId}`;

    // Email content
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="background: #061b0e; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📄 Invoice Ready</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Your booking invoice is available</p>
        </div>
        
        <div style="background: #f5f4e8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e4e3d7;">
          <h2 style="color: #061b0e; margin-top: 0;">Invoice Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Guest:</strong> ${booking.guestName}</p>
            <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${bookingId}</p>
            <p style="margin: 0 0 8px;"><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p style="margin: 0 0 8px;"><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p style="margin: 0 0 8px;"><strong>Total Amount:</strong> ₹${booking.totalPrice.toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${invoiceUrl}" 
               style="display: inline-block; background: #061b0e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              📄 View Full Invoice
            </a>
          </div>
          
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e4e3d7; text-align: center; color: #50606f; font-size: 14px;">
            <p style="margin: 0;">This invoice was generated automatically for your booking at Chello Yaku Guest House.</p>
            <p style="margin: 8px 0 0;">For any questions, please contact us at hello@yakustay.online</p>
          </div>
        </div>
      </div>
    `;

    // Send invoice email to guest
    const guestData = await resend.emails.send({
      from: fromEmail,
      to: [booking.guestEmail],
      subject: `Invoice for Your Booking at Chello Yaku Guest House`,
      html: htmlContent,
    });

    console.log(`[Resend] Invoice sent to ${booking.guestEmail}:`, guestData);

    return NextResponse.json({ 
      success: true, 
      message: "Invoice sent successfully",
      invoiceUrl
    });

  } catch (error) {
    console.error("[Resend] Failed to send invoice:", error);
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    );
  }
}
