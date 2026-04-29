"use client";

import { Suspense, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function LoginForm() {
  const { signIn, signInWithGoogle, sendPasswordReset } = useAuth();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") ?? "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setResetSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      window.location.assign(redirect);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Sign in failed. Please try again.";
      if (msg.includes("auth/invalid-credential")) {
        msg = "invalid-credential";
      }
      setError(msg);
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
      setError(err instanceof Error ? err.message : "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
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
        Welcome<br /><em style={{ fontStyle: "italic", opacity: 0.85 }}>back.</em>
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

      {resetSent ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: "#061b0e", fontSize: "1rem", marginBottom: 16 }}>
            A password reset link has been sent to <strong>{email}</strong>.
          </p>
          <button
            onClick={() => { setResetSent(false); setIsResetMode(false); }}
            style={{
              background: "#061b0e", color: "#ffffff", border: "none", borderRadius: "0.75rem",
              padding: "12px 24px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", cursor: "pointer"
            }}
          >
            Return to Login
          </button>
        </div>
      ) : isResetMode ? (
        <>
          <p style={{ color: "#50606f", fontSize: "0.9375rem", marginBottom: 24 }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{ background: "#f5f4e8", borderRadius: "0.5rem", padding: "12px 14px", borderBottom: "2px solid transparent" }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>Email</p>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", fontSize: 14, color: "#1b1c15", fontWeight: 400, background: "none", border: "none", outline: "none" }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", background: loading ? "#1b3022" : "#061b0e", color: "#ffffff",
                border: "none", borderRadius: "0.75rem", padding: "14px", fontSize: 11,
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer", marginTop: 8,
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <button
            onClick={() => { setIsResetMode(false); setError(""); }}
            style={{
              width: "100%", background: "transparent", color: "#50606f",
              border: "none", padding: "14px", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
              marginTop: 16
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{ background: "#f5f4e8", borderRadius: "0.5rem", padding: "12px 14px", borderBottom: "2px solid transparent" }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>Email</p>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", fontSize: 14, color: "#1b1c15", fontWeight: 400, background: "none", border: "none", outline: "none" }}
              />
            </div>
    
            <div
              style={{ background: "#f5f4e8", borderRadius: "0.5rem", padding: "12px 14px", borderBottom: "2px solid transparent" }}
              onFocusCapture={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = "#061b0e"; }}
              onBlurCapture={(e)  => { (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#50606f", marginBottom: 4 }}>Password</p>
                <button 
                  type="button"
                  onClick={() => { setIsResetMode(true); setError(""); }}
                  style={{ background: "none", border: "none", fontSize: 10, color: "#50606f", textDecoration: "underline", cursor: "pointer" }}
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: "100%", fontSize: 14, color: "#1b1c15", fontWeight: 400, background: "none", border: "none", outline: "none" }}
              />
            </div>
    
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", background: loading ? "#1b3022" : "#061b0e", color: "#ffffff",
                border: "none", borderRadius: "0.75rem", padding: "14px", fontSize: 11,
                fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer", marginTop: 8,
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
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
            No account?{" "}
            <Link
              href={redirect !== "/" ? `/register?redirect=${encodeURIComponent(redirect)}` : "/register"}
              style={{ color: "#061b0e", fontWeight: 500 }}
            >
              Register here
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh", background: "#fbfaee",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
