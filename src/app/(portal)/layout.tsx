"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Portal header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/Group.svg" alt="Studio Mudiaga" width={28} height={28} className="invert" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm hidden sm:block">
              {profile?.full_name ?? user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
