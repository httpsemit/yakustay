"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookingSummary from "@/components/booking/BookingSummary";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { Suspense, use } from "react";

interface RoomInfo { name: string; pricePerNight: number }

const field: React.CSSProperties = {
  background:   "#f5f4e8",
  borderRadius: "0.5rem",
  padding:      "12px 14px",
  borderBottom: "2px solid transparent",
};
const lbl: React.CSSProperties = { fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4, display: "block" };
const inp: React.CSSProperties = { width: "100%", fontSize: 14, color: "#1b1c15", background: "none", border: "none", outline: "none" };

export default function BookingFormPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  return (
    <Suspense fallback={null}>
      <BookingFormInner roomId={roomId} />
    </Suspense>
  );
}

function BookingFormInner({ roomId }: { roomId: string }) {
  const { user }     = useAuth();
  const router       = useRouter();
  const searchParams = useSearchParams();

  const checkIn  = searchParams.get("checkIn")  ?? "";
  const checkOut = searchParams.get("checkOut") ?? "";

  const [room,    setRoom]    = useState<RoomInfo | null>(null);
  const [name,    setName]    = useState(user?.displayName ?? "");
  const [email,   setEmail]   = useState(user?.email ?? "");
  const [notes,   setNotes]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const nights = checkIn && checkOut
    ? differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
    : 0;

  useEffect(() => {
    if (!user || profileLoaded) return;
    async function loadProfile() {
      try {
        if (!user) return;
        const token = await user.getIdToken();
        const response = await fetch("/api/auth/session", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await response.json();
        
        if (userData.firstName || userData.lastName) {
          setName(`${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim());
        } else if (user?.displayName) {
          setName(user.displayName);
        }
        if (userData.email) setEmail(userData.email);
        else if (user?.email) setEmail(user.email);
        
        setProfileLoaded(true);
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    }
    loadProfile();
  }, [user, profileLoaded]);

  useEffect(() => {
    if (!roomId) return;
    fetch(`/api/rooms/${roomId}`)
      .then((r) => r.json())
      .then((data) => { if (data.name) setRoom(data); })
      .catch(() => {});
  }, [roomId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!user) {
      const returnTo = `/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}`;
      router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res   = await fetch("/api/bookings/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ roomId, checkIn, checkOut, guestName: name, guestEmail: email, notes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Booking failed"); return; }
      router.push(data.redirectUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-wrapper">
      <style>{`
        .booking-wrapper {
          min-height: 100vh;
          background: #fbfaee;
          padding: 64px 32px;
        }
        .booking-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }
        .booking-summary-panel {
          position: sticky;
          top: 88px;
        }
        @media (max-width: 768px) {
          .booking-wrapper {
            padding: 32px 18px;
          }
          .booking-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .booking-title {
            font-size: 1.75rem !important;
            margin-bottom: 24px !important;
          }
          .booking-summary-panel {
            position: static;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 8 }}>Step 1 of 2</p>
        <h1 className="booking-title" style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 300, color: "#061b0e", marginBottom: 40, lineHeight: 1.1 }}>
          Your details
        </h1>

        {error && (
          <div style={{ background: "#ffdad6", borderRadius: "0.5rem", padding: "12px 16px", marginBottom: 24, fontSize: "0.875rem", color: "#ba1a1a" }}>
            {error}
          </div>
        )}

        <div className="booking-grid">
          {/* Form */}
          <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Full Name",     value: name,  setter: setName,  type: "text",  required: true  },
              { label: "Email Address", value: email, setter: setEmail, type: "email", required: true  },
            ].map(({ label, value, setter, type, required }) => (
              <div
                key={label} style={field}
                onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
                onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
              >
                <span style={lbl}>{label}{!required && <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0 }}> (optional)</span>}</span>
                <input type={type} value={value} onChange={(e) => setter(e.target.value)} required={required} style={inp} />
              </div>
            ))}

            {/* Special requests */}
            <div
              style={field}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <span style={lbl}>Special Requests <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0 }}>(optional)</span></span>
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                style={{ ...inp, resize: "vertical" }}
              />
            </div>

          </form>

          {/* Summary */}
          <div className="booking-summary-panel">
            {room && nights > 0 ? (
              <BookingSummary
                roomName={room.name} checkIn={checkIn} checkOut={checkOut}
                nights={nights} pricePerNight={room.pricePerNight}
              />
            ) : (
              <div style={{ background: "#f5f4e8", borderRadius: "0.75rem", padding: 24, color: "#50606f", fontSize: "0.875rem" }}>
                Loading booking details…
              </div>
            )}
            
            <button
              type="submit" form="booking-form" disabled={loading || nights < 1}
              style={{
                width: "100%", background: loading || nights < 1 ? "#e4e3d7" : "#061b0e",
                color: loading || nights < 1 ? "#737973" : "#ffffff",
                border: "none", borderRadius: "0.75rem", padding: "14px",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: loading || nights < 1 ? "not-allowed" : "pointer", marginTop: 16,
              }}
            >
              {loading ? "Processing…" : "Review Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

