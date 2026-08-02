import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CustomCursor from "@/components/CustomCursor";
import { cn } from "@/lib/utils";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Studio Mudiaga — Curated Living",
  description: "Premium shortlet apartments and handcrafted furniture in Nigeria.",
  icons: { icon: "/Group.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <CustomCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
