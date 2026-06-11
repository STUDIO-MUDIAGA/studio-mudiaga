"use client";

import { createContext, useContext, useState } from "react";

type Theme = "dark" | "light";

const NavThemeCtx = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({ theme: "dark", setTheme: () => {} });

export function NavThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  return (
    <NavThemeCtx.Provider value={{ theme, setTheme }}>
      {children}
    </NavThemeCtx.Provider>
  );
}

export const useNavTheme = () => useContext(NavThemeCtx);
