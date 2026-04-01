"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname() || "/admin";

  const links = [
    { label: "Dashboard", href: "/admin", exact: true },
    { label: "Rooms", href: "/admin/rooms" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Guests", href: "/admin/guests" }
  ];

  return (
    <aside style={{ 
      width: collapsed ? 80 : 280, 
      background: "#061b0e", 
      color: "#fff", 
      padding: collapsed ? "24px 16px" : "48px 32px", 
      display: "flex", 
      flexDirection: "column",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "relative",
      flexShrink: 0
    }}>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: 32,
          right: collapsed ? "auto" : 24,
          left: collapsed ? "50%" : "auto",
          transform: collapsed ? "translateX(-50%)" : "none",
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          fontSize: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 8,
          transition: "color 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
        title={collapsed ? "Expand Menu" : "Collapse Menu"}
      >
        {collapsed ? "☰" : "⨉"}
      </button>

      <div style={{ height: 48, marginBottom: 48, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", opacity: collapsed ? 0 : 1, transition: "opacity 0.2s" }}>
        {!collapsed && (
          <p style={{ 
            fontSize: 10, 
            fontWeight: 700, 
            letterSpacing: "0.2em", 
            textTransform: "uppercase", 
            color: "rgba(255,255,255,0.5)", 
            margin: 0,
            whiteSpace: "nowrap"
          }}>
            Staff Portal
          </p>
        )}
      </div>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((lnk) => {
          const isActive = lnk.exact ? pathname === lnk.href : pathname.startsWith(lnk.href);
          return (
            <Link 
              key={lnk.href}
              href={lnk.href} 
              style={{ 
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)", 
                textDecoration: "none", 
                fontSize: "0.9375rem", 
                fontWeight: isActive ? 500 : 300,
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                padding: collapsed ? "12px 0" : "12px 16px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                overflow: "hidden"
              }}
              title={lnk.label}
            >
              <span style={{ 
                display: "inline-block", 
                width: collapsed ? "auto" : 24, 
                opacity: collapsed ? 1 : 0.8,
                fontWeight: isActive && collapsed ? 700 : 400
              }}>
                {lnk.label.charAt(0)}
              </span>
              {!collapsed && <span>{lnk.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, textAlign: collapsed ? "center" : "left" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: "0.875rem", fontWeight: 300, display: "flex", justifyContent: collapsed ? "center" : "flex-start", alignItems: "center" }} title="Back to Website">
          <span style={{ fontSize: "1.2rem", marginRight: collapsed ? 0 : 8 }}>←</span>
          {!collapsed && "Back to Website"}
        </Link>
      </div>
    </aside>
  );
}
