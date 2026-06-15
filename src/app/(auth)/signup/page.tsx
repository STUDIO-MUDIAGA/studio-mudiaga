"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Mail } from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80";

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` },
    });
  };

  if (success) {
    return (
      <AuthSplitLayout
        image={HERO}
        quote="Your next great space is waiting for you."
        tagline="Curated shortlets and handcrafted furniture across Nigeria."
      >
        <div className="text-center py-8">
          <div className="w-14 h-14 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={22} className="text-amber-400" />
          </div>
          <h2 className="text-white text-2xl font-semibold mb-3">Check your email</h2>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            We sent a confirmation link to{" "}
            <span className="text-white/70">{email}</span>.<br />
            Click it to activate your account.
          </p>
          <Link href="/login" className="text-amber-400 text-sm hover:text-amber-300 transition-colors font-medium">
            Back to sign in
          </Link>
        </div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      image={HERO}
      quote="Your next great space is waiting for you."
      tagline="Curated shortlets and handcrafted furniture across Nigeria."
    >
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-white text-3xl font-semibold mb-2">Create your account</h1>
        <p className="text-white/40 text-sm leading-relaxed">
          Join Studio Mudiaga and unlock premium living experiences.
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
        {googleLoading ? "Redirecting…" : "Sign up with Google"}
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-white/25 text-xs uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Full name <span className="text-amber-400">*</span></label>
          <input
            type="text"
            placeholder="e.g. Emeka Obi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
          />
        </div>

        <div>
          <label className="block text-white/60 text-xs font-medium mb-1.5">Email address <span className="text-amber-400">*</span></label>
          <input
            type="email"
            placeholder="e.g. emeka@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
              />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </div>

        <p className="text-white/25 text-xs">
          Password must be at least 8 characters, including a number and a special character.
        </p>

        {error && (
          <p className="text-red-400 text-xs bg-red-400/8 border border-red-400/15 rounded-lg px-3.5 py-2.5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-400 text-black font-semibold rounded-xl py-3 text-sm hover:bg-amber-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-1"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-white/30 text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:text-amber-400 font-medium transition-colors">
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-center text-white/20 text-xs leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-white/40 transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="/privacy-policy" className="underline hover:text-white/40 transition-colors">Privacy Policy</Link>.
      </p>
    </AuthSplitLayout>
  );
}
