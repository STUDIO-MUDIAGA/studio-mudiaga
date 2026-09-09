/** The account dashboard is its own full-page app shell (sidebar + top bar,
 *  built by AbodeDashboardShell) — same pattern as MUDRES's
 *  (mudres-dashboard)/layout.tsx. This layout deliberately stays a thin
 *  pass-through; each page wraps itself in the shell. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
