"use client";

import { useState } from "react";

const INFO = [
  {
    icon: "location_on",
    label: "Address",
    lines: ["M/S Chello Yaku Guest House", "SANTI NAGAR, NEAR-(PETROL PUMP)", "PAPUMPARE (AP) 791121"],
  },
  {
    icon: "call",
    label: "Phone",
    lines: ["+91 9678267281", "+91 6909419604"],
  },
  {
    icon: "mail",
    label: "Email",
    lines: ["hello@yakustay.online", "reservations@yakustay.online"],
  },
  {
    icon: "schedule",
    label: "Front Desk",
    lines: ["Open 24 hours, 7 days a week"],
  },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      
      setStatus("sent");
      // Reset form after successful submission
      setForm({ name: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
  };

  return (
    <div style={{ background: "#fbfaee", minHeight: "100vh" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          height: 420,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
          alt="Chello Yaku Guest House mountain landscape"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(6,27,14,0.88) 0%, rgba(6,27,14,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            padding: "0 32px 56px",
          }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b4cdb8", marginBottom: 12 }}>
            We&rsquo;d love to hear from you
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "#ffffff",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Get in <em style={{ fontStyle: "italic" }}>touch.</em>
          </h1>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <section className="section-pad" style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px" }}>
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* ── Info Column ─────────────────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
              Find Us
            </p>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "1.875rem",
                fontWeight: 300,
                color: "#061b0e",
                lineHeight: 1.2,
                marginBottom: 40,
              }}
            >
              A warm welcome waiting <em style={{ fontStyle: "italic" }}>for you.</em>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {INFO.map(({ icon, label, lines }) => (
                <div key={label} style={{ display: "flex", gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#efeee3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#061b0e" }}>
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>
                      {label}
                    </p>
                    {lines.map((l) => (
                      <p key={l} style={{ fontSize: "0.9375rem", color: "#1b1c15", lineHeight: 1.6, fontWeight: 300 }}>
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div
              style={{
                marginTop: 40,
                borderRadius: "1rem",
                overflow: "hidden",
                height: 260,
                border: "1px solid #e4e3d7",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.7!2d93.970051!3d27.303790!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s27.303790%2C+93.970051!5e0!3m2!1sen!2sin!4v1680000000000&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chello Yaku Guest House location"
              />
            </div>
          </div>

          {/* ── Contact Form ─────────────────────────────────────────────── */}
          <div
            className="contact-form-card"
            style={{
              background: "#ffffff",
              borderRadius: "1.25rem",
              padding: 48,
              boxShadow: "0 8px 48px rgba(27,48,34,0.07)",
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#50606f", marginBottom: 10 }}>
              Send a Message
            </p>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "1.5rem",
                fontWeight: 300,
                color: "#061b0e",
                marginBottom: 32,
              }}
            >
              We reply within 24 hours.
            </h2>

            {status === "sent" ? (
              <div
                style={{
                  background: "#d0e9d4",
                  borderRadius: "1rem",
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#1b3022", display: "block", marginBottom: 16 }}>
                  check_circle
                </span>
                <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", color: "#061b0e", marginBottom: 8 }}>
                  Message received!
                </p>
                <p style={{ color: "#50606f", fontSize: "0.9rem" }}>
                  Our team will get back to you within 24 hours.
                </p>
              </div>
            ) : status === "error" ? (
              <div
                style={{
                  background: "#f8d7da",
                  borderRadius: "1rem",
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#721c24", display: "block", marginBottom: 16 }}>
                  error
                </span>
                <p style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem", color: "#721c24", marginBottom: 8 }}>
                  Something went wrong
                </p>
                <p style={{ color: "#721c24", fontSize: "0.9rem", marginBottom: 16 }}>
                  Failed to send your message. Please try again.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  style={{
                    background: "#721c24",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "12px 24px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Name + Email row */}
                <div className="contact-name-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { id: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { id: "phone", label: "Phone Number", type: "tel", placeholder: "Your phone number" },
                  ].map(({ id, label, type, placeholder }) => (
                    <label key={id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#50606f",
                        }}
                      >
                        {label}
                      </span>
                      <input
                        id={id}
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[id as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                        style={{
                          fontSize: "0.9375rem",
                          color: "#1b1c15",
                          background: "#f5f4e8",
                          border: "1px solid #e4e3d7",
                          borderRadius: "0.625rem",
                          padding: "12px 16px",
                          outline: "none",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#1b3022")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e3d7")}
                      />
                    </label>
                  ))}
                </div>

                {/* Subject */}
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f" }}>
                    Subject
                  </span>
                  <select
                    id="subject"
                    required
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    style={{
                      fontSize: "0.9375rem",
                      color: form.subject ? "#1b1c15" : "#a0a09a",
                      background: "#f5f4e8",
                      border: "1px solid #e4e3d7",
                      borderRadius: "0.625rem",
                      padding: "12px 16px",
                      outline: "none",
                      appearance: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1b3022")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e3d7")}
                  >
                    <option value="" disabled>Select a subject…</option>
                    <option value="reservation">Reservation Inquiry</option>
                    <option value="special">Special Requests / Events</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                {/* Message */}
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f" }}>
                    Message
                  </span>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    style={{
                      fontSize: "0.9375rem",
                      color: "#1b1c15",
                      background: "#f5f4e8",
                      border: "1px solid #e4e3d7",
                      borderRadius: "0.625rem",
                      padding: "12px 16px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "Inter, sans-serif",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1b3022")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#e4e3d7")}
                  />
                </label>

                <button
                  id="contact-submit"
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    background: "#061b0e",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.75rem",
                    padding: "16px 32px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    opacity: status === "sending" ? 0.7 : 1,
                    transition: "opacity 0.2s",
                    alignSelf: "flex-start",
                  }}
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
