"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Building2, Sofa, CalendarDays,
  ShoppingBag, Users, TrendingUp, LogOut, Menu, X,
  Settings, Bell, Search, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";

const navItems = [
  { label: "Dashboard", href: "/admin",           exact: true, icon: LayoutDashboard },
  { label: "Shortlets",  href: "/admin/shortlets",             icon: Building2 },
  { label: "Furniture",  href: "/admin/furniture",             icon: Sofa },
  { label: "Bookings",   href: "/admin/bookings",              icon: CalendarDays },
  { label: "Orders",     href: "/admin/orders",                icon: ShoppingBag },
  { label: "Users",      href: "/admin/users",                 icon: Users },
  { label: "Analytics",  href: "/admin/analytics",             icon: TrendingUp },
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
    <aside style={{ width: 240, flexShrink: 0, background: "#fff", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      {/* Logo */}
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src="/Group-1.svg" alt="Studio Mudiaga" width={130} height={21} style={{ objectFit: "contain" }} />
        </Link>
        <span style={{ background: "#eeedf8", color: "#1e156d", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 7px", borderRadius: 6 }}>Admin</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{ color: "#ccc", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px 8px" }}>Main</p>
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
                fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2,
                background: active ? NAVY_BG : "transparent",
                color: active ? NAVY : "#888",
              }}
              onMouseOver={(e) => { if (!active) { e.currentTarget.style.background = "#f8f8f8"; e.currentTarget.style.color = "#333"; } }}
              onMouseOut={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; } }}
            >
              <Icon size={15} style={{ flexShrink: 0, color: active ? NAVY : "#bbb" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: "12px", borderTop: "1px solid #f0f0f0", flexShrink: 0 }}>
        <Link href="/admin/settings" style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", fontSize: 13, color: "#888", marginBottom: 2 }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#f8f8f8"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Settings size={15} color="#bbb" />
          Settings
        </Link>
        <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 8 }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#f8f8f8"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <LogOut size={15} color="#bbb" />
          Logout
        </button>

        {/* User profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#fafaf9", border: "1px solid #f0f0f0" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: NAVY, fontSize: 12, fontWeight: 700 }}>{user?.email?.[0]?.toUpperCase()}</span>
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ color: "#0a0a0a", fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Admin</p>
            <p style={{ color: "#bbb", fontSize: 10, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Admin";
  const initial = displayName[0]?.toUpperCase() ?? "A";

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  const dropdownItems = [
    { label: "Profile",   icon: Users,       href: "/admin/profile" },
    { label: "Settings",  icon: Settings,    href: "/admin/settings" },
    { label: "Password",  icon: LogOut,      href: "/admin/password" },
  ];

  return (
    <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #ebebeb", display: "flex", alignItems: "center", padding: "0 32px", flexShrink: 0, gap: 20 }}>
      {/* Mobile menu */}
      <button onClick={onMenuClick} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", display: "flex", flexShrink: 0 }} className="mobile-menu-btn">
        <style>{`@media(min-width:1024px){.mobile-menu-btn{display:none!important}}`}</style>
        <Menu size={18} />
      </button>

      {/* Greeting */}
      <div style={{ flexShrink: 0 }}>
        <p style={{ color: "#0a0a0a", fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1 }}>Welcome back, {displayName}!</p>
        <p style={{ color: "#aaa", fontSize: 11, margin: "3px 0 0" }}>Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Search — centered */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 420, display: "flex", alignItems: "center", gap: 8, background: "#f7f7f5", border: "1px solid #ebebeb", borderRadius: 24, padding: "9px 16px" }}>
          <Search size={13} color="#ccc" />
          <input placeholder="Search shortlets, orders, users…" style={{ background: "none", border: "none", outline: "none", fontSize: 13, color: "#555", flex: 1 }} />
        </div>
      </div>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {/* Bell */}
        <button style={{ width: 36, height: 36, borderRadius: "50%", background: "none", border: "1px solid #ebebeb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Bell size={15} color="#888" />
        </button>

        {/* Avatar + dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #ebebeb", borderRadius: 24, padding: "4px 10px 4px 4px", cursor: "pointer" }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: NAVY_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: NAVY, fontSize: 12, fontWeight: 700 }}>{initial}</span>
            </div>
            <ChevronDown size={13} color="#aaa" style={{ transition: "transform 0.15s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setDropdownOpen(false)} />
              {/* Menu */}
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, background: "#fff", border: "1px solid #ebebeb", borderRadius: 14, padding: "6px", minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                {/* User info */}
                <div style={{ padding: "10px 12px 12px", borderBottom: "1px solid #f0f0f0", marginBottom: 4 }}>
                  <p style={{ color: "#0a0a0a", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{displayName}</p>
                  <p style={{ color: "#aaa", fontSize: 11, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                </div>
                {dropdownItems.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDropdownOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", color: "#555", fontSize: 13 }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#f7f7f5"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <Icon size={14} color="#bbb" />
                    {label}
                  </Link>
                ))}
                <div style={{ borderTop: "1px solid #f0f0f0", marginTop: 4, paddingTop: 4 }}>
                  <button
                    onClick={handleSignOut}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "none", border: "none", color: "#dc2626", fontSize: 13, cursor: "pointer", textAlign: "left" }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#fff5f5"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                  >
                    <LogOut size={14} color="#dc2626" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f7f5" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="lg-sidebar">
        <style>{`@media(min-width:1024px){.lg-sidebar{display:flex!important}}`}</style>
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <Sidebar onNav={() => setSidebarOpen(false)} />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#333", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
