// Slugs blocked from client-created projects because a hand-built page still
// owns that path under src/app/(site)/projects/<slug>. Abode and UB used to be
// here but are now database-backed rows themselves, so the list is empty —
// add a slug here again only if a new hardcoded project page is introduced.
// Kept in its own client-safe file (no Supabase/service-role import) since
// ProjectForm.tsx needs it in the browser.
export const RESERVED_PROJECT_SLUGS: string[] = [];
