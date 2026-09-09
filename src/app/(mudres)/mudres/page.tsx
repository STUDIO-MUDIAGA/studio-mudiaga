import Link from "next/link";
import { ChevronRight, ArrowRight, Compass, Hammer, Truck, Home as HomeIcon, Wrench, MapPin, ShieldCheck } from "lucide-react";
import { getFurniture } from "@/lib/furniture";
import MudresHero from "@/components/mudres/MudresHero";
import ProductTile from "@/components/mudres/ProductTile";
import CategoryGrid from "@/components/mudres/CategoryGrid";
import NewsletterSignup from "@/components/mudres/NewsletterSignup";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";
const LINE = "rgba(42,56,18,0.08)";

const naira = (n: number | null) => `₦${(n ?? 0).toLocaleString()}`;

const FAQ_PREVIEW = [
  "How long does an order take to arrive?",
  "Do you deliver outside Lagos?",
  "Can I customize a piece (fabric, wood finish, size)?",
];

const PROCESS_STEPS = [
  { icon: Compass, title: "Design", copy: "We start from your space — proportions, light, and how a piece will actually be used." },
  { icon: Hammer, title: "Craft", copy: "Every piece is hand-built to order by our workshop, not pulled from a warehouse." },
  { icon: Truck, title: "Deliver", copy: "Delivered and set up in your home, with care that matches how it was made." },
];

const TRUST_ITEMS = [
  { icon: HomeIcon, label: "Handcrafted in Lagos" },
  { icon: Wrench, label: "Made to order" },
  { icon: MapPin, label: "Nationwide delivery" },
  { icon: ShieldCheck, label: "Secure payment via Paystack" },
];

export const revalidate = 60;

export default async function MudresLanding() {
  const items = await getFurniture();
  const inStock = items.filter((f) => f.in_stock);
  const heroItems = inStock.slice(0, 6);
  const featured = inStock.slice(0, 8);
  const productOfMonth = inStock.find((f) => f.product_of_month);

  return (
    <div style={{ background: WHITE, color: DARK, minHeight: "100vh" }}>
      <MudresHero products={heroItems} />

      <CategoryGrid items={items} />

      {/* ── Brand statement ── */}
      <section className="px-5 py-14 md:px-10 md:py-20" style={{ borderBottom: "1px solid rgba(42,56,18,0.08)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div>
            <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 16px" }}>Our philosophy</p>
            <h2 style={{ color: DARK, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>Craft rooted in culture, designed for today</h2>
            <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 14, lineHeight: 1.9, margin: 0 }}>
              MUDRES draws from the richness of Nigerian craftsmanship: bold textures, warm tones, and forms that ground a space without overwhelming it. Every piece is a collaboration between maker and material.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80",
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
              "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
            ].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: i === 0 ? "16px 4px 4px 4px" : i === 3 ? "4px 4px 16px 4px" : 4 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Product of the Month ── */}
      {productOfMonth && (
        <section className="px-5 py-14 md:px-10 md:py-20" style={{ borderBottom: `1px solid ${LINE}` }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <Link href={`/mudres/collection/${productOfMonth.id}`} style={{ display: "block", aspectRatio: "1", borderRadius: 20, overflow: "hidden", background: "rgba(42,56,18,0.03)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={productOfMonth.images?.[0]} alt={productOfMonth.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Link>
            <div>
              <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 16px" }}>Product of the Month</p>
              <h2 style={{ color: DARK, fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 14px" }}>{productOfMonth.name}</h2>
              {productOfMonth.description && (
                <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 14, lineHeight: 1.9, margin: "0 0 20px", maxWidth: 440 }}>{productOfMonth.description}</p>
              )}
              <p style={{ color: DARK, fontSize: 22, fontWeight: 700, margin: "0 0 24px" }}>{naira(productOfMonth.price)}</p>
              <Link
                href={`/mudres/collection/${productOfMonth.id}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: DARK, color: WHITE, fontWeight: 600, fontSize: 13, padding: "13px 24px", borderRadius: 999, textDecoration: "none" }}
              >
                Shop this piece <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Collection preview ── */}
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
            <div>
              <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px" }}>The Collection</p>
              <h2 style={{ color: DARK, fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 700, margin: 0 }}>Handpicked pieces</h2>
            </div>
            <Link href="/mudres/collection" style={{ display: "flex", alignItems: "center", gap: 4, color: SAGE, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((item) => (
              <ProductTile key={item.id} item={item} />
            ))}
          </div>

          {featured.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(42,56,18,0.25)", fontSize: 13 }}>
              No pieces available right now.
            </div>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-5 py-14 md:px-10 md:py-20" style={{ background: "rgba(42,56,18,0.03)", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px", textAlign: "center" }}>How it works</p>
          <h2 style={{ color: DARK, fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 700, margin: "0 0 40px", textAlign: "center" }}>From idea to your home</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map(({ icon: Icon, title, copy }, i) => (
              <div key={title} style={{ textAlign: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: WHITE, border: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon size={20} color={DARK} strokeWidth={1.6} />
                </div>
                <p style={{ color: "rgba(42,56,18,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 6px" }}>{String(i + 1).padStart(2, "0")}</p>
                <h3 style={{ color: DARK, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{title}</h3>
                <p style={{ color: "rgba(42,56,18,0.6)", fontSize: 13.5, lineHeight: 1.7, margin: "0 auto", maxWidth: 260 }}>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & delivery ── */}
      <section className="px-5 py-10 md:px-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ maxWidth: 1280, margin: "0 auto" }}>
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
              <Icon size={22} color={SAGE} strokeWidth={1.6} />
              <span style={{ color: DARK, fontSize: 12.5, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 24 }}>
          <Link href="/mudres/shipping" style={{ color: SAGE, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>
            Delivery details →
          </Link>
        </p>
      </section>

      {/* ── Custom orders CTA ── */}
      <section className="px-5 py-14 md:px-10 md:py-20" style={{ background: DARK }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 14px" }}>Custom orders</p>
          <h2 style={{ color: WHITE, fontSize: "clamp(24px, 3.6vw, 32px)", fontWeight: 700, lineHeight: 1.25, margin: "0 0 16px" }}>Have something specific in mind?</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.8, margin: "0 0 28px" }}>
            We take on made-to-order pieces — a size, a finish, a fabric that isn&apos;t in the collection. Tell us what you&apos;re picturing.
          </p>
          <Link
            href="/book-a-consultation"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: WHITE, color: DARK, fontWeight: 600, fontSize: 13, padding: "13px 26px", borderRadius: 999, textDecoration: "none" }}
          >
            Book a consultation <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── FAQ teaser ── */}
      <section className="px-5 py-14 md:px-10 md:py-20">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <p style={{ color: SAGE, fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", margin: "0 0 8px", textAlign: "center" }}>Questions</p>
          <h2 style={{ color: DARK, fontSize: "clamp(22px, 3.2vw, 28px)", fontWeight: 700, margin: "0 0 32px", textAlign: "center" }}>Before you order</h2>
          {FAQ_PREVIEW.map((q) => (
            <div key={q} style={{ borderTop: `1px solid ${LINE}`, padding: "18px 0" }}>
              <p style={{ color: DARK, fontSize: 14.5, fontWeight: 600, margin: 0 }}>{q}</p>
            </div>
          ))}
          <p style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/mudres/faq" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: SAGE, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              See all FAQs <ChevronRight size={14} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="px-5 py-14 md:px-10 md:py-20" style={{ background: DARK, textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <h2 style={{ color: WHITE, fontSize: "clamp(20px, 2.8vw, 24px)", fontWeight: 700, margin: "0 0 10px" }}>Stay in the loop</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 24px" }}>
            New pieces, restocks, and the occasional studio update. No spam.
          </p>
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
