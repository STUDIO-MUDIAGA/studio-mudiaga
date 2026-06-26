"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, CalendarDays, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Bookings", href: "/account/bookings", icon: CalendarDays },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Profile", href: "/account/profile", icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "there";

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Top nav */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", background: "#0a0a0a", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Group.svg" alt="Studio Mudiaga" width={24} height={24} style={{ filter: "invert(1)", opacity: 0.8 }} />
            </Link>
            <nav style={{ display: "flex", gap: 4 }}>
              {NAV.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                    color: active ? "#fff" : "rgba(255,255,255,0.35)",
                    background: active ? "rgba(255,255,255,0.07)" : "transparent",
                    fontWeight: active ? 500 : 400,
                  }}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>{displayName}</span>
            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "pointer", padding: "6px 10px", borderRadius: 8 }}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        {children}
      </main>
    </div>
  );
}
