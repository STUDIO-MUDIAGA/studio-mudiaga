import { Poppins } from "next/font/google";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

/** The customer dashboard is its own full-page app shell (sidebar + top bar,
 *  built by DashboardShell) — it deliberately skips the marketing
 *  MudresHeader/footer that (mudres)/layout.tsx wraps the storefront in. */
export default function MudresDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={poppins.variable} style={{ fontFamily: "var(--font-poppins), system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
