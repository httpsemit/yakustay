"use client";

import { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const fieldStyle = {
  background: "#f5f4e8",
  borderRadius: "0.5rem",
  padding: "12px 14px",
  borderBottom: "2px solid transparent",
};

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#50606f",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 14,
  color: "#1b1c15",
  fontWeight: 400,
  background: "none",
  border: "none",
  outline: "none",
};

function RegisterForm() {
  const { register, signInWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/";

  const [firstName,    setFirstName]    = useState("");
  const [lastName,     setLastName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [phone,        setPhone]        = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password, firstName, lastName, phone || undefined, referralCode || undefined);
      window.location.assign(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      window.location.assign(redirect);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fbfaee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        <p
          style={{
            fontSize: "0.625rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#50606f",
            marginBottom: 8,
          }}
        >
          Chello Yaku Hotel
        </p>

        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "2.5rem",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            color: "#061b0e",
            marginBottom: 32,
            lineHeight: 1.1,
          }}
        >
          Create your<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>account.</em>
        </h1>

        {error && (
          <div
            style={{
              background: "#ffdad6",
              borderRadius: "0.5rem",
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: "0.875rem",
              color: "#ba1a1a",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* First + Last Name row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div
              style={fieldStyle}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <p style={labelStyle}>First Name</p>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div
              style={fieldStyle}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <p style={labelStyle}>Last Name</p>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {/* Email */}
          <div
            style={fieldStyle}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
            onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            <p style={labelStyle}>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div
            style={fieldStyle}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
            onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            <p style={labelStyle}>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          {/* Phone (optional) */}
          <div
            style={fieldStyle}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
            onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            <p style={labelStyle}>Phone (optional)</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Referral code (optional) */}
          <div
            style={fieldStyle}
            onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
            onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            <p style={labelStyle}>Referral Code (optional)</p>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="e.g. RAVI2025"
              style={{ ...inputStyle, textTransform: "uppercase" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#1b3022" : "#061b0e",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.75rem",
              padding: "14px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(195,200,193,0.3)" }} />
          <span style={{ fontSize: 11, color: "#50606f", letterSpacing: "0.08em" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(195,200,193,0.3)" }} />
        </div>
  
        <button
          onClick={handleGoogle} disabled={loading}
          style={{
            width: "100%", background: "transparent", color: "#061b0e",
            border: "1px solid rgba(195,200,193,0.2)", borderRadius: "0.75rem",
            padding: "10px 20px", fontSize: 11, fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: "0.875rem", color: "#50606f" }}>
          Already have an account?{" "}
          <Link
            href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
            style={{ color: "#061b0e", fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
