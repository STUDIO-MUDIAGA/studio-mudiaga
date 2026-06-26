"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

const ORANGE = "#c46442";
const HERO = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

const inputStyle = { width: "100%", background: "#fafaf9", border: "1px solid #e8e8e4", borderRadius: 12, padding: "13px 16px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" as const };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = "/account";
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` } });
  };

  return (
    <AuthSplitLayout
      image={HERO}
      quote="Every great stay begins with the right space."
      tagline="Curated shortlets and handcrafted furniture across Nigeria."
      topRight={
        <p style={{ color: "#aaa", fontSize: 13 }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: ORANGE, fontWeight: 600, textDecoration: "none" }}>Sign Up</Link>
        </p>
      }
    >
      <h1 style={{ color: "#0a0a0a", fontSize: 28, fontWeight: 700, margin: "0 0 6px" }}>Welcome back</h1>
      <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 28px" }}>Sign in to your Studio Mudiaga account.</p>

      <button onClick={handleGoogle} disabled={googleLoading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, border: "1px solid #e8e8e4", borderRadius: 12, padding: "13px 16px", background: "#fff", color: "#0a0a0a", fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 20, opacity: googleLoading ? 0.5 : 1 }}>
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "#f0f0ee" }} />
        <span style={{ color: "#ccc", fontSize: 11 }}>or sign in with email</span>
        <div style={{ flex: 1, height: 1, background: "#f0f0ee" }} />
      </div>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Email</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </div>
        <div>
          <label style={{ display: "block", color: "#888", fontSize: 12, marginBottom: 7 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inputStyle, paddingRight: 44 }} type={showPassword ? "text" : "password"} placeholder="minimum 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPassword((p) => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 0 }}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: 12, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", background: ORANGE, color: "#fff", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, marginTop: 4 }}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        <Link href="/forgot-password" style={{ color: ORANGE, fontSize: 13, textDecoration: "none" }}>Forgot password?</Link>
      </p>
      <p style={{ textAlign: "center", marginTop: 24 }}>
        <Link href="/admin/login" style={{ color: "#ddd", fontSize: 11, textDecoration: "none" }}>Admin access</Link>
      </p>
    </AuthSplitLayout>
  );
}
