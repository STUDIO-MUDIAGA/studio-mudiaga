"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star, MapPin, Users, BedDouble, Bath, Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Shortlet } from "@/types";

export default function ShortletDetailClient({ shortlet }: { shortlet: Shortlet }) {
  const [activeImage, setActiveImage] = useState(0);
  const [guests, setGuests] = useState(1);

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/shortlets"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to shortlets
        </Link>

        {/* Image gallery */}
        <div className="grid grid-cols-4 gap-2 rounded-3xl overflow-hidden mb-10 h-[400px]">
          <div className="col-span-2 relative cursor-pointer">
            <Image
              src={shortlet.images[activeImage]}
              alt={shortlet.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="col-span-2 grid grid-rows-2 gap-2">
            {shortlet.images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="relative cursor-pointer"
                onClick={() => setActiveImage(i + 1)}
              >
                <Image src={img} alt="" fill className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Details */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-white text-3xl font-bold mb-2">{shortlet.title}</h1>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <MapPin size={14} />
                  <span>{shortlet.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-white/5 rounded-full px-3 py-2">
                <Star size={14} fill="#fbbf24" className="text-amber-400" />
                <span className="text-white font-semibold text-sm">{shortlet.rating}</span>
                <span className="text-white/40 text-sm">({shortlet.reviewCount})</span>
              </div>
            </div>

            <div className="flex gap-6 mb-8 py-6 border-y border-white/5">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <BedDouble size={16} className="text-amber-400" />
                {shortlet.bedrooms} bedrooms
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Bath size={16} className="text-amber-400" />
                {shortlet.bathrooms} bathrooms
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Users size={16} className="text-amber-400" />
                Up to {shortlet.guests} guests
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-white font-semibold text-lg mb-4">About this space</h2>
              <p className="text-white/50 leading-relaxed">
                Experience premium living in this stunning {shortlet.title.toLowerCase()} located in {shortlet.location}.
                Perfect for both business and leisure travellers, this space offers all the comforts of home with
                curated design touches that make every stay memorable.
              </p>
            </div>

            <div>
              <h2 className="text-white font-semibold text-lg mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {shortlet.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-3 text-white/60 text-sm">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <div className="mb-6">
                <span className="text-white text-2xl font-bold">
                  ₦{shortlet.price.toLocaleString()}
                </span>
                <span className="text-white/40"> / night</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Check-in</p>
                    <input
                      type="date"
                      className="bg-transparent text-white text-sm w-full focus:outline-none"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-white/40 text-xs mb-1">Check-out</p>
                    <input
                      type="date"
                      className="bg-transparent text-white text-sm w-full focus:outline-none"
                    />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white/40 text-xs mb-1">Guests</p>
                    <span className="text-white text-sm">{guests} guest{guests > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGuests((g) => Math.min(shortlet.guests, g + 1))}
                      className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                disabled={!shortlet.available}
                className="w-full bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300 text-black font-semibold py-4 rounded-full text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {shortlet.available ? "Reserve" : "Unavailable"}
              </button>

              <p className="text-white/25 text-xs text-center mt-3">
                You won&#39;t be charged yet
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={shortlet.host.avatar}
                    alt={shortlet.host.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{shortlet.host.name}</p>
                  {shortlet.host.superhost && (
                    <p className="text-amber-400 text-xs">Superhost</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
