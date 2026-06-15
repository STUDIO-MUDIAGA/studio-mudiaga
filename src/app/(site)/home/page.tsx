import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Sofa, CalendarCheck, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Studio Mudiaga — Curated Shortlets & Furniture in Nigeria",
  description:
    "Studio Mudiaga is a Nigerian lifestyle platform offering hand-verified shortlet apartments in Lagos and Abuja, and a curated collection of handcrafted furniture. Book a stay or shop the collection.",
};

const shortletImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
];
const furnitureImages = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
];

export default function AboutPage() {
  return (
    <div className="pt-28 pb-24">
      {/* ── Hero ── */}
      <section className="px-6 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            What is Studio Mudiaga?
          </p>
          <h1 className="font-playfair text-4xl md:text-6xl text-white leading-tight mb-6">
            Premium Shortlets &<br />
            <span className="italic text-white/60">Handcrafted Furniture</span><br />
            in Nigeria
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Studio Mudiaga is a curated lifestyle platform where you can book hand-verified
            short-let apartments across Lagos and Abuja, and shop a collection of
            thoughtfully designed furniture — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            <Link
              href="/shortlets"
              className="bg-amber-400 text-black font-semibold rounded-full px-7 py-3 text-sm hover:bg-amber-300 transition-all"
            >
              Browse Shortlets
            </Link>
            <Link
              href="/furniture"
              className="bg-white/8 border border-white/15 text-white rounded-full px-7 py-3 text-sm hover:bg-white/12 transition-all"
            >
              Shop Furniture
            </Link>
          </div>
        </div>
      </section>

      {/* ── What we offer ── */}
      <section className="px-6 mb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Shortlets */}
          <div className="bg-white/4 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 gap-1 h-52">
              {shortletImages.map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image src={src} alt="Shortlet apartment" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Shortlets</span>
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">Book a stay</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Hand-verified apartments in Lagos and Abuja available by the night, week, or month.
                Each listing is quality-checked for comfort, safety, and value.
              </p>
              <Link href="/shortlets" className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                View all shortlets →
              </Link>
            </div>
          </div>

          {/* Furniture */}
          <div className="bg-white/4 border border-white/10 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 gap-1 h-52">
              {furnitureImages.map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image src={src} alt="Furniture" fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-3">
                <Sofa size={16} className="text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Furniture</span>
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">Shop the collection</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-5">
                Thoughtfully designed pieces for considered living. Sofas, tables, lighting, and
                more — each crafted to bring character and comfort to your home.
              </p>
              <Link href="/furniture" className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                Explore furniture →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 mb-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-10">How it works</p>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: ShieldCheck, title: "Create an account", body: "Sign up with your email or Google. It takes under a minute and your data is always secure." },
              { icon: MapPin, title: "Book or shop", body: "Browse verified shortlets by city, or pick from our furniture collection. Filter by type, budget, and availability." },
              { icon: CalendarCheck, title: "Confirm & enjoy", body: "Receive instant booking confirmation by email. We handle the rest so you can focus on enjoying your space." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="w-12 h-12 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl text-white mb-4">Ready to get started?</h2>
          <p className="text-white/40 text-sm mb-8">
            Create a free account to save your favourites, track bookings, and manage orders.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="bg-amber-400 text-black font-semibold rounded-full px-7 py-3 text-sm hover:bg-amber-300 transition-all">
              Create account
            </Link>
            <Link href="/login" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
