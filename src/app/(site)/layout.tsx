"use client";

import Navbar from "@/components/layout/Navbar";
import AppShell from "@/components/AppShell";
import { NavThemeProvider } from "@/context/NavTheme";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavThemeProvider>
      <AppShell>
        <Navbar />
        <main className="flex-1">{children}</main>
      </AppShell>
    </NavThemeProvider>
  );
}
