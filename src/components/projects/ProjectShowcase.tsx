"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavTheme } from "@/context/NavTheme";

export type ProjectShowcaseData = {
  eyebrow: string;
  title: string;
  location: string;
  heroImage: string;
  intro: string[];
  gallery: { src: string; alt: string }[];
  cta: { label: string; href: string };
};

export default function ProjectShowcase({ data }: { data: ProjectShowcaseData }) {
  const { setTheme } = useNavTheme();

  // Project pages always show over a dark hero — keep nav in "dark" (white logo) mode
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-screen min-h-[560px] w-full overflow-hidden">
        <Image
          src={data.heroImage}
          alt={data.title}
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
              {data.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white font-light leading-[1.05] mb-4"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(48px, 8vw, 120px)" }}
            >
              {data.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white/60 text-sm tracking-[0.2em] uppercase"
            >
              {data.location}
            </motion.p>
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
            About the Project
          </p>
          <div className="max-w-2xl flex flex-col gap-6">
            {data.intro.map((paragraph, i) => (
              <p
                key={i}
                className="text-black/70"
                style={{ fontFamily: "var(--font-dm-sans)", fontSize: 16, lineHeight: 1.85 }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 120px" }}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.gallery.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-black/5"
              style={{
                aspectRatio: i % 5 === 0 ? "3 / 4" : "4 / 5",
                gridColumn: i % 5 === 0 ? "span 2" : "span 1",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
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
            Interested in a project like this?
          </h3>
          <Link
            href={data.cta.href}
            className="group inline-flex items-center gap-3 text-black text-sm font-medium shrink-0"
          >
            <span className="w-11 h-11 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-black/5 transition-colors duration-200">
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </span>
            {data.cta.label}
          </Link>
        </div>
      </section>
    </div>
  );
}
