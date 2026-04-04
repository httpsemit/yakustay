import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/lib/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const booking = await createBooking(body);
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
