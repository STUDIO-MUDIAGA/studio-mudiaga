"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AppShell from "@/components/AppShell";
import { NavThemeProvider } from "@/context/NavTheme";

// Routes that render their own nav and should skip the default Navbar
const CUSTOM_NAV_ROUTES = ["/homev2"];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasCustomNav = CUSTOM_NAV_ROUTES.includes(pathname);

  return (
    <NavThemeProvider>
      <AppShell>
        {!hasCustomNav && <Navbar />}
        <main className="flex-1">{children}</main>
      </AppShell>
    </NavThemeProvider>
  );
}
