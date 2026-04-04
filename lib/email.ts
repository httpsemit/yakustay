import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

export async function sendBookingConfirmationEmail(
  toEmail: string,
  guestName: string,
  checkIn: string,
  checkOut: string,
  roomName: string,
  bookingId: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️ Missing RESEND_API_KEY. Stubbing confirmation email to", toEmail);
    return;
  }

  const ownerEmail = process.env.OWNER_EMAIL || "hello@yakustay.online";
  
  const subject = `Booking Confirmed: ${roomName} at Chello Yaku Guest House`;
  const htmlContent = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <h2 style="color: #061b0e;">Booking Confirmation</h2>
      <p>Hi ${guestName},</p>
      <p>Thank you for choosing Chello Yaku Guest House. Your booking is confirmed!</p>
      <div style="background: #f5f4e8; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #061b0e;">
        <p style="margin: 0 0 8px;"><strong>Room:</strong> ${roomName}</p>
        <p style="margin: 0 0 8px;"><strong>Check-in:</strong> ${checkIn}</p>
        <p style="margin: 0 0 8px;"><strong>Check-out:</strong> ${checkOut}</p>
        <p style="margin: 0 0 0;"><strong>Reference ID:</strong> <span style="font-family: monospace; background: #e9e9dd; padding: 2px 6px; border-radius: 4px;">${bookingId.toUpperCase()}</span></p>
      </div>
      <p>We look forward to welcoming you.</p>
      <p>Warm regards,<br><strong>The Chello Yaku Team</strong></p>
    </div>
  `;

  try {
    // 1. Send email to the Guest
    const guestData = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Chello Yaku Guest House <onboarding@resend.dev>",
      to: [toEmail],
      subject: subject,
      html: htmlContent,
    });
    console.log(`[Resend] Guest confirmation sent to ${toEmail}:`, guestData);

    // 2. Send distinct notification email to the Hotel Owner
    const ownerData = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Chello Yaku System <onboarding@resend.dev>",
      to: [ownerEmail],
      subject: `[NEW BOOKING] ${roomName} - ${guestName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #065f46;">New Booking Alert</h2>
          <p>A new reservation has been confirmed.</p>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #065f46;">
            <p><strong>Guest:</strong> ${guestName} (${toEmail})</p>
            <p><strong>Room:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
          </div>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin">View in Admin Dashboard</a></p>
        </div>
      `,
    });
    console.log(`[Resend] Owner notification sent to ${ownerEmail}:`, ownerData);

  } catch (error) {
    console.error("[Resend] Failed to send emails:", error);
  }
}
