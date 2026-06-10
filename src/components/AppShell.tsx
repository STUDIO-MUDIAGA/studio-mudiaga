"use client";

import { useState, useCallback } from "react";
import IntroLoader from "./IntroLoader";
import CustomCursor from "./CustomCursor";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <CustomCursor />
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
