"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SplitCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-5">
        {/* Shortlets CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Shortlets
            </p>
            <h3 className="text-white text-2xl font-bold mb-4">
              Your home away from home
            </h3>
            <Link
              href="/shortlets"
              className="inline-flex items-center gap-2 text-white text-sm font-medium group/link"
            >
              Browse apartments
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>

        {/* Furniture CTA */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="group relative overflow-hidden rounded-3xl h-80 cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Furniture
            </p>
            <h3 className="text-white text-2xl font-bold mb-4">
              Elevate every space
            </h3>
            <Link
              href="/furniture"
              className="inline-flex items-center gap-2 text-white text-sm font-medium group/link"
            >
              Shop the collection
              <ArrowRight
                size={14}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
