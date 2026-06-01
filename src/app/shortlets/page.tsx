"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { shortlets } from "@/data/shortlets";

const cities = ["All", "Lagos", "Abuja"];

export default function ShortletsPage() {
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = shortlets.filter((s) => {
    const cityMatch = selectedCity === "All" || s.city === selectedCity;
    const searchMatch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return cityMatch && searchMatch;
  });

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2"
          >
            Shortlets
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold mb-4"
          >
            Find your perfect stay
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl"
          >
            Hand-verified apartments across Lagos and Abuja. Book by the night, week, or month.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-5 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedCity === city
                    ? "bg-amber-400 text-black"
                    : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <Link href={`/shortlets/${item.id}`} className="group block">
                <div className="relative h-60 rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  {item.host.superhost && (
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Superhost
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                      <span className="text-white/60 text-sm">Unavailable</span>
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-white font-semibold leading-snug group-hover:text-amber-400 transition-colors line-clamp-1 flex-1 pr-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star size={12} fill="#fbbf24" className="text-amber-400" />
                    <span className="text-white/60 text-xs">{item.rating}</span>
                    <span className="text-white/30 text-xs">({item.reviewCount})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-white/40 text-sm mb-3">
                  <MapPin size={12} />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">₦{item.price.toLocaleString()}</span>
                    <span className="text-white/40 text-sm"> / night</span>
                  </div>
                  <span className="text-white/30 text-xs">
                    {item.bedrooms}bd · {item.bathrooms}ba · {item.guests} guests
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg">No results found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
