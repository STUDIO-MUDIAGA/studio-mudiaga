"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Building2, Sofa, CalendarDays,
  ShoppingBag, Users, TrendingUp, LogOut, Menu, X,
  Settings, Bell, Search, ChevronDown, Tag, BarChart2, Plus, List,
  Images, Home, Armchair, Folder, MessageSquare, MessageCircle, LayoutGrid, Ticket,
} from "lucide-react";
import { useState, useEffect, useRef, createContext, useContext } from "react";

const NAVY = "#1e156d";
const NAVY_BG = "#eeedf8";
const MUDRES = "#2A3812";
const MUDRES_BG = "#EDF0E4";
const ABODE = "#c46442";
const ABODE_BG = "#f7ece7";

type SubItem = { label: string; href: string; icon: React.ElementType };
type NavItem = { label: string; href: string; exact?: boolean; icon: React.ElementType; children?: SubItem[] };

type Workspace = "all" | "mudres" | "abode";
const WORKSPACE_KEY = "admin_workspace";

const WORKSPACE_META: Record<Workspace, { label: string; badge: string; color: string; bg: string; landing?: string }> = {
  all:    { label: "Main",   badge: "Admin",        color: NAVY,   bg: NAVY_BG },
  mudres: { label: "MUDRES", badge: "MUDRES Admin", color: MUDRES, bg: MUDRES_BG, landing: "/admin/furniture" },
  abode:  { label: "ABODE",  badge: "ABODE Admin",  color: ABODE,  bg: ABODE_BG,  landing: "/admin/shortlets" },
};

/** Lets any page under /admin (e.g. the Dashboard) read the active
 *  workspace set by the switcher in the top bar, without prop-drilling
 *  through the layout. */
const WorkspaceContext = createContext<Workspace>("all");
export const useAdminWorkspace = () => useContext(WorkspaceContext);

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", exact: true, icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  {
    label: "Media", href: "/admin/media", icon: Images,
    children: [
      { label: "All Media",      href: "/admin/media",          icon: Images },
      { label: "Homepage Media", href: "/admin/media/homepage", icon: Home },
      { label: "MUDRES Media",   href: "/admin/media/mudres",   icon: Armchair },
      { label: "ABODE Media",    href: "/admin/media/abode",    icon: Building2 },
    ],
  },
  {
    label: "Projects", href: "/admin/projects", icon: Folder,
    children: [
      { label: "All Projects", href: "/admin/projects",     icon: List },
      { label: "Add Project",  href: "/admin/projects/new", icon: Plus },
    ],
  },
  {
    label: "Shortlets", href: "/admin/shortlets", icon: Building2,
    children: [
      { label: "All Apartments",      href: "/admin/shortlets",             icon: List },
      { label: "Add Apartment",       href: "/admin/shortlets/new",         icon: Plus },
      { label: "Apartment Metrics",   href: "/admin/shortlets/metrics",     icon: BarChart2 },
      { label: "Apartment Bookings",  href: "/admin/shortlets/bookings",    icon: CalendarDays },
      { label: "Categories",          href: "/admin/shortlets/categories",  icon: Tag },
      { label: "Coupons",             href: "/admin/shortlets/coupons",     icon: Ticket },
    ],
  },
  {
    label: "Furniture", href: "/admin/furniture", icon: Sofa,
    children: [
      { label: "All Items",    href: "/admin/furniture",             icon: List },
      { label: "Add Item",     href: "/admin/furniture/new",         icon: Plus },
      { label: "Orders",       href: "/admin/furniture/orders",      icon: ShoppingBag },
      { label: "Support",      href: "/admin/furniture/support",     icon: MessageCircle },
      { label: "Metrics",      href: "/admin/furniture/metrics",     icon: BarChart2 },
      { label: "Collections",  href: "/admin/furniture/collections", icon: Tag },
      { label: "Categories",   href: "/admin/furniture/categories",  icon: LayoutGrid },
      { label: "Coupons",      href: "/admin/furniture/coupons",     icon: Ticket },
    ],
  },
  { label: "Users",      href: "/admin/users",     icon: Users },
  { label: "Bookings",   href: "/admin/bookings",  icon: CalendarDays },
  { label: "Orders",     href: "/admin/orders",    icon: ShoppingBag },
  { label: "Analytics",  href: "/admin/analytics", icon: TrendingUp },
];

/** Trimmed nav for the MUDRES-only workspace: just what runs the furniture
 *  store, so someone managing that side doesn't wade through Abode/portfolio
 *  items that don't apply to them. */
function mudresNavItems(fullNav: NavItem[]): NavItem[] {
  const dashboard = fullNav.find((n) => n.href === "/admin");
  const furniture = fullNav.find((n) => n.href === "/admin/furniture");
  const users = fullNav.find((n) => n.href === "/admin/users");
  const items: NavItem[] = [];
  if (dashboard) items.push(dashboard);
  if (furniture) items.push(furniture);
  if (users) items.push(users);
  items.push({ label: "MUDRES Media", href: "/admin/media/mudres", icon: Armchair });
  return items;
}

/** Same idea for ABODE — just the shortlets side. */
function abodeNavItems(fullNav: NavItem[]): NavItem[] {
  const dashboard = fullNav.find((n) => n.href === "/admin");
  const shortlets = fullNav.find((n) => n.href === "/admin/shortlets");
  const items: NavItem[] = [];
  if (dashboard) items.push(dashboard);
  if (shortlets) items.push(shortlets);
  items.push({ label: "ABODE Media", href: "/admin/media/abode", icon: Building2 });
  return items;
}

function workspaceNavItems(fullNav: NavItem[], workspace: Workspace): NavItem[] {
  if (workspace === "mudres") return mudresNavItems(fullNav);
  if (workspace === "abode") return abodeNavItems(fullNav);
  return fullNav;
}

function Sidebar({ onNav, workspace }: { onNav?: () => void; workspace: Workspace }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [customMediaCategories, setCustomMediaCategories] = useState<SubItem[]>([]);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  const initialExpanded = Object.fromEntries(
    navItems.filter((n) => n.children).map((n) => [n.href, pathname.startsWith(n.href)])
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialExpanded);

  const toggleExpand = (href: string) => setExpanded((p) => ({ ...p, [href]: !p[href] }));

  useEffect(() => {
    const supabase = createClient();
    const loadCategories = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch("/api/admin/media-categories", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;
      const data: { name: string; slug: string }[] = await res.json();
      setCustomMediaCategories(
        data.map((c) => ({ label: c.name, href: `/admin/media/${c.slug}`, icon: Folder }))
      );
    };
    loadCategories();
    window.addEventListener("media-categories-updated", loadCategories);
    return () => window.removeEventListener("media-categories-updated", loadCategories);
  }, []);

  const visibleNavItems = workspaceNavItems(navItems, workspace);
  const meta = WORKSPACE_META[workspace];

  return (
    <aside style={{ width: 240, flexShrink: 0, background: "#fff", borderRight: "1px solid #ebebeb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      {/* Logo */}
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src="/Group-1.svg" alt="Studio Mudiaga" width={130} height={21} style={{ objectFit: "contain" }} />
        </Link>
        <span style={{ background: meta.bg, color: meta.color, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 7px", borderRadius: 6, whiteSpace: "nowrap" }}>
          {meta.badge}
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{ color: "#ccc", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px 8px" }}>Main</p>
        {visibleNavItems.map(({ label, href, icon: Icon, exact, children }) => {
          const active = isActive(href, exact);
          const isOpen = !!expanded[href];
          const effectiveChildren = href === "/admin/media" && children
            ? [...children, ...customMediaCategories]
            : children;

          if (effectiveChildren) {
            return (
              <div key={href} style={{ marginBottom: 2 }}>
                <button
                  onClick={() => toggleExpand(href)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: active ? NAVY_BG : "transparent", color: active ? NAVY : "#888", fontSize: 13, fontWeight: active ? 600 : 400, border: "none", cursor: "pointer", textAlign: "left" }}
                  onMouseOver={(e) => { if (!active) { e.currentTarget.style.background = "#f0f0f2"; e.currentTarget.style.color = "#333"; } }}
                  onMouseOut={(e) => { if (!active) { e.currentTarget.style.background = active ? NAVY_BG : "transparent"; e.currentTarget.style.color = active ? NAVY : "#888"; } }}
                >
                  <Icon size={15} style={{ flexShrink: 0, color: active ? NAVY : "#bbb" }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  <ChevronDown size={13} color="#ccc" style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }} />
                </button>
                {isOpen && (
                  <div style={{ marginLeft: 14, marginTop: 2, paddingLeft: 14, borderLeft: "1px solid #f0f0f0" }}>
                    {effectiveChildren.map(({ label: cl, href: ch, icon: CIcon }) => {
                      const childActive = pathname === ch;
                      return (
                        <Link
                          key={ch}
                          href={ch}
                          onClick={onNav}
                          style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 8, textDecoration: "none", fontSize: 12, fontWeight: childActive ? 600 : 400, marginBottom: 1, background: childActive ? NAVY_BG : "transparent", color: childActive ? NAVY : "#999" }}
                          onMouseOver={(e) => { if (!childActive) { e.currentTarget.style.background = "#f0f0f2"; e.currentTarget.style.color = "#333"; } }}
                          onMouseOut={(e) => { if (!childActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#999"; } }}
                        >
                          <CIcon size={13} style={{ flexShrink: 0, color: childActive ? NAVY : "#ccc" }} />
                          {cl}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={onNav}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2, background: active ? NAVY_BG : "transparent", color: active ? NAVY : "#888" }}
              onMouseOver={(e) => { if (!active) { e.currentTarget.style.background = "#f0f0f2"; e.currentTarget.style.color = "#333"; } }}
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
          onMouseOver={(e) => { e.currentTarget.style.background = "#f0f0f2"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <Settings size={15} color="#bbb" />
          Settings
        </Link>
        <button onClick={handleSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", textAlign: "left", marginBottom: 8 }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#f0f0f2"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <LogOut size={15} color="#bbb" />
          Logout
        </button>

        {/* User profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#f2f2f4", border: "1px solid #f0f0f0" }}>
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

function WorkspaceSwitcher({ workspace, onWorkspaceChange }: { workspace: Workspace; onWorkspaceChange: (w: Workspace) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const meta = WORKSPACE_META[workspace];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{ display: "flex", alignItems: "center", gap: 6, background: meta.bg, border: "1px solid transparent", borderRadius: 24, padding: "6px 12px", cursor: "pointer" }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color, flexShrink: 0 }} />
        <span style={{ color: meta.color, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>{meta.badge}</span>
        <ChevronDown size={13} color={meta.color} style={{ transition: "transform 0.15s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 50, background: "#fff", border: "1px solid #ebebeb", borderRadius: 14, padding: "6px", minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
            {(Object.keys(WORKSPACE_META) as Workspace[]).map((w) => {
              const wMeta = WORKSPACE_META[w];
              const active = workspace === w;
              return (
                <button
                  key={w}
                  onClick={() => {
                    onWorkspaceChange(w);
                    setOpen(false);
                    if (wMeta.landing) router.push(wMeta.landing);
                  }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
                    background: active ? wMeta.bg : "transparent", border: "none", cursor: "pointer", textAlign: "left",
                    color: active ? wMeta.color : "#555", fontSize: 13, fontWeight: active ? 600 : 400, fontFamily: "inherit",
                  }}
                  onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "#f2f2f4"; }}
                  onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: wMeta.color, flexShrink: 0 }} />
                  {wMeta.badge}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

type SearchResult = { type: string; id: string; title: string; subtitle: string; href: string };

const RESULT_ICON: Record<string, React.ElementType> = {
  Furniture: Sofa,
  Shortlet: Building2,
  Project: Folder,
  Enquiry: MessageSquare,
};

function AdminSearchModal({ workspace, onClose }: { workspace: Workspace; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = WORKSPACE_META[workspace];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}&scope=${workspace}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await res.json().catch(() => ({ results: [] }));
      setResults(body.results ?? []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(handle);
  }, [query, workspace]);

  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) (grouped[r.type] ??= []).push(r);

  const trimmed = query.trim();

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "center", paddingTop: "12vh" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.4)" }} onClick={onClose} />
      <div style={{ position: "relative", width: "100%", maxWidth: 560, height: "fit-content", background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #f0f0f0" }}>
          <Search size={16} color="#aaa" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={workspace === "all" ? "Search everything…" : `Search ${meta.label}…`}
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", fontSize: 15, color: "#111", background: "none", fontFamily: "inherit" }}
          />
          <span style={{ background: meta.bg, color: meta.color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0 }}>
            {meta.label}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", display: "flex", flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto", padding: results.length ? "8px 0" : 0 }}>
          {loading && <p style={{ padding: "20px 18px", color: "#aaa", fontSize: 13, margin: 0 }}>Searching…</p>}

          {!loading && trimmed.length < 2 && (
            <p style={{ padding: "20px 18px", color: "#ccc", fontSize: 13, margin: 0 }}>Type at least 2 characters…</p>
          )}

          {!loading && trimmed.length >= 2 && results.length === 0 && (
            <p style={{ padding: "20px 18px", color: "#aaa", fontSize: 13, margin: 0 }}>No results for &ldquo;{trimmed}&rdquo;.</p>
          )}

          {!loading && Object.entries(grouped).map(([type, items]) => (
            <div key={type} style={{ marginBottom: 4 }}>
              <p style={{ color: "#bbb", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "8px 16px 4px" }}>{type}</p>
              {items.map((r) => {
                const Icon = RESULT_ICON[r.type] ?? Search;
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => { router.push(r.href); onClose(); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
                    onMouseOver={(e) => { e.currentTarget.style.background = "#f7f7f8"; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = "none"; }}
                  >
                    <Icon size={15} color="#999" style={{ flexShrink: 0 }} />
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span style={{ display: "block", color: "#111", fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                      {r.subtitle && (
                        <span style={{ display: "block", color: "#aaa", fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subtitle}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Topbar({ onMenuClick, workspace, onWorkspaceChange }: { onMenuClick: () => void; workspace: Workspace; onWorkspaceChange: (w: Workspace) => void }) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Admin";
  const initial = displayName[0]?.toUpperCase() ?? "A";

  // Cmd/Ctrl+K opens search from anywhere in the admin.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
        <button
          onClick={() => setSearchOpen(true)}
          style={{ width: "100%", maxWidth: 320, display: "flex", alignItems: "center", gap: 8, background: "#f2f2f4", border: "1px solid #ebebeb", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontFamily: "inherit" }}
        >
          <Search size={12} color="#ccc" />
          <span style={{ fontSize: 12, color: "#aaa", flex: 1, textAlign: "left" }}>Search…</span>
          <span style={{ fontSize: 10, color: "#ccc", border: "1px solid #e5e5e5", borderRadius: 5, padding: "1px 5px" }}>⌘K</span>
        </button>
      </div>

      {searchOpen && <AdminSearchModal workspace={workspace} onClose={() => setSearchOpen(false)} />}

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <WorkspaceSwitcher workspace={workspace} onWorkspaceChange={onWorkspaceChange} />

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
                    onMouseOver={(e) => { e.currentTarget.style.background = "#f2f2f4"; }}
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

// Pages that manage their own full-height layout (e.g. a chat inbox with its
// own internal scroll region) instead of the default padded, page-scrolls page.
const FULL_BLEED_PATHS = ["/admin/furniture/support"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>("all");
  const pathname = usePathname();
  const fullBleed = FULL_BLEED_PATHS.includes(pathname);

  useEffect(() => {
    const stored = localStorage.getItem(WORKSPACE_KEY);
    if (stored === "mudres" || stored === "abode" || stored === "all") setWorkspace(stored);
  }, []);

  const handleWorkspaceChange = (w: Workspace) => {
    setWorkspace(w);
    localStorage.setItem(WORKSPACE_KEY, w);
  };

  return (
    <WorkspaceContext.Provider value={workspace}>
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f2f2f4", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="lg-sidebar no-print">
        <style>{`@media(min-width:1024px){.lg-sidebar{display:flex!important}} @media print{.no-print{display:none!important}}`}</style>
        <Sidebar workspace={workspace} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="no-print" style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "relative", zIndex: 10 }}>
            <Sidebar onNav={() => setSidebarOpen(false)} workspace={workspace} />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "#333", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} workspace={workspace} onWorkspaceChange={handleWorkspaceChange} />
        </div>
        <main style={fullBleed ? { flex: 1, minHeight: 0, overflow: "hidden" } : { flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
    </WorkspaceContext.Provider>
  );
}
