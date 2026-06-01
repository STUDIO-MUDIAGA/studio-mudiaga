"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    if (!headingRef.current) return;

    const split = new SplitText(headingRef.current, { type: "chars,words" });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      split.chars,
      { opacity: 0, y: 60, rotateX: -40 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.025,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    return () => {
      split.revert();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        ref={bgRef}
        style={{ y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
      </motion.div>

      {/* Floating orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-400/5 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-600/8 blur-3xl"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white/60 mb-8"
        >
          <MapPin size={13} className="text-amber-400" />
          Lagos · Abuja · Port Harcourt
        </motion.div>

        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-8 perspective-[800px]"
          style={{ perspective: "800px" }}
        >
          <span className="block text-white">Curated</span>
          <span className="block text-gradient">Living.</span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Premium shortlet apartments and handcrafted furniture — designed for the way you live.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/shortlets"
            className="group flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105"
          >
            Book a Shortlet
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/furniture"
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-4 rounded-full text-sm transition-all duration-300"
          >
            Shop Furniture
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
