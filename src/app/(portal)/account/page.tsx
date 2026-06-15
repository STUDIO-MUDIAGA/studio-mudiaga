"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CalendarDays, ShoppingBag, MapPin, Package } from "lucide-react";

const card = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 },
});

export default function AccountPage() {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div>
      {/* Greeting */}
      <motion.div {...card(0)} className="mb-10">
        <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-1">My Account</p>
        <h1 className="font-playfair text-3xl md:text-4xl text-white">Hello, {displayName}</h1>
        <p className="text-white/40 mt-2 text-sm">{user?.email}</p>
      </motion.div>

      {/* Stats row */}
      <motion.div {...card(0.1)} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Bookings", value: "0", icon: CalendarDays },
          { label: "Orders", value: "0", icon: ShoppingBag },
          { label: "Shortlets viewed", value: "0", icon: MapPin },
          { label: "Items in cart", value: "0", icon: Package },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <Icon size={18} className="text-amber-400 mb-3" />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-white/40 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bookings */}
        <motion.div {...card(0.15)} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <CalendarDays size={16} className="text-amber-400" /> Shortlet Bookings
            </h2>
            <Link href="/shortlets" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
              Browse
            </Link>
          </div>
          <div className="text-center py-10">
            <p className="text-white/20 text-sm">No bookings yet</p>
            <Link
              href="/shortlets"
              className="mt-4 inline-block text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full px-4 py-2 hover:bg-amber-400/20 transition-colors"
            >
              Explore shortlets
            </Link>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div {...card(0.2)} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <ShoppingBag size={16} className="text-amber-400" /> Furniture Orders
            </h2>
            <Link href="/furniture" className="text-amber-400 text-xs hover:text-amber-300 transition-colors">
              Shop
            </Link>
          </div>
          <div className="text-center py-10">
            <p className="text-white/20 text-sm">No orders yet</p>
            <Link
              href="/furniture"
              className="mt-4 inline-block text-xs bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full px-4 py-2 hover:bg-amber-400/20 transition-colors"
            >
              Shop the collection
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Profile card */}
      <motion.div {...card(0.25)} className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-white/30 text-xs mb-1">Full name</p>
            <p className="text-white text-sm">{profile?.full_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">Email</p>
            <p className="text-white text-sm">{user?.email}</p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">Account type</p>
            <p className="text-white text-sm capitalize">{profile?.role ?? "customer"}</p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">Member since</p>
            <p className="text-white text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-NG", { month: "long", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
