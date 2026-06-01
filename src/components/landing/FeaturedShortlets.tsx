"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { shortlets } from "@/data/shortlets";

const featured = shortlets.slice(0, 3);

function ShortletCard({ item, index }: { item: (typeof shortlets)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
    >
      <Link href={`/shortlets/${item.id}`} className="group block">
        <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {item.host.superhost && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
              Superhost
            </div>
          )}
          {!item.available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white/70 text-sm font-medium">Unavailable</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between mb-1">
          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-amber-400 transition-colors line-clamp-1 flex-1 pr-2">
            {item.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} fill="#fbbf24" className="text-amber-400" />
            <span className="text-white/60 text-xs">{item.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/40 text-sm mb-3">
          <MapPin size={12} />
          <span>{item.location}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold">
              ₦{item.price.toLocaleString()}
            </span>
            <span className="text-white/40 text-sm"> / night</span>
          </div>
          <span className="text-white/30 text-xs">
            {item.bedrooms} bed · {item.guests} guests
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedShortlets() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Shortlets
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              Handpicked spaces
            </h2>
          </div>
          <Link
            href="/shortlets"
            className="hidden md:flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
          >
            See all
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <ShortletCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
