"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import IntroLoader from "./IntroLoader";

// Routes that own their own intro/transition and should skip the default one
const CUSTOM_INTRO_ROUTES = ["/homev2"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const handleComplete = useCallback(() => setReady(true), []);

  if (CUSTOM_INTRO_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <IntroLoader onComplete={handleComplete} />
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: ready ? "auto" : "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
