import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserById } from "@/lib/firestore";
import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Chello Yaku Guest House",
  description: "Secure internal administration portal.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const token = cookies().get("session")?.value;
  if (!token) redirect("/login");

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    redirect("/login");
  }

  const user = await getUserById(decoded.uid);
  if (!user || user.role !== "admin") {
    // Not an admin, redirect to front page
    redirect("/");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f2f1e8", display: "flex" }}>
      <AdminSidebar />

      {/* Main Content */}
      <main style={{ flex: 1, padding: "64px 48px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
