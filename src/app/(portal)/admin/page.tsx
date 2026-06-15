"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingBag,
  Building2,
  Sofa,
  Users,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const card = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

const stats = [
  { label: "Total Bookings", value: "0", icon: CalendarDays, trend: "+0%" },
  { label: "Furniture Orders", value: "0", icon: ShoppingBag, trend: "+0%" },
  { label: "Active Shortlets", value: "6", icon: Building2, trend: "" },
  { label: "Registered Users", value: "0", icon: Users, trend: "+0%" },
];

const quickLinks = [
  { label: "Manage Shortlets", href: "/admin/shortlets", icon: Building2, desc: "Add, edit, or remove listings" },
  { label: "Manage Furniture", href: "/admin/furniture", icon: Sofa, desc: "Manage the furniture catalog" },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays, desc: "View and manage all bookings" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, desc: "Track furniture orders" },
  { label: "Users", href: "/admin/users", icon: Users, desc: "Manage registered accounts" },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp, desc: "Traffic and revenue insights" },
];

export default function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div>
      {/* Header */}
      <motion.div {...card(0)} className="flex items-start justify-between mb-10">
        <div>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
            <LayoutDashboard size={12} /> Admin Dashboard
          </p>
          <h1 className="font-playfair text-3xl text-white">Studio Mudiaga</h1>
          <p className="text-white/30 text-sm mt-1">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors mt-1"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div {...card(0.1)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={16} className="text-amber-400" />
              {trend && <span className="text-white/30 text-xs">{trend}</span>}
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Links */}
      <motion.div {...card(0.15)}>
        <h2 className="text-white font-semibold mb-4">Manage</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ label, href, icon: Icon, desc }, i) => (
            <motion.div key={label} {...card(0.15 + i * 0.05)}>
              <Link
                href={href}
                className="group block bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-white/20 transition-all duration-200"
              >
                <Icon size={18} className="text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-white font-medium text-sm mb-1">{label}</p>
                <p className="text-white/30 text-xs">{desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity placeholder */}
      <motion.div {...card(0.35)} className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-white/20 text-sm">No activity yet. Bookings and orders will appear here.</p>
        </div>
      </motion.div>
    </div>
  );
}
