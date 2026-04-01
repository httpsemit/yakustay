"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams }    from "next/navigation";
import { useAuth }                       from "@/contexts/AuthContext";
import Link                              from "next/link";

interface BookingData {
  id:        string;
  roomId:    string;
  checkIn:   string;
  checkOut:  string;
  nights:    number;
  totalPrice:number;
  guestName: string;
  status:    string;
}

function ConfirmInner() {
  const { user }     = useAuth();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const bookingId    = searchParams.get("bookingId") ?? "";

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState(false);
  const [error,   setError]   = useState("");

  const [pointsBalance, setPointsBalance] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "hotel">("hotel");
  const [usePoints, setUsePoints] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!bookingId || !user) return;

    user.getIdToken().then((token) =>
      fetch(`/api/bookings/${bookingId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { setBooking(d); setLoading(false); })
        .catch(() => setLoading(false))
    );

    async function fetchUserData() {
      try {
        const { getClientDb } = await import("@/lib/firebase");
        const db = await getClientDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "loyalty", user!.uid));
        if (snap.exists()) {
          setPointsBalance(snap.data().pointsBalance ?? 0);
        }
        const userSnap = await getDoc(doc(db, "users", user!.uid));
        if (userSnap.exists()) {
          const fetchedPhone = userSnap.data().phone || "";
          setPhone(fetchedPhone);
        }
      } catch (e) {
        console.error("Failed to fetch user data", e);
      }
    }
    fetchUserData();
  }, [bookingId, user]);

  const maxDiscountObj = Math.floor(pointsBalance / 10);
  const discountAmount = usePoints ? Math.min(maxDiscountObj, booking?.totalPrice ?? 0) : 0;
  const remainingTotal = (booking?.totalPrice ?? 0) - discountAmount;



  async function handlePay() {
    if (!booking || !user) return;
    
    if (!phone || !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setPaying(true);
    setError("");
    
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookingId, paymentMethod, usePoints, phone })
      });
      const data = await res.json();
      
      if (data.error) {
         setError(data.error);
         setPaying(false);
         return;
      }
      if (data.redirectUrl) {
         router.push(data.redirectUrl);
      } else {
         setError("Unexpected response from server.");
         setPaying(false);
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
      setPaying(false);
    }
  }

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return <div style={{ padding: "80px 32px", textAlign: "center", color: "#50606f" }}>Loading booking…</div>;
  }

  if (!booking) {
    return <div style={{ padding: "80px 32px", textAlign: "center", color: "#ba1a1a" }}>Booking not found.</div>;
  }

  return (
    <div className="confirm-wrapper">
      <style>{`
        .confirm-wrapper {
          min-height: 100vh;
          background: #fbfaee;
          padding: 64px 32px;
          display: flex;
          justify-content: center;
        }
        .pm-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 1px solid #d4d3c9;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fff;
        }
        .pm-option.selected {
          border-color: #061b0e;
          background: #f5f4e8;
        }
        .pm-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .confirm-wrapper {
            padding: 32px 18px;
          }
          .confirm-title {
            font-size: 1.75rem !important;
            margin-bottom: 24px !important;
          }
        }
      `}</style>
      <div style={{ width: "100%", maxWidth: 540 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Step 2 of 2</p>
        <h1 className="confirm-title" style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 300, color: "#061b0e", marginBottom: 32, lineHeight: 1.1 }}>
          Review your<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>booking.</em>
        </h1>

        {error && (
          <div style={{ background: "#ffdad6", borderRadius: "0.5rem", padding: "12px 16px", marginBottom: 24, fontSize: "0.875rem", color: "#ba1a1a" }}>
            {error}
          </div>
        )}

        {/* Booking card */}
        <div style={{ background: "#f5f4e8", borderRadius: "1rem", padding: 28, marginBottom: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <Row label="Booking Ref"  value={booking.id.slice(0, 8).toUpperCase()} />
          <Row label="Guest"        value={booking.guestName} />
          <Row label="Check-in"     value={fmt(booking.checkIn)} />
          <Row label="Check-out"    value={fmt(booking.checkOut)} />
          <Row label="Duration"     value={`${booking.nights} night${booking.nights !== 1 ? "s" : ""}`} />
          <div style={{ height: 1, background: "rgba(195,200,193,0.3)", margin: "8px 0" }} />
          
          <Row label="Room Total" value={`₹${booking.totalPrice.toLocaleString("en-IN")}`} />
          
          {usePoints && discountAmount > 0 && (
            <Row label={`Points Redeemed (${discountAmount * 10} pts)`} value={`- ₹${discountAmount.toLocaleString("en-IN")}`} color="#008a00" />
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f" }}>Total to Pay</span>
            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.5rem", fontWeight: 300, color: "#061b0e" }}>
              ₹{remainingTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Guest Details */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>Guest Details</p>
          <div
            style={{ background: "#f5f4e8", borderRadius: "0.5rem", padding: "12px 14px", borderBottom: "2px solid transparent" }}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
            onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>Phone Number *</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit phone number"
              required
              style={{ width: "100%", fontSize: 14, color: "#1b1c15", fontWeight: 400, background: "none", border: "none", outline: "none" }}
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#50606f", marginBottom: 16 }}>Payment Method</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label className={`pm-option ${paymentMethod === "online" ? "selected" : ""} disabled`}>
              <input 
                type="radio" name="paymentMethod" value="online" 
                checked={paymentMethod === "online"}
                disabled
                style={{ accentColor: "#061b0e" }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "#061b0e", fontWeight: 500 }}>Pay Online (Card)</span>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", background: "#f5f4e8", color: "#50606f", padding: "2px 6px", borderRadius: 4 }}>
                  Coming Soon
                </span>
              </div>
            </label>

            <label className={`pm-option ${paymentMethod === "hotel" ? "selected" : ""}`}>
               <input 
                type="radio" name="paymentMethod" value="hotel" 
                checked={paymentMethod === "hotel"}
                onChange={() => setPaymentMethod("hotel")}
                style={{ accentColor: "#061b0e" }}
              />
              <span style={{ fontSize: 14, color: "#061b0e", fontWeight: 500 }}>Pay at Hotel</span>
            </label>
          </div>

          {pointsBalance >= 10 && (
            <div style={{ marginTop: 20, padding: 16, border: "1px dashed #c0bca8", borderRadius: 8 }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={usePoints} 
                  onChange={(e) => setUsePoints(e.target.checked)}
                  style={{ accentColor: "#061b0e", marginTop: 4 }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 14, color: "#061b0e", fontWeight: 600 }}>Use Loyalty Points</span>
                  <span style={{ fontSize: 13, color: "#50606f" }}>
                    Balance: {pointsBalance} points (worth ₹{maxDiscountObj})
                  </span>
                  {usePoints && remainingTotal === 0 && (
                    <span style={{ fontSize: 12, color: "#008a00", fontWeight: 500, marginTop: 4 }}>
                      Your points cover the entire stay!
                    </span>
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        <button
          onClick={handlePay} disabled={paying}
          style={{
            width: "100%", background: paying ? "#1b3022" : "#061b0e", color: "#ffffff",
            border: "none", borderRadius: "0.75rem", padding: "14px", fontSize: 11,
            fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: paying ? "not-allowed" : "pointer", marginBottom: 14,
          }}
        >
          {paying ? "Processing…" : `Confirm ${paymentMethod === "hotel" && remainingTotal > 0 ? "& Reserve" : "& Pay"}`}
        </button>
        <Link href={`/book/${booking.roomId}?checkIn=${booking.checkIn}&checkOut=${booking.checkOut}`}
          style={{ display: "block", textAlign: "center", fontSize: "0.875rem", color: "#50606f" }}>
          ← Edit booking
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: "0.8125rem", color: "#50606f" }}>{label}</span>
      <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: color ?? "#1b1c15" }}>{value}</span>
    </div>
  );
}

export default function ConfirmPage() {
  return <Suspense fallback={null}><ConfirmInner /></Suspense>;
}
