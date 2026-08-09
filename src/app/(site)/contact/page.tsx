"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Mail } from "lucide-react";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setError("Please share your name and email so we can reach you.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          project_type: "General enquiry",
          anything_else: message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(140px, 14vw, 200px) 48px clamp(64px, 8vw, 120px)" }}>
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-5"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Contact
        </p>
        <h1
          className="font-light text-black mb-6"
          style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.15, maxWidth: 640 }}
        >
          Say hello.
        </h1>
        <p className="text-black/60 max-w-md" style={{ fontFamily: "var(--font-inter)", fontSize: 16, lineHeight: 1.8 }}>
          Have a question, or just want to talk before committing to anything? Send us a note and we&apos;ll get back to you personally.
        </p>
      </section>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px clamp(96px, 12vw, 160px)" }}>
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr] border-t border-black/10 pt-16">
          {/* Direct info */}
          <div className="flex flex-col gap-10">
            <div>
              <p
                className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Email
              </p>
              <a
                href="mailto:hello@studiomudiaga.com"
                className="inline-flex items-center gap-2 text-black hover:text-black/60 transition-colors"
                style={{ fontFamily: "var(--font-inter)", fontSize: 20 }}
              >
                <Mail size={16} className="text-black/40" />
                hello@studiomudiaga.com
              </a>
            </div>

            <div>
              <p
                className="text-[11px] tracking-[0.25em] uppercase text-black/40 mb-4"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Follow
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-black/60 hover:text-black hover:border-black/30 transition-colors"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-black/60 hover:text-black hover:border-black/30 transition-colors"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="border-t border-black/10 pt-8">
              <p className="text-black/50" style={{ fontFamily: "var(--font-inter)", fontSize: 14, lineHeight: 1.8 }}>
                Already know you want to start a project? Skip ahead to the full brief so we can get straight to the details.
              </p>
              <Link
                href="/book-a-consultation"
                className="group inline-flex items-center gap-2 text-black mt-4 text-sm font-medium"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Book a Consultation
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          {/* Quick form */}
          <div>
            {submitted ? (
              <div className="border border-black/10 rounded-2xl" style={{ padding: "48px 32px" }}>
                <p
                  className="text-black font-light"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.4 }}
                >
                  Thank you. Your message is in. We read every note personally and will reply soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-black/70 text-sm font-medium mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                      Full name
                    </label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black/40 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-black/70 text-sm font-medium mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black/40 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-black/70 text-sm font-medium mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    Phone number <span className="text-black/35 font-normal">(optional)</span>
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black/40 transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>

                <div>
                  <label className="block text-black/70 text-sm font-medium mb-2" style={{ fontFamily: "var(--font-inter)" }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-white border border-black/15 rounded-xl px-4 py-3 text-sm text-black outline-none focus:border-black/40 transition-colors resize-y"
                    style={{ fontFamily: "var(--font-inter)", lineHeight: 1.7 }}
                  />
                </div>

                {error && (
                  <p className="text-sm" style={{ color: "#dc2626", fontFamily: "var(--font-inter)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: "var(--font-inter)", padding: "14px 28px", width: "fit-content" }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
