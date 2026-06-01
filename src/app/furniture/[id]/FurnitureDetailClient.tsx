"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingBag, Heart, Ruler } from "lucide-react";
import { FurnitureItem } from "@/types";
import { cn } from "@/lib/utils";

export default function FurnitureDetailClient({ item }: { item: FurnitureItem }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(item.colors[0]);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/furniture"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4">
              <Image
                src={item.images[activeImage]}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex gap-3">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      activeImage === i ? "border-amber-400" : "border-white/10"
                    )}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              {item.category}
            </p>
            <h1 className="text-white text-4xl font-bold mb-4">{item.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-white text-3xl font-bold">₦{item.price.toLocaleString()}</span>
              {item.originalPrice && (
                <span className="text-white/30 text-xl line-through">
                  ₦{item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-white/50 leading-relaxed mb-8">{item.description}</p>

            {/* Colors */}
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-3">
                Color: <span className="text-white font-medium">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {item.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-medium border transition-all",
                      selectedColor === color
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
                        : "border-white/10 text-white/50 hover:border-white/30"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white/3 border border-white/5 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                <Ruler size={12} />
                <span className="uppercase tracking-wider">Dimensions (cm)</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  ["W", item.dimensions.width],
                  ["H", item.dimensions.height],
                  ["D", item.dimensions.depth],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-white text-lg font-semibold">{val}</p>
                    <p className="text-white/30 text-xs">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>

              <button
                disabled={!item.inStock}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-400 text-black font-bold py-3.5 rounded-full text-sm transition-all duration-200 active:scale-[0.97] shadow-[0_0_20px_2px_#fbbf2440] hover:shadow-[0_0_28px_5px_#fbbf2455]"
              >
                <ShoppingBag size={15} />
                {item.inStock ? "Add to Cart" : "Out of Stock"}
              </button>

              <button
                onClick={() => setLiked((v) => !v)}
                className="w-12 h-12 inline-flex items-center justify-center rounded-full border border-white/12 hover:border-white/25 hover:bg-white/5 transition-all duration-200 active:scale-[0.97]"
              >
                <Heart
                  size={18}
                  className={liked ? "fill-red-400 text-red-400" : "text-white/40"}
                />
              </button>
            </div>

            <p className="text-white/20 text-xs mt-4">Material: {item.material}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
