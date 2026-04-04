import { NextRequest, NextResponse } from "next/server";
import { getBookingById, getRoomById } from "@/lib/firestore";
import { differenceInCalendarDays, format } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    console.log('🧾 Invoice API called');
    const { bookingId } = await params;
    console.log('📋 Booking ID:', bookingId);

    // Get booking details
    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Get room details
    const room = await getRoomById(booking.roomId);
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Calculate nights first
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const nights = differenceInCalendarDays(checkOut, checkIn);

    // Validate data before calculation
    if (!room.pricePerNight || isNaN(room.pricePerNight) || room.pricePerNight <= 0) {
      console.error('❌ Invalid room price:', room.pricePerNight);
      return NextResponse.json({ error: "Invalid room price data" }, { status: 400 });
    }
    
    if (!booking.totalPrice || isNaN(booking.totalPrice) || booking.totalPrice < 0) {
      console.error('❌ Invalid booking total:', booking.totalPrice);
      return NextResponse.json({ error: "Invalid booking total data" }, { status: 400 });
    }
    
    if (nights <= 0) {
      console.error('❌ Invalid nights calculation:', nights);
      return NextResponse.json({ error: "Invalid booking dates" }, { status: 400 });
    }

    // Generate invoice number
    const invoiceNumber = `INV-${bookingId.toUpperCase().slice(0, 8)}-${format(new Date(), 'yyyyMMdd')}`;

    // Calculate totals with validation
    console.log('🧮 Calculating invoice totals...');
    console.log('📊 Room data:', { pricePerNight: room.pricePerNight });
    console.log('📊 Booking data:', { totalPrice: booking.totalPrice, pointsRedeemed: booking.pointsRedeemed, nights });
    
    const roomTotal = room.pricePerNight * nights;
    const pointsUsed = booking.pointsRedeemed || 0;
    const pointsValue = pointsUsed / 10; // 10 points = 1 rupee (same as checkout)
    const subtotal = roomTotal;
    const discount = pointsValue;
    const total = subtotal - discount;
    
    console.log('💰 Calculated totals:', {
      roomTotal,
      pointsUsed,
      pointsValue,
      subtotal,
      discount,
      total,
      paid: booking.totalPrice,
      balance: total - booking.totalPrice
    });

    const invoice = {
      invoiceNumber,
      bookingId,
      invoiceDate: format(new Date(), 'dd MMMM yyyy'),
      dueDate: format(checkIn, 'dd MMMM yyyy'),
      
      // Guest details
      guest: {
        name: booking.guestName,
        email: booking.guestEmail,
        phone: booking.guestPhone || '',
      },
      
      // Property details
      property: {
        name: "Chello Yaku Guest House",
        address: "SANTI NAGAR, NEAR-(PETROL PUMP), PAPUMPARE (AP) 791121",
        phone: "+91 9678267281",
        email: "hello@yakustay.online",
      },
      
      // Booking details
      booking: {
        roomName: room.name,
        roomType: "Deluxe Room", // Default since room.type doesn't exist
        checkIn: format(checkIn, 'dd MMMM yyyy'),
        checkOut: format(checkOut, 'dd MMMM yyyy'),
        nights,
        guests: 2, // Default since booking.guests doesn't exist
      },
      
      // Pricing details
      pricing: {
        roomRate: room.pricePerNight,
        roomTotal,
        pointsUsed,
        pointsValue,
        subtotal,
        discount,
        total,
        paid: booking.totalPrice,
        dueAmount: total - booking.totalPrice, // Amount due at hotel
        amountPaid: booking.totalPrice, // Amount already paid online
      },
      
      // Payment details
      payment: {
        method: booking.paymentMethod || "Online",
        status: booking.status,
        transactionId: booking.stripeSessionId || "N/A",
        paidAt: booking.updatedAt ? format(new Date(booking.updatedAt), 'dd MMMM yyyy, HH:mm') : 'N/A',
        payAtHotel: booking.paymentMethod === "hotel", // Flag for hotel payment
      },
      
      // Terms
      terms: [
        "Check-in time: 2:00 PM",
        "Check-out time: 11:00 AM",
        "Valid ID required at check-in",
        "Cancellation policy applies as per terms",
        booking.paymentMethod === "hotel" ? "Remaining balance to be paid at hotel reception" : "Full payment processed online",
      ],
    };

    return NextResponse.json(invoice);

  } catch (error) {
    console.error("Error generating invoice:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
