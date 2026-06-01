"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const WORDS = ["Curated", "Living."];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 80]);
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Parallax background — single image, no blur filters */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 will-change-transform">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=75')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/65 via-[#0a0a0a]/45 to-[#0a0a0a]" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        {/* Location pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 mb-8"
        >
          <MapPin size={13} className="text-amber-400" />
          Lagos · Abuja · Port Harcourt
        </motion.div>

        {/* Headline — staggered word reveal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 overflow-hidden">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              className={`block ${i === 1 ? "text-gradient" : "text-white"}`}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.25 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Premium shortlet apartments and handcrafted furniture — designed for the way you live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shortlets"
            className="group inline-flex items-center gap-2.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.97] text-black font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-200 shadow-[0_0_24px_2px_#fbbf2440] hover:shadow-[0_0_32px_6px_#fbbf2455]"
          >
            Book a Shortlet
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <Link
            href="/furniture"
            className="group inline-flex items-center gap-2.5 bg-white/6 hover:bg-white/10 active:scale-[0.97] border border-white/12 hover:border-white/22 text-white font-medium px-8 py-3.5 rounded-full text-sm transition-all duration-200 backdrop-blur-sm"
          >
            Shop Furniture
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-[pulse_2s_ease-in-out_infinite]" />
      </motion.div>
    </section>
  );
}
