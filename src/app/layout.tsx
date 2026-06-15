import type { Metadata } from "next";
import { Inter, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Studio Mudiaga — Curated Living",
  description: "Premium shortlet apartments and handcrafted furniture in Nigeria.",
  icons: { icon: "/Group.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <CustomCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
