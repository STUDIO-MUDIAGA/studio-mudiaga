"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavTheme } from "@/context/NavTheme";

export default function AboutPage() {
  const { setTheme } = useNavTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-screen min-h-[560px] w-full overflow-hidden">
        <Image
          src="/IMG_1672.JPG"
          alt="Studio Mudiaga"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        <div className="absolute inset-0 flex items-end">
          <div
            className="w-full"
            style={{ maxWidth: 1200, margin: "0 auto", paddingLeft: 48, paddingRight: 48, paddingBottom: 80 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white/55 text-xs tracking-[0.3em] uppercase mb-5"
            >
              About
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white font-light leading-[1.05]"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(48px, 8vw, 120px)" }}
            >
              Studio Mudiaga
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(64px, 8vw, 120px) 48px" }}>
        <div className="grid gap-10 md:grid-cols-[auto_1fr]">
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-black/40 whitespace-nowrap"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Meet the Studio
          </p>
          <div className="max-w-2xl flex flex-col gap-6">
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 16, lineHeight: 1.85 }}
            >
              Studio Mudiaga is a contemporary African design brand that transforms both
              personal and professional spaces, blending minimalism, culture, and soul into
              environments that function beautifully and feel unforgettable.
            </p>
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 16, lineHeight: 1.85 }}
            >
              Founded by Mudiaga, the brand emerged from a personal journey of longing for
              spaces that reflect clarity, identity, and intention.
            </p>
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 16, lineHeight: 1.85 }}
            >
              Today, that vision carries through every project we take on — from Abode's
              considered interiors to bespoke, one-off commissions like Project UB — each
              one shaped by the same quiet, deliberate hand.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/10">
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(56px, 7vw, 96px) 48px" }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <h3
            className="font-light text-black"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 3.2vw, 44px)", maxWidth: 560 }}
          >
            See the work behind the studio.
          </h3>
          <Link
            href="/projects/abode"
            className="group inline-flex items-center gap-3 text-black text-sm font-medium shrink-0"
          >
            <span className="w-11 h-11 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black/5 transition-colors duration-200">
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
            View Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
