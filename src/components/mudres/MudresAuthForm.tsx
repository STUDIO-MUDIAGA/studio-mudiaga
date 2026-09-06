"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next";
import TurnstileWidget from "@/components/TurnstileWidget";

// Whether a widget will actually render. If unset, Turnstile is skipped
// entirely rather than blocking sign-in on a check that cannot run yet.
const TURNSTILE_ACTIVE = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const LINE = "#E7E8E0";
const MUTED = "#6F7A5E";
const FAINT = "#8A9276";

/** Where a MUDRES customer lands when they have not been sent anywhere else.
 *  Deliberately not the ABODE portal at /account. */
const MUDRES_HOME = "/mudres/orders";

const inputStyle: React.CSSProperties = {
  width: "100%", background: WHITE, border: `1px solid ${LINE}`, borderRadius: 12,
  padding: "13px 15px", color: DARK, fontSize: 13.5, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
};


export default function MudresAuthForm({
  mode,
  nextParam,
}: {
  mode: "login" | "signup";
  nextParam: string | null;
}) {
  const supabase = createClient();
  const next = safeNext(nextParam, MUDRES_HOME);
  const isSignup = mode === "signup";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (TURNSTILE_ACTIVE && !captchaToken) {
      setError("Please complete the verification check.");
      return;
    }
    setError("");
    setLoading(true);

    // Supabase ignores captchaToken when its own Attack Protection setting
    // is off, so this is always safe to send.
    const captchaOptions = captchaToken ? { captchaToken } : {};

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          ...captchaOptions,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      setSent(true);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password, options: captchaOptions });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = next;
  };


  if (sent) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: DARK, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 10px" }}>
          Check your email
        </h1>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          We sent a confirmation link to <strong style={{ color: DARK }}>{email}</strong>. Open it
          and you will come straight back to MUDRES.
        </p>
        <Link href="/mudres" style={{ color: DARK, fontSize: 13, fontWeight: 600 }}>
          Back to the store
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 style={{ color: DARK, fontSize: "clamp(26px, 3.4vw, 34px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 8px" }}>
        {isSignup ? "Create your account" : "Welcome back"}
      </h1>
      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6, margin: "0 0 26px" }}>
        {isSignup
          ? "One account to order and track handcrafted pieces from MUDRES."
          : "Sign in to your MUDRES account to order and track your pieces."}
      </p>

      <form onSubmit={submit}>
        {isSignup && (
          <Field label="Full name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              style={inputStyle}
            />
          </Field>
        )}

        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </Field>

        <Field label="Password">
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              style={{ ...inputStyle, paddingRight: 46 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
                width: 34, height: 34, borderRadius: 999, border: "none", background: "transparent",
                color: FAINT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {TURNSTILE_ACTIVE && (
          <div style={{ margin: "4px 0 14px" }}>
            <TurnstileWidget onVerify={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
          </div>
        )}

        {error && (
          <p style={{ color: "#A33", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 14px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || (TURNSTILE_ACTIVE && !captchaToken)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: DARK, color: WHITE, border: "none", borderRadius: 999,
            padding: "14px 20px", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
            cursor: loading || (TURNSTILE_ACTIVE && !captchaToken) ? "default" : "pointer",
            opacity: loading || (TURNSTILE_ACTIVE && !captchaToken) ? 0.6 : 1,
          }}
        >
          {loading ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>

      <p style={{ color: MUTED, fontSize: 13, textAlign: "center", margin: "22px 0 0" }}>
        {isSignup ? "Already have an account? " : "New to MUDRES? "}
        <Link
          href={`/mudres/${isSignup ? "login" : "signup"}${nextParam ? `?next=${encodeURIComponent(next)}` : ""}`}
          style={{ color: DARK, fontWeight: 600 }}
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>

    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", color: MUTED, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </span>
      {children}
    </label>
  );
}
