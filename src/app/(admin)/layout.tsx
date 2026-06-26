"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Sofa,
  CalendarDays,
  ShoppingBag,
  Users,
  TrendingUp,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", exact: true, icon: LayoutDashboard },
  { label: "Shortlets", href: "/admin/shortlets", icon: Building2 },
  { label: "Furniture", href: "/admin/furniture", icon: Sofa },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
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
    <aside className="w-60 shrink-0 bg-zinc-950 border-r border-white/[0.06] flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/Group.svg"
            alt="Studio Mudiaga"
            width={20}
            height={20}
            className="invert opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div>
            <p className="text-white/80 text-xs font-semibold leading-none">Studio Mudiaga</p>
            <p className="text-amber-400 text-[9px] mt-0.5 font-semibold tracking-[0.15em] uppercase">
              Admin
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onNav}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150",
              isActive(href, exact)
                ? "bg-amber-400/10 text-amber-400 font-medium"
                : "text-white/35 hover:text-white/80 hover:bg-white/[0.04]"
            )}
          >
            <Icon size={14} className="shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
            <span className="text-amber-400 text-[10px] font-bold uppercase">
              {user?.email?.[0]}
            </span>
          </div>
          <p className="text-white/30 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.04] text-sm transition-colors"
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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:min-h-screen">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full">
            <Sidebar onNav={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden h-14 border-b border-white/[0.06] flex items-center justify-between px-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <p className="text-white/60 text-sm font-medium">Studio Mudiaga Admin</p>
          <div className="w-5" />
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
