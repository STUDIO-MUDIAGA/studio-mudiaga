"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const STEPS = [
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

export default function ProcessSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-white" style={{ padding: "clamp(64px, 8vw, 120px) 48px" }}>
      <div
        className="grid gap-x-12 gap-y-16 md:grid-cols-2"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Left column */}
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-5"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Our Process
          </p>
          <h2
            className="font-light text-black mb-10"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(28px, 3.4vw, 48px)",
              lineHeight: 1.2,
              maxWidth: 480,
            }}
          >
            Intentional steps. Cultural clarity. Seamless delivery.
          </h2>
          <p
            className="text-black/60 mb-16"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, lineHeight: 1.85, maxWidth: 380 }}
          >
            We manage every detail, coordinate every decision, and keep your
            vision at the center of every stage, on time, on budget, and
            beyond expectation.
          </p>

          <div className="border-t border-black/10">
            {STEPS.map((step, i) => {
              const isOpen = open === i;
              return (
                <div key={step.n} className="border-b border-black/10">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span
                        className="text-black/40 text-xs"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {step.n}
                      </span>
                      <span
                        className="text-black"
                        style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 400 }}
                      >
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
                    <p
                      className="text-black/60 pb-6"
                      style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, lineHeight: 1.8, maxWidth: 460 }}
                    >
                      {step.body}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile — simple stacked images instead of the absolute-positioned desktop collage */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/IMG_1656.JPG"
              alt="Studio Mudiaga interior"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src="/IMG_1665.JPG"
              alt="Studio Mudiaga detail"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>

        {/* Right column — layered image collage (desktop only) */}
        <div className="relative hidden md:block" style={{ minHeight: 560 }}>
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group absolute top-0 right-0 overflow-hidden"
            style={{ width: "78%", height: "62%" }}
          >
            <Image
              src="/IMG_1656.JPG"
              alt="Studio Mudiaga interior"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="40vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="group absolute overflow-hidden shadow-xl"
            style={{ left: 0, bottom: 0, width: "56%", height: "56%" }}
          >
            <Image
              src="/IMG_1665.JPG"
              alt="Studio Mudiaga detail"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="30vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
