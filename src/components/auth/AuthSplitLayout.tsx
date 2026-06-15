"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  image: string;
  quote: string;
  tagline: string;
  brand?: string;
  children: React.ReactNode;
}

export default function AuthSplitLayout({ image, quote, tagline, brand = "Studio Mudiaga — Curated Living", children }: Props) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — image ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col">
        <Image
          src={image}
          alt="Studio Mudiaga"
          fill
          className="object-cover"
          priority
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Logo top-left */}
        <div className="relative z-10 p-10">
          <Link href="/">
            <Image src="/Group.svg" alt="Studio Mudiaga" width={32} height={32} className="invert opacity-90" />
          </Link>
        </div>

        {/* Quote bottom-left */}
        <div className="relative z-10 mt-auto p-10 pb-12">
          <p className="text-white text-xl font-playfair italic leading-snug mb-2 max-w-sm">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="text-white/50 text-sm mb-6 max-w-xs leading-relaxed">{tagline}</p>
          <p className="text-white/30 text-xs tracking-widest uppercase">{brand}</p>
        </div>
      </div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-20 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/">
            <Image src="/Group.svg" alt="Studio Mudiaga" width={28} height={28} className="invert" />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
