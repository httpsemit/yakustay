"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, parseISO } from "date-fns";

interface Props {
  checkIn:      string | null;
  checkOut:     string | null;
  excludeDates: string[];   // "YYYY-MM-DD" strings of already-booked dates
  onCheckIn:    (d: string | null) => void;
  onCheckOut:   (d: string | null) => void;
}

const fieldStyle: React.CSSProperties = {
  background:   "#f5f4e8",
  borderRadius: "0.5rem",
  padding:      "12px 14px",
  borderBottom: "2px solid transparent",
  flex:         1,
  cursor:       "pointer",
};

const labelStyle: React.CSSProperties = {
  fontSize:        9,
  fontWeight:      700,
  letterSpacing:   "0.15em",
  textTransform:   "uppercase",
  color:           "#50606f",
  marginBottom:    4,
  display:         "block",
  pointerEvents:   "none",
};

export default function DateRangePicker({ checkIn, checkOut, excludeDates, onCheckIn, onCheckOut }: Props) {
  const excluded = excludeDates.map((d) => parseISO(d));
  const today    = new Date();
  today.setHours(0, 0, 0, 0);

  const checkInDate  = checkIn  ? parseISO(checkIn)  : null;
  const checkOutDate = checkOut ? parseISO(checkOut) : null;

  function handleCheckIn(date: Date | null) {
    if (!date) { onCheckIn(null); return; }
    const s = date.toISOString().split("T")[0];
    onCheckIn(s);
    // If checkout is before or equal to new check-in, reset it
    if (checkOutDate && date >= checkOutDate) onCheckOut(null);
  }

  function handleCheckOut(date: Date | null) {
    if (!date) { onCheckOut(null); return; }
    onCheckOut(date.toISOString().split("T")[0]);
  }

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {/* Check-in */}
      <div
        style={fieldStyle}
        onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
        onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
      >
        <span style={labelStyle}>Check-in</span>
        <DatePicker
          selected={checkInDate}
          onChange={handleCheckIn}
          selectsStart
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={today}
          excludeDates={excluded}
          placeholderText="Select date"
          dateFormat="dd MMM yyyy"
          customInput={
            <input
              readOnly
              style={{
                width:      "100%",
                fontSize:   14,
                color:      "#1b1c15",
                background: "none",
                border:     "none",
                outline:    "none",
                cursor:     "pointer",
              }}
            />
          }
        />
      </div>

      {/* Check-out */}
      <div
        style={fieldStyle}
        onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
        onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
      >
        <span style={labelStyle}>Check-out</span>
        <DatePicker
          selected={checkOutDate}
          onChange={handleCheckOut}
          selectsEnd
          startDate={checkInDate}
          endDate={checkOutDate}
          minDate={checkInDate ? addDays(checkInDate, 1) : addDays(today, 1)}
          excludeDates={excluded}
          placeholderText="Select date"
          dateFormat="dd MMM yyyy"
          customInput={
            <input
              readOnly
              style={{
                width:      "100%",
                fontSize:   14,
                color:      "#1b1c15",
                background: "none",
                border:     "none",
                outline:    "none",
                cursor:     "pointer",
              }}
            />
          }
        />
      </div>
    </div>
  );
}
