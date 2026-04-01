"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "nightly" | "hourly";

export default function AvailabilityWidget() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("nightly");

  // Nightly state
  const [checkInDate,  setCheckInDate]  = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Hourly state
  const [hourlyDate,    setHourlyDate]    = useState("");
  const [checkInTime,   setCheckInTime]   = useState("12:00");
  const [checkOutTime,  setCheckOutTime]  = useState("14:00");

  function handleSearch() {
    if (mode === "nightly") {
      const params = new URLSearchParams();
      if (checkInDate)  params.set("checkIn",  checkInDate);
      if (checkOutDate) params.set("checkOut", checkOutDate);
      router.push(`/rooms?${params.toString()}`);
    } else {
      const params = new URLSearchParams();
      if (hourlyDate)   params.set("date",      hourlyDate);
      if (checkInTime)  params.set("startTime",  checkInTime);
      if (checkOutTime) params.set("endTime",    checkOutTime);
      params.set("mode", "hourly");
      router.push(`/rooms?${params.toString()}`);
    }
  }

  const tabBase: React.CSSProperties = {
    flex: 1,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "none",
    borderRadius: "0.5rem",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  };

  const inputStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#1b1c15",
    background: "none",
    border: "none",
    outline: "none",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#50606f",
    marginBottom: 4,
  };

  const fieldStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 110,
  };

  return (
    <div
      className="hero-search-card"
      style={{
        background: "rgba(251,250,238,0.96)",
        backdropFilter: "blur(12px)",
        borderRadius: "1rem",
        padding: "16px 20px 20px",
        maxWidth: 680,
        boxShadow: "0 8px 32px rgba(27,48,34,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Mode Toggle */}
      <div
        style={{
          display: "flex",
          gap: 4,
          background: "#efeee3",
          borderRadius: "0.625rem",
          padding: 4,
        }}
      >
        {(["nightly", "hourly"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              ...tabBase,
              background: mode === m ? "#061b0e" : "transparent",
              color:      mode === m ? "#ffffff"  : "#50606f",
            }}
          >
            {m === "nightly" ? "🌙 Nightly Stay" : "⏱ Hourly Booking"}
          </button>
        ))}
      </div>

      {/* Fields row */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>

        {mode === "nightly" ? (
          <>
            {/* Check-in */}
            <div style={fieldStyle}>
              <p style={labelStyle}>Check-in</p>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Divider */}
            <div style={{ color: "#b4b9b4", fontWeight: 300, paddingBottom: 4 }}>→</div>

            {/* Check-out */}
            <div style={fieldStyle}>
              <p style={labelStyle}>Check-out</p>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* CTA */}
            <div style={{ flex: "0 0 auto" }}>
              <button
                onClick={handleSearch}
                style={{
                  background:    "#061b0e",
                  color:         "#ffffff",
                  border:        "none",
                  borderRadius:  "0.75rem",
                  padding:       "12px 20px",
                  fontSize:      11,
                  fontWeight:    700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor:        "pointer",
                  whiteSpace:    "nowrap",
                }}
              >
                Check Availability
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#1b1c15", margin: 0, fontWeight: 500 }}>
              Hourly bookings are currently handled exclusively via WhatsApp.
            </p>
            <a
              href="https://wa.me/919435000000?text=Hi! I would like to inquire about hourly room availability."
              target="_blank"
              rel="noreferrer"
              style={{
                background:    "#25d366",
                color:         "#ffffff",
                border:        "none",
                borderRadius:  "0.75rem",
                padding:       "12px 20px",
                fontSize:      11,
                fontWeight:    700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor:        "pointer",
                whiteSpace:    "nowrap",
                textDecoration: "none",
              }}
            >
              Book via WhatsApp
            </a>
          </div>
        )}
      </div>

      {/* Hourly hint */}
      {mode === "hourly" && (
        <p style={{ fontSize: 10, color: "#50606f", fontWeight: 300, marginTop: -4 }}>
          Hourly rooms available from 2-hour slots · subject to availability
        </p>
      )}
    </div>
  );
}
