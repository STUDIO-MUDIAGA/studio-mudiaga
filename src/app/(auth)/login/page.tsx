"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";

const HERO = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/account");
    router.refresh();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
  };

  return (
    <AuthSplitLayout
      image={HERO}
      quote="Every great stay begins with the right space."
      tagline="Discover curated shortlet apartments and handcrafted furniture across Nigeria."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-white/40 text-sm leading-relaxed">
          Sign in to manage your bookings and orders.
        </p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 bg-white/6 border border-white/12 rounded-xl py-3 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mb-6"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/25 text-xs uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Email address</label>
          <input
            type="email"
            placeholder="e.g. you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-white/60 text-xs font-medium">Password</label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/15 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 text-black font-semibold rounded-xl py-3 text-sm hover:bg-amber-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-2"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <p className="text-white/30 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-white hover:text-amber-400 font-medium transition-colors">
            Sign up
          </Link>
        </p>
        <p className="text-white/15 text-xs">
          <Link href="/admin/login" className="hover:text-white/30 transition-colors">
            Admin access
          </Link>
        </p>
      </div>

      <p className="mt-8 text-center text-white/20 text-xs leading-relaxed">
        By signing in, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-white/40 transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" className="underline hover:text-white/40 transition-colors">Privacy Policy</Link>.
      </p>
    </AuthSplitLayout>
  );
}
