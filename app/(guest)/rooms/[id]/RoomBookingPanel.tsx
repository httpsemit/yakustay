"use client";

import { useState } from "react";
import { useRouter }  from "next/navigation";
import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Room }  from "@/lib/firestore";
import DateRangePicker from "@/components/booking/DateRangePicker";
import BookingSummary  from "@/components/booking/BookingSummary";

interface Props {
  room:           Room;
  roomTypeId:     string;
  availableCount: number;   // total rooms of this type available
  bookedDates:    string[];
}

export default function RoomBookingPanel({ room, roomTypeId, availableCount, bookedDates }: Props) {
  const router = useRouter();
  const [checkIn,  setCheckIn]  = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const nights =
    checkIn && checkOut
      ? differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
      : 0;

  const totalPrice = room.pricePerNight * nights * quantity;

  function handleBook() {
    if (!checkIn || !checkOut || nights < 1) return;
    // Pass roomTypeId + quantity so the booking page can select N actual room IDs
    router.push(
      `/book/${roomTypeId}?checkIn=${checkIn}&checkOut=${checkOut}&quantity=${quantity}`
    );
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

      {/* Quantity selector */}
      {availableCount > 1 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>
            Number of Rooms
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1.5px solid #c3c8c1",
                background: quantity <= 1 ? "#f5f4e8" : "#fff",
                color: quantity <= 1 ? "#b0b5ae" : "#061b0e",
                fontSize: 18, fontWeight: 700, cursor: quantity <= 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              −
            </button>
            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", fontWeight: 300, minWidth: 24, textAlign: "center", color: "#061b0e" }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(availableCount, q + 1))}
              disabled={quantity >= availableCount}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1.5px solid #c3c8c1",
                background: quantity >= availableCount ? "#f5f4e8" : "#fff",
                color: quantity >= availableCount ? "#b0b5ae" : "#061b0e",
                fontSize: 18, fontWeight: 700, cursor: quantity >= availableCount ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              +
            </button>
            <span style={{ fontSize: "0.8rem", color: "#737973", fontWeight: 300 }}>
              of {availableCount} available
            </span>
          </div>
        </div>
      )}

      {nights > 0 && checkIn && checkOut && (
        <div style={{ marginTop: 20 }}>
          <BookingSummary
            roomName={quantity > 1 ? `${room.name} × ${quantity}` : room.name}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            pricePerNight={room.pricePerNight * quantity}
          />
        </div>
      )}

      {/* Total price callout when multi-room */}
      {nights > 0 && quantity > 1 && (
        <p style={{
          marginTop: 8, fontSize: "0.8rem", color: "#50606f", fontWeight: 300,
          textAlign: "right"
        }}>
          {quantity} room{quantity > 1 ? "s" : ""} × {nights} night{nights > 1 ? "s" : ""} = ₹{totalPrice.toLocaleString("en-IN")}
        </p>
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
        {nights > 0
          ? `Book ${quantity > 1 ? `${quantity} Rooms` : ""} — ${nights} Night${nights !== 1 ? "s" : ""}`
          : "Select Dates"}
      </button>
    </div>
  );
}
