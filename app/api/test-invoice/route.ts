import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Testing invoice API...");
    
    // Test with a sample booking ID (you can change this)
    const testBookingId = "test-booking-id";
    
    console.log("📋 Testing getBookingById function...");
    const booking = await getBookingById(testBookingId);
    
    console.log("📊 Booking result:", booking);
    
    return NextResponse.json({ 
      success: true,
      message: "Invoice API test completed",
      bookingFound: !!booking,
      bookingDetails: booking ? {
        id: booking.id,
        guestName: booking.guestName,
        roomId: booking.roomId,
        status: booking.status
      } : null
    });
    
  } catch (error) {
    console.error("❌ Invoice API test failed:", error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
