import { NextRequest, NextResponse } from "next/server";
import { getBookingById, getRoomById } from "@/lib/firestore";

export async function GET(req: NextRequest) {
  try {
    console.log("🧪 Testing bill calculation...");
    
    // Test with a sample booking ID (you can change this)
    const testBookingId = "test-booking-id";
    
    console.log("📋 Getting booking data...");
    const booking = await getBookingById(testBookingId);
    
    if (!booking) {
      console.log("❌ No booking found, creating test data...");
      // Create test data for debugging
      const testBooking = {
        id: testBookingId,
        guestName: "Test Guest",
        guestEmail: "test@example.com",
        checkIn: "2026-04-25",
        checkOut: "2026-04-27",
        totalPrice: 2000,
        pointsRedeemed: 100,
        roomId: "test-room-id"
      };
      
      const testRoom = {
        id: "test-room-id",
        name: "Test Room",
        pricePerNight: 1000
      };
      
      // Test calculation with test data
      const nights = 2; // 27 - 25 = 2 nights
      const roomTotal = testRoom.pricePerNight * nights; // 1000 * 2 = 2000
      const pointsUsed = testBooking.pointsRedeemed || 0; // 100
      const pointsValue = pointsUsed * 0.5; // 100 * 0.5 = 50
      const subtotal = roomTotal; // 2000
      const discount = pointsValue; // 50
      const tax = subtotal * 0.18; // 2000 * 0.18 = 360
      const total = subtotal - discount + tax; // 2000 - 50 + 360 = 2310
      
      return NextResponse.json({
        success: true,
        message: "Calculation test with sample data",
        testData: {
          booking: testBooking,
          room: testRoom,
          calculation: {
            nights,
            roomTotal,
            pointsUsed,
            pointsValue,
            subtotal,
            discount,
            tax,
            total,
            paid: testBooking.totalPrice,
            balance: total - testBooking.totalPrice
          }
        }
      });
    }
    
    // Test with real booking data
    const room = await getRoomById(booking.roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Real booking data found",
      booking: {
        id: booking.id,
        guestName: booking.guestName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        pointsRedeemed: booking.pointsRedeemed,
        roomId: booking.roomId
      },
      room: {
        id: room.id,
        name: room.name,
        pricePerNight: room.pricePerNight
      }
    });
    
  } catch (error) {
    console.error("❌ Calculation test failed:", error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
