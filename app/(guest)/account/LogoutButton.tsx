"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        width: "100%", textAlign: "left", cursor: "pointer",
        padding: "16px 20px", background: "#fdf5f5", borderRadius: "0.75rem",
        border: "1px solid #ffebeb",
        textDecoration: "none", color: "#ba1a1a",
        marginTop: "12px"
      }}
    >
      <div>
        <p style={{ fontWeight: 500, fontSize: "0.9375rem", marginBottom: 2 }}>Sign Out</p>
        <p style={{ fontSize: 12, color: "#e57373", fontWeight: 300 }}>
          {loading ? "Signing out..." : "Log out of your account"}
        </p>
      </div>
      <span style={{ fontSize: 18, color: "#e57373" }}>👋</span>
    </button>
  );
}
