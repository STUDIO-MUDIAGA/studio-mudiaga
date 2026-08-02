"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ImagePlus, Plus, Minus } from "lucide-react";
import { useNavTheme } from "@/context/NavTheme";

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Research",
    body: "Every great space begins with deep listening. We take time to understand your lifestyle, cultural references, and aspirations through conversations, site visits, and contextual studies, building a foundation that ensures every design decision is rooted in who you are.",
  },
  {
    n: "02",
    title: "Plan",
    body: "We translate that understanding into a clear scope, timeline, and budget, so every decision from here on is made with the full picture in view.",
  },
  {
    n: "03",
    title: "Design",
    body: "Concepts, materials, and furnishings come together into a considered design language, refined with you until every detail feels right.",
  },
  {
    n: "04",
    title: "Realize",
    body: "We oversee build and installation end to end, handcrafting furniture where needed, so the finished space matches the vision exactly.",
  },
];

export default function AboutPage() {
  const { setTheme } = useNavTheme();
  const [openStep, setOpenStep] = useState(0);

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
              style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(48px, 8vw, 120px)" }}
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
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Meet the Studio
          </p>
          <div className="max-w-2xl flex flex-col gap-6">
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.85 }}
            >
              Studio Mudiaga is a contemporary African design brand that transforms both
              personal and professional spaces, blending minimalism, culture, and soul into
              environments that function beautifully and feel unforgettable.
            </p>
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.85 }}
            >
              Founded by Mudiaga, the brand emerged from a personal journey of longing for
              spaces that reflect clarity, identity, and intention.
            </p>
            <p
              className="text-black/70"
              style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.85 }}
            >
              Today, that vision carries through every project we take on — from Abode's
              considered interiors to bespoke, one-off commissions like Project UB — each
              one shaped by the same quiet, deliberate hand.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy / Process */}
      <section className="border-t border-black/10" style={{ padding: "clamp(64px, 8vw, 120px) 48px" }}>
        <div className="grid gap-10 md:grid-cols-[auto_1fr]" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-black/40 whitespace-nowrap"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            How We Work
          </p>
          <div className="max-w-2xl">
            <h2
              className="font-light text-black mb-10"
              style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.25 }}
            >
              Intentional steps. Cultural clarity. Seamless delivery.
            </h2>
            <div className="border-t border-black/10">
              {PROCESS_STEPS.map((step, i) => {
                const isOpen = openStep === i;
                return (
                  <div key={step.n} className="border-b border-black/10">
                    <button
                      onClick={() => setOpenStep(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="text-black/40 text-xs" style={{ fontFamily: "var(--font-inter)" }}>
                          {step.n}
                        </span>
                        <span className="text-black" style={{ fontFamily: "var(--font-inter)", fontSize: 22, fontWeight: 400 }}>
                          {step.title}
                        </span>
                      </span>
                      {isOpen ? (
                        <Minus size={16} className="text-black/50 shrink-0" />
                      ) : (
                        <Plus size={16} className="text-black/50 shrink-0" />
                      )}
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="text-black/60 pb-6" style={{ fontFamily: "var(--font-inter)", fontSize: 14, lineHeight: 1.8, maxWidth: 560 }}>
                        {step.body}
                      </p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-black/10" style={{ padding: "clamp(64px, 8vw, 120px) 48px" }}>
        <div className="grid gap-14 md:grid-cols-2 items-center" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="relative w-full aspect-[4/5] overflow-hidden bg-black/5 border border-dashed border-black/15 flex flex-col items-center justify-center gap-3">
            <ImagePlus size={22} className="text-black/25" />
            <p className="text-black/35 text-xs text-center px-8" style={{ fontFamily: "var(--font-inter)" }}>
              Placeholder — add a portrait of Mudiaga here
            </p>
          </div>
          <div>
            <p
              className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-5"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              The Founder
            </p>
            <h2
              className="font-light text-black mb-8"
              style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.2 }}
            >
              Mudiaga
            </h2>
            <div className="flex flex-col gap-6">
              <p className="text-black/70" style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.85 }}>
                [Placeholder — replace with the founder&apos;s real bio. A few sentences on
                background, design perspective, and what led to starting the studio tend to
                work well here.]
              </p>
              <p className="text-black/40 text-sm italic" style={{ fontFamily: "var(--font-inter)" }}>
                This section is a placeholder — swap in the real bio and photo before publishing.
              </p>
            </div>
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
            style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px, 3.2vw, 44px)", maxWidth: 560 }}
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
