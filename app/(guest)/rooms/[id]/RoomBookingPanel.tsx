"use client";

import { useState } from "react";
import { useRouter }  from "next/navigation";
import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Room }  from "@/lib/firestore";
import DateRangePicker from "@/components/booking/DateRangePicker";
import BookingSummary  from "@/components/booking/BookingSummary";

interface Props { room: Room; bookedDates: string[] }

export default function RoomBookingPanel({ room, bookedDates }: Props) {
  const router = useRouter();
  const [checkIn,  setCheckIn]  = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);

  const nights =
    checkIn && checkOut
      ? differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
      : 0;

  function handleBook() {
    if (!checkIn || !checkOut || nights < 1) return;
    router.push(`/book/${room.id}?checkIn=${checkIn}&checkOut=${checkOut}`);
  }

  return (
    <div
      style={{
        background:   "#ffffff",
        borderRadius: "1rem",
        padding:      28,
        boxShadow:    "0 0 48px rgba(27,28,21,0.06)",
        position:     "sticky",
        top:          88,
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>
        Book This Room
      </p>

      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        excludeDates={bookedDates}
        onCheckIn={setCheckIn}
        onCheckOut={setCheckOut}
      />

      {nights > 0 && checkIn && checkOut && (
        <div style={{ marginTop: 20 }}>
          <BookingSummary
            roomName={room.name}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            pricePerNight={room.pricePerNight}
          />
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={nights < 1}
        style={{
          width:         "100%",
          marginTop:     20,
          background:    nights < 1 ? "#e4e3d7" : "#061b0e",
          color:         nights < 1 ? "#737973" : "#ffffff",
          border:        "none",
          borderRadius:  "0.75rem",
          padding:       "14px",
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          cursor:        nights < 1 ? "not-allowed" : "pointer",
        }}
      >
        {nights > 0 ? `Book — ${nights} Night${nights !== 1 ? "s" : ""}` : "Select Dates"}
      </button>
    </div>
  );
}
