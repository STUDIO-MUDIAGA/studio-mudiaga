"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  image: string;
  quote: string;
  tagline?: string;
  topRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthSplitLayout({ image, quote, tagline, topRight, children }: Props) {
  return (
    <div className="flex h-screen bg-[#0c0c0c]">
      {/* ── Left panel ── */}
      <div className="hidden lg:block lg:w-[45%] shrink-0 relative overflow-hidden">
        <Image src={image} alt="Studio Mudiaga" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10">
          <p className="text-white text-2xl font-bold leading-tight mb-2">{quote}</p>
          {tagline && <p className="text-white/50 text-sm leading-relaxed max-w-xs">{tagline}</p>}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col bg-[#0c0c0c] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 lg:px-12 py-5 shrink-0">
          <div className="lg:hidden">
            <Link href="/">
              <Image src="/Group.svg" alt="Studio Mudiaga" width={28} height={28} className="invert" />
            </Link>
          </div>
          {topRight ?? <div />}
        </div>

        {/* Form — vertically centered */}
        <div className="flex-1 flex items-center justify-center px-8 lg:px-16 xl:px-24 py-8">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 lg:px-12 py-5 shrink-0">
          <p className="text-white/20 text-xs">© 2025 Studio Mudiaga</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-white/20 text-xs hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-white/20 text-xs hover:text-white/40 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
