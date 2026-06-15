"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { furnitureItems } from "@/data/furniture";

const categories = ["All", "Seating", "Tables", "Bedroom", "Lighting", "Storage", "Decor"];

export default function FurniturePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = furnitureItems.filter((f) => {
    const catMatch = selectedCategory === "All" || f.category === selectedCategory;
    const searchMatch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
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
            Furniture
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-5xl font-bold mb-4"
          >
            The Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-xl"
          >
            Thoughtfully designed pieces for considered living. Each item crafted to bring character and comfort.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-5 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-amber-400/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-black shadow-[0_0_14px_1px_#fbbf2435]"
                    : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <Link href={`/furniture/${item.id}`} className="group block">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/3 mb-3">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white/60 text-xs">Out of Stock</span>
                    </div>
                  )}
                  {item.originalPrice && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">
                      Sale
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
                    <div className="bg-white text-black rounded-full p-2.5 shadow-xl">
                      <ShoppingBag size={14} />
                    </div>
                  </div>
                </div>
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">{item.category}</p>
                <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">₦{item.price.toLocaleString()}</span>
                  {item.originalPrice && (
                    <span className="text-white/30 text-xs line-through">
                      ₦{item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/30 text-lg">No items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
