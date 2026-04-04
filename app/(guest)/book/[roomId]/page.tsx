"use client";

import { useState, FormEvent, useEffect, useCallback, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { use } from "react";

// Lazy load BookingSummary to reduce initial bundle size
const BookingSummary = lazy(() => import("@/components/booking/BookingSummary"));

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

  // Form fields
  const [room,    setRoom]    = useState<RoomInfo | null>(null);
  const [name,    setName]    = useState(user?.displayName ?? "");
  const [email,   setEmail]   = useState(user?.email ?? "");
  const [phone,   setPhone]   = useState("");
  const [notes,   setNotes]   = useState("");
  
  // Payment and loyalty
  const [paymentMethod, setPaymentMethod] = useState("hotel");
  const [usePoints, setUsePoints] = useState(false);
  const [pointsBalance, setPointsBalance] = useState(0);
  
  // UI state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const nights = checkIn && checkOut
    ? differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn))
    : 0;

  // Indian phone number validation function (declared early to avoid lint errors)
  const validatePhone = useCallback((phone: string): string => {
    // Remove spaces and trim
    const cleanPhone = phone.replace(/\s/g, '').trim();
    
    // Check if exactly 10 digits
    if (cleanPhone.length !== 10) {
      return "Enter a valid 10-digit Indian mobile number";
    }
    
    // Check if contains only numbers
    if (!/^\d+$/.test(cleanPhone)) {
      return "Phone number must contain only digits";
    }
    
    // Check if starts with 6, 7, 8, or 9 (valid Indian mobile numbers)
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return "Enter a valid 10-digit Indian mobile number";
    }
    
    return ""; // No error
  }, []);

  // Load user profile data
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
        
        // Load phone from user profile
        const { getClientDb } = await import("@/lib/firebase");
        const db = await getClientDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
          const fetchedPhone = userSnap.data().phone || "";
          // Check if phone number exceeds 10 digits or is invalid
          const cleanPhone = fetchedPhone.replace(/\D/g, '').replace(/\s/g, '').slice(0, 10);
          const phoneError = validatePhone(cleanPhone);
          
          if (fetchedPhone.length > 10 || phoneError) {
            alert(`Phone number must be exactly 10 digits starting with 6, 7, 8, or 9. Your current number: ${fetchedPhone}. Please update it to a valid Indian mobile number.`);
            // Set cleaned phone for now
            setPhone(cleanPhone);
          } else {
            setPhone(cleanPhone);
          }
        }
        
        setProfileLoaded(true);
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    }
    loadProfile();
  }, [user, profileLoaded, validatePhone]);

  // Load room data - optimized with useCallback
  useEffect(() => {
    if (!roomId) return;
    
    const controller = new AbortController();
    
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (data.name && !controller.signal.aborted) {
          setRoom(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Failed to fetch room:', error);
        }
      }
    };
    
    fetchRoom();
    
    return () => {
      controller.abort();
    };
  }, [roomId]);

  // Load loyalty points
  useEffect(() => {
    if (!user || !profileLoaded) return;
    async function fetchUserData() {
      try {
        const { getClientDb } = await import("@/lib/firebase");
        const db = await getClientDb();
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "loyalty", user!.uid));
        if (snap.exists()) {
          setPointsBalance(snap.data().pointsBalance ?? 0);
        }
      } catch (e) {
        console.error("Failed to fetch loyalty data", e);
      }
    }
    fetchUserData();
  }, [user, profileLoaded]);

  // Real-time validation functions
  const validateName = useCallback((value: string) => {
    if (value.length < 2) {
      return "Name must be at least 2 characters";
    }
    return "";
  }, []);

  const validateEmail = useCallback((value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  }, []);

  // Handle field changes with validation
  const handleNameChange = useCallback((value: string) => {
    setName(value);
    setFormTouched(true);
    if (formTouched || value.length > 0) {
      setValidationErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  }, [validateName, formTouched]);

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setFormTouched(true);
    if (formTouched || value.length > 0) {
      setValidationErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  }, [validateEmail, formTouched]);

  const handlePhoneChange = useCallback((value: string) => {
    // Remove all non-digit characters and spaces
    const phoneOnly = value.replace(/\D/g, '').replace(/\s/g, '').slice(0, 10);
    setPhone(phoneOnly);
    setFormTouched(true);
    
    // Validate only if user has started typing or form was touched
    if (formTouched || phoneOnly.length > 0) {
      setValidationErrors(prev => ({ ...prev, phone: validatePhone(phoneOnly) }));
    }
  }, [validatePhone, formTouched]);

  // Check if form is valid (without updating state)
  const checkFormValid = useCallback(() => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    return !nameError && !emailError && !phoneError;
  }, [name, email, phone, validateName, validateEmail, validatePhone]);

  // Validate form and update errors (for submit)
  const validateAndUpdateErrors = useCallback(() => {
    const errors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone)
    };
    setValidationErrors(errors);
    return !errors.name && !errors.email && !errors.phone;
  }, [name, email, phone, validateName, validateEmail, validatePhone]);

  // Calculate pricing with points
  const maxDiscountObj = Math.floor(pointsBalance / 10);
  const discountAmount = usePoints ? Math.min(maxDiscountObj, room ? room.pricePerNight * nights : 0) : 0;
  const remainingTotal = (room ? room.pricePerNight * nights : 0) - discountAmount;

  // Sequential API calls
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    if (!user) {
      const returnTo = `/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}`;
      router.push(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    if (!validateAndUpdateErrors()) {
      setError("Please fix the errors above");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Step 1: Create booking
      const token = await user.getIdToken();
      const createRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          roomId, 
          checkIn, 
          checkOut, 
          guestName: name, 
          guestEmail: email, 
          notes,
          guestPhone: phone
        }),
      });
      
      const createData = await createRes.json();
      if (!createRes.ok) { 
        setError(createData.error ?? "Booking failed"); 
        return; 
      }

      // Step 2: Process checkout
      const checkoutRes = await fetch("/api/bookings/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          bookingId: createData.bookingId, 
          paymentMethod, 
          usePoints, 
          phone 
        }),
      });
      
      const checkoutData = await checkoutRes.json();
      
      if (checkoutData.error) {
        setError(checkoutData.error);
        return;
      }
      
      if (checkoutData.redirectUrl) {
        router.push(checkoutData.redirectUrl);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fmt = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

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
        .error-text {
          color: #ba1a1a;
          font-size: 0.75rem;
          margin-top: 4px;
        }
        .pm-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #e4e3d7;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pm-option:hover {
          border-color: #061b0e;
          background: #f5f4e8;
        }
        .pm-option.selected {
          border-color: #061b0e;
          background: #f5f4e8;
        }
        .pm-option.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .pm-option.disabled:hover {
          border-color: #e4e3d7;
          background: transparent;
        }
        .trust-text {
          font-size: 0.875rem;
          color: #059669;
          text-align: center;
          margin-top: 12px;
          font-weight: 500;
        }
        .total-price {
          font-family: 'Noto Serif', serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #061b0e;
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
          .total-price {
            font-size: 1.25rem;
          }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <h1 className="booking-title" style={{ fontFamily: "'Noto Serif', serif", fontSize: "2rem", fontWeight: 300, color: "#061b0e", marginBottom: 40, lineHeight: 1.1 }}>
          Complete Your Booking
        </h1>

        {error && (
          <div style={{ background: "#ffdad6", borderRadius: "0.5rem", padding: "12px 16px", marginBottom: 24, fontSize: "0.875rem", color: "#ba1a1a" }}>
            {error}
          </div>
        )}

        <div className="booking-grid">
          {/* Form Section */}
          <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Full Name */}
            <div style={field}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <span style={lbl}>Full Name</span>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => handleNameChange(e.target.value)} 
                required 
                style={inp} 
              />
              {validationErrors.name && (
                <div className="error-text">{validationErrors.name}</div>
              )}
            </div>

            {/* Email */}
            <div style={field}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <span style={lbl}>Email Address</span>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => handleEmailChange(e.target.value)} 
                required 
                style={inp} 
              />
              {validationErrors.email && (
                <div className="error-text">{validationErrors.email}</div>
              )}
            </div>

            {/* Phone Number */}
            <div 
              style={{
                ...field,
                borderBottom: validationErrors.phone ? "2px solid #ba1a1a" : "2px solid transparent"
              }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = validationErrors.phone ? "#ba1a1a" : "transparent"; }}
            >
              <span style={lbl}>Phone Number</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                required
                style={{
                  ...inp,
                  color: validationErrors.phone ? "#ba1a1a" : "#1b1c15"
                }}
              />
              {validationErrors.phone && (
                <div className="error-text">{validationErrors.phone}</div>
              )}
            </div>

            {/* Special Requests */}
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

            {/* Payment Method */}
            <div style={{ marginTop: 8 }}>
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
            </div>

            {/* Loyalty Points */}
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
          </form>

          {/* Summary Section */}
          <div className="booking-summary-panel">
            {room && nights > 0 ? (
              <>
                <Suspense fallback={
                  <div style={{ background: "#f5f4e8", borderRadius: "0.75rem", padding: 24, color: "#50606f", fontSize: "0.875rem" }}>
                    Loading booking details…
                  </div>
                }>
                  <BookingSummary
                    roomName={room.name} checkIn={checkIn} checkOut={checkOut}
                    nights={nights} pricePerNight={room.pricePerNight}
                  />
                </Suspense>
                
                {/* Enhanced Total Price Display */}
                <div style={{ 
                  background: "#061b0e", 
                  color: "#ffffff", 
                  borderRadius: "0.75rem", 
                  padding: "16px", 
                  marginTop: 16,
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 500, marginBottom: 4, opacity: 0.9 }}>
                    Total Amount
                  </div>
                  <div style={{ 
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#ffffff"
                  }}>
                    ₹{remainingTotal.toLocaleString()}
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ fontSize: "0.75rem", marginTop: 4, opacity: 0.9 }}>
                      (₹{discountAmount} discount applied)
                    </div>
                  )}
                </div>

                {/* Trust Text */}
                <div className="trust-text">
                  Pay at hotel • No advance required
                </div>

                {/* Submit Button */}
                <button
                  type="submit" form="booking-form" 
                  disabled={loading || nights < 1 || !checkFormValid()}
                  style={{
                    width: "100%", 
                    background: (loading || nights < 1 || !checkFormValid()) ? "#e4e3d7" : "#061b0e",
                    color: (loading || nights < 1 || !checkFormValid()) ? "#737973" : "#ffffff",
                    border: "none", 
                    borderRadius: "0.75rem", 
                    padding: "14px",
                    fontSize: 11, 
                    fontWeight: 700, 
                    letterSpacing: "0.12em", 
                    textTransform: "uppercase",
                    cursor: (loading || nights < 1 || !checkFormValid()) ? "not-allowed" : "pointer", 
                    marginTop: 16,
                  }}
                >
                  {loading ? "Processing…" : "Confirm Booking"}
                </button>
              </>
            ) : (
              <div style={{ background: "#f5f4e8", borderRadius: "0.75rem", padding: 24, color: "#50606f", fontSize: "0.875rem" }}>
                Loading booking details…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

