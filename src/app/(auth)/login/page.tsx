"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { safeNext } from "@/lib/safe-next";

const ORANGE = "#c46442";


const HERO = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

const inputStyle = { width: "100%", background: "#fafaf9", border: "1px solid #e8e8e4", borderRadius: 12, padding: "13px 16px", color: "#0a0a0a", fontSize: 13, outline: "none", boxSizing: "border-box" as const };

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const supabase = createClient();
  const next = safeNext(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = next;
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
