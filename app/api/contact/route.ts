import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

export async function POST(req: NextRequest) {
  try {
    const { name, phone, subject, message } = await req.json();

    // Validate required fields
    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️ Missing RESEND_API_KEY. Contact form submission not sent.");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const ownerEmail = process.env.OWNER_EMAIL || "hello@yakustay.online";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Chello Yaku Guest House <onboarding@resend.dev>";

    // Create subject line based on selection
    const subjectMap: Record<string, string> = {
      reservation: "Reservation Inquiry",
      special: "Special Request / Event",
      feedback: "Feedback",
      other: "Other Inquiry"
    };

    const emailSubject = `${subjectMap[subject] || 'Contact Form'} - ${name}`;
    
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="background: #061b0e; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Chello Yaku Guest House</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">New Contact Form Submission</p>
        </div>
        
        <div style="background: #f5f4e8; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e4e3d7;">
          <h2 style="color: #061b0e; margin-top: 0;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${subjectMap[subject] || subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 6px;">
            <h3 style="margin-top: 0; color: #061b0e;">Message:</h3>
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e4e3d7; text-align: center; color: #50606f; font-size: 14px;">
            <p style="margin: 0;">This message was sent from the Chello Yaku Guest House contact form.</p>
            <p style="margin: 8px 0 0;">Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      </div>
    `;

    // Send email to owner
    const data = await resend.emails.send({
      from: fromEmail,
      to: [ownerEmail],
      subject: emailSubject,
      html: htmlContent,
    });

    console.log(`[Resend] Contact form sent from ${name}:`, data);

    return NextResponse.json({ 
      success: true, 
      message: "Message sent successfully" 
    });

  } catch (error) {
    console.error("[Resend] Failed to send contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
