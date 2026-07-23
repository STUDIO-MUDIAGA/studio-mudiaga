"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "88dvh", minHeight: 560 }}>
      <Image
        src="/IMG_1670.JPG"
        alt="Studio Mudiaga interior"
        fill
        className="object-cover"
        sizes="100vw"
      />

      {/* Technical grid-line overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-0 bottom-0 bg-white/40" style={{ left: "34.5%", width: 2 }} />
        <div className="absolute left-0 right-0 bg-white/40" style={{ top: "16%", height: 2 }} />
        <div className="absolute left-0 right-0 bg-white/40" style={{ top: "84%", height: 2 }} />
        <div
          className="absolute rounded-full border-2 border-white/60"
          style={{ left: "34.5%", top: "16%", width: 8, height: 8, transform: "translate(-50%, -50%)" }}
        />
      </div>

      {/* Blurred color panel + content */}
      <div
        className="absolute z-10 left-4 right-4 md:left-auto md:right-[65.5%] md:w-[clamp(280px,26vw,420px)]"
        style={{ top: "16%", height: "68%" }}
      >
        {/* Glass panel — frosted backdrop blur over the photo, with a soft top-left highlight */}
        <div
          className="absolute inset-0 border border-white/25"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.08))",
            backdropFilter: "blur(20px) saturate(140%)",
            WebkitBackdropFilter: "blur(20px) saturate(140%)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between" style={{ padding: "clamp(28px, 3vw, 44px)" }}>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-white font-medium"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: 1.25 }}
          >
            Design is personal.
            <br />
            So are we.
          </motion.h2>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/85 mb-6"
              style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, lineHeight: 1.6 }}
            >
              Let&apos;s create something meaningful, together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/book-a-consultation"
                className="inline-flex items-center bg-white text-black"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, padding: "12px 24px" }}
              >
                <span className="underline underline-offset-4">Book a Consultation</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
