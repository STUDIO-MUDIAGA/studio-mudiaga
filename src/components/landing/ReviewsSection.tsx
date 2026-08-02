"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { REVIEWS } from "@/data/reviews";

export default function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const review = REVIEWS[index];

  const go = (dir: 1 | -1) => {
    setIndex((prev) => (prev + dir + REVIEWS.length) % REVIEWS.length);
  };

  return (
    <section className="bg-[#f6f5f3]" style={{ padding: "clamp(64px, 8vw, 120px) clamp(20px, 5vw, 48px)" }}>
      <div
        className="grid gap-x-12 gap-y-16 md:grid-cols-[1fr_auto_1fr] items-center"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Left column */}
        <div>
          <p
            className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-5"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Reviews
          </p>
          <h2
            className="font-medium text-black mb-16"
            style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.2 }}
          >
            Personal spaces.
            <br />
            Shared experiences.
          </h2>
          <Link href="/reviews" className="inline-flex items-center gap-2 text-black text-sm">
            <span className="underline underline-offset-4">Read all reviews</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Center image */}
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] tracking-[0.15em] uppercase text-black/40 whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "var(--font-inter)" }}
          >
            {review.name}
          </span>
          <div className="relative overflow-hidden" style={{ width: "clamp(160px, 22vw, 320px)", aspectRatio: "3 / 4" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={review.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image src={review.image} alt={review.name} fill className="object-cover" sizes="30vw" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right column — quote */}
        <div>
          <p
            className="text-black font-bold italic mb-6"
            style={{ fontFamily: "var(--font-inter)", fontSize: 48, lineHeight: 1 }}
          >
            &rdquo;
          </p>

          <div className="relative" style={{ minHeight: 200 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={review.quote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-black/70"
                style={{ fontFamily: "var(--font-inter)", fontSize: 17, lineHeight: 1.7, maxWidth: 480 }}
              >
                {review.quote}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-black/30 text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-black/30 text-black flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
