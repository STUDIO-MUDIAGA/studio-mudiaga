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
} from "lucide-react";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
});

const stats = [
  { label: "Total Bookings", value: "0", icon: CalendarDays, trend: "" },
  { label: "Furniture Orders", value: "0", icon: ShoppingBag, trend: "" },
  { label: "Active Shortlets", value: "0", icon: Building2, trend: "" },
  { label: "Registered Users", value: "0", icon: Users, trend: "" },
];

const quickLinks = [
  { label: "Manage Shortlets", href: "/admin/shortlets", icon: Building2, desc: "Add, edit, or remove listings" },
  { label: "Manage Furniture", href: "/admin/furniture", icon: Sofa, desc: "Manage the furniture catalogue" },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarDays, desc: "View and manage all bookings" },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag, desc: "Track furniture orders" },
  { label: "Users", href: "/admin/users", icon: Users, desc: "Manage registered accounts" },
  { label: "Analytics", href: "/admin/analytics", icon: TrendingUp, desc: "Traffic and revenue insights" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <motion.div {...fade(0)} className="mb-10">
        <p className="text-amber-400 text-[10px] font-semibold uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
          <LayoutDashboard size={10} /> Overview
        </p>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-white/25 text-sm mt-1">Welcome back, {user?.email}</p>
      </motion.div>

      {/* Stats */}
      <motion.div {...fade(0.08)} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5"
          >
            <Icon size={15} className="text-amber-400 mb-4" />
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/30 text-xs mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick links */}
      <motion.div {...fade(0.14)}>
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Manage</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(({ label, href, icon: Icon, desc }, i) => (
            <motion.div key={label} {...fade(0.14 + i * 0.04)}>
              <Link
                href={href}
                className="group flex items-start gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0 group-hover:bg-amber-400/15 transition-colors">
                  <Icon size={14} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/80 font-medium text-sm group-hover:text-white transition-colors">{label}</p>
                  <p className="text-white/25 text-xs mt-0.5">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div {...fade(0.35)} className="mt-8 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
        <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-6">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-white/15 text-sm">No activity yet. Bookings and orders will appear here.</p>
        </div>
      </motion.div>
    </div>
  );
}
