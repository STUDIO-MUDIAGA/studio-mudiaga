"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, LayoutDashboard, CalendarDays, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";

const ORANGE = "#c46442";

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
    <div style={{ minHeight: "100vh", background: "#f5f5f3" }}>
      <header style={{ borderBottom: "1px solid #e8e8e4", padding: "0 32px", background: "#fff", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Group.svg" alt="Studio Mudiaga" width={22} height={22} />
            </Link>
            <nav style={{ display: "flex", gap: 2 }}>
              {NAV.map(({ label, href }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 13, textDecoration: "none", color: active ? ORANGE : "#888", background: active ? "#fdf0eb" : "transparent", fontWeight: active ? 600 : 400 }}>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ color: "#888", fontSize: 13 }}>{displayName}</span>
            <button onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #e8e8e4", color: "#aaa", fontSize: 12, cursor: "pointer", padding: "6px 12px", borderRadius: 8 }}>
              <LogOut size={12} /> Sign out
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
