"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { furnitureItems } from "@/data/furniture";

const featured = furnitureItems.filter((f) => f.featured).slice(0, 4);

function FurnitureCard({ item, index }: { item: (typeof furnitureItems)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={`/furniture/${item.id}`} className="group block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/3 mb-4">
          <Image
            src={item.images[0]}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white/60 text-sm">Out of Stock</span>
            </div>
          )}
          {item.originalPrice && (
            <div className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full">
              Sale
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
            <div className="bg-white text-black rounded-full p-3">
              <ShoppingBag size={16} />
            </div>
          </div>
        </div>

        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{item.category}</p>
        <h3 className="text-white font-semibold mb-2 group-hover:text-amber-400 transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">₦{item.price.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="text-white/30 text-sm line-through">
              ₦{item.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedFurniture() {
  return (
    <section className="py-24 px-6 bg-white/2">
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
              Furniture
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              Crafted to last
            </h2>
          </div>
          <div>
            <Link
              href="/furniture"
              className="hidden md:flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors group"
            >
              View collection
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((item, i) => (
            <FurnitureCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
