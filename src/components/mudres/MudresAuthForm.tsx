"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next";

const WHITE = "#FFFFFF";
const DARK = "#2A3812";
const SAGE = "#96B85D";
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

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
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

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    window.location.href = next;
  };

  const google = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
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

      <button
        type="button"
        onClick={google}
        disabled={googleLoading}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: WHITE, border: `1px solid ${LINE}`, borderRadius: 999,
          padding: "13px 18px", color: DARK, fontSize: 13.5, fontWeight: 600,
          cursor: googleLoading ? "default" : "pointer", fontFamily: "inherit",
        }}
      >
        <GoogleIcon /> {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <span style={{ flex: 1, height: 1, background: LINE }} />
        <span style={{ color: FAINT, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>or</span>
        <span style={{ flex: 1, height: 1, background: LINE }} />
      </div>

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

        {error && (
          <p style={{ color: "#A33", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 14px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: DARK, color: WHITE, border: "none", borderRadius: 999,
            padding: "14px 20px", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
            cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1,
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

      <p style={{ color: FAINT, fontSize: 11.5, lineHeight: 1.6, textAlign: "center", margin: "26px 0 0" }}>
        Looking for shortlets? <Link href="/login" style={{ color: SAGE, fontWeight: 600 }}>Sign in to ABODE</Link>
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
