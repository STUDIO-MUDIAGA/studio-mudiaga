"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Sofa, CalendarDays,
  ShoppingBag, Users, TrendingUp, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", exact: true, icon: LayoutDashboard },
  { label: "Shortlets",  href: "/admin/shortlets", icon: Building2 },
  { label: "Furniture",  href: "/admin/furniture",  icon: Sofa },
  { label: "Bookings",   href: "/admin/bookings",   icon: CalendarDays },
  { label: "Orders",     href: "/admin/orders",     icon: ShoppingBag },
  { label: "Users",      href: "/admin/users",      icon: Users },
  { label: "Analytics",  href: "/admin/analytics",  icon: TrendingUp },
];

function Sidebar({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: "#0a0a0a",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Image src="/Group.svg" alt="Studio Mudiaga" width={18} height={18} style={{ filter: "invert(1)", opacity: 0.7 }} />
          <div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1 }}>Studio Mudiaga</p>
            <p style={{ color: "#fbbf24", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "3px 0 0" }}>Admin</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, textDecoration: "none",
                fontSize: 13, fontWeight: active ? 500 : 400, marginBottom: 2,
                background: active ? "rgba(251,191,36,0.1)" : "transparent",
                color: active ? "#fbbf24" : "rgba(255,255,255,0.4)",
                transition: "all 0.15s",
              }}
            >
              <Icon size={14} style={{ flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User / sign out */}
      <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 4 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700 }}>{user?.email?.[0]?.toUpperCase()}</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 10, background: "none", border: "none",
            color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer",
            transition: "all 0.15s", textAlign: "left",
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          onMouseOut={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "none"; }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="lg-sidebar">
        <style>{`@media(min-width:1024px){.lg-sidebar{display:flex!important}}`}</style>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <Sidebar onNav={() => setSidebarOpen(false)} />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "white", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Mobile topbar */}
        <header style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }} className="mobile-topbar">
          <style>{`@media(min-width:1024px){.mobile-topbar{display:none!important}}`}</style>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
            <Menu size={18} />
          </button>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, margin: 0 }}>Studio Mudiaga Admin</p>
          <div style={{ width: 18 }} />
        </header>

        <main style={{ flex: 1, padding: "36px 40px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
