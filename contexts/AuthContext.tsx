"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "firebase/auth";
import { getClientAuth, getClientDb } from "@/lib/firebase";

interface AuthContextValue {
  user:              User | null;
  loading:           boolean;
  signIn:            (email: string, password: string) => Promise<void>;
  signInWithGoogle:  () => Promise<void>;
  signOut:           () => Promise<void>;
  register:          (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    referralCode?: string
  ) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function generateReferralCode(firstName: string): string {
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${firstName.toUpperCase().slice(0, 4)}${suffix}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    getClientAuth().then((auth) => {
      const { onAuthStateChanged } = require("firebase/auth") as typeof import("firebase/auth");
      unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          const token = await u.getIdToken();
          await fetch("/api/auth/session", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ token }),
          });
        } else {
          await fetch("/api/auth/session", { method: "DELETE" });
        }
        setLoading(false);
      });
    });

    return () => { if (unsub) unsub(); };
  }, []);

  async function signIn(email: string, password: string) {
    const auth = await getClientAuth();
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  }

  async function signInWithGoogle() {
    const auth = await getClientAuth();
    const db   = await getClientDb();
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const { doc, setDoc, serverTimestamp }        = await import("firebase/firestore");

    const provider = new GoogleAuthProvider();
    const result   = await signInWithPopup(auth, provider);
    const u        = result.user;
    
    const token = await u.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    await setDoc(
      doc(db, "users", u.uid),
      {
        uid:          u.uid,
        email:        u.email,
        firstName:    u.displayName?.split(" ")[0] ?? "",
        lastName:     u.displayName?.split(" ").slice(1).join(" ") ?? "",
        phone:        u.phoneNumber ?? "",
        role:         "guest",
        referralCode: generateReferralCode(u.displayName?.split(" ")[0] ?? "USER"),
        createdAt:    serverTimestamp(),
        updatedAt:    serverTimestamp(),
      },
      { merge: true }
    );
  }

  async function signOut() {
    const auth = await getClientAuth();
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth);
  }

  async function sendPasswordReset(email: string) {
    const auth = await getClientAuth();
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
    referralCode?: string
  ) {
    const auth = await getClientAuth();
    const db   = await getClientDb();
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const { doc, setDoc, serverTimestamp, collection, query, where, getDocs } = await import("firebase/firestore");

    if (referralCode) {
      const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
      const snap = await getDocs(q);
      if (snap.empty) {
        throw new Error("The referral code you entered is invalid or does not exist.");
      }
    }

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    const token = await cred.user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    await setDoc(doc(db, "users", cred.user.uid), {
      uid:               cred.user.uid,
      email,
      firstName,
      lastName,
      phone:             phone ?? "",
      role:              "guest",
      referralCode:      generateReferralCode(firstName),
      appliedReferralCode: referralCode ?? "",
      createdAt:         serverTimestamp(),
      updatedAt:         serverTimestamp(),
    });
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut, register, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
