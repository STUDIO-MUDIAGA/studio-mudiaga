-- story_rows — the narrative image+text sections shown between the facts strip
-- and the gallery on a project page. Previously only existed hardcoded in the
-- two original hand-built pages (Abode, UB); adding it here so those two can
-- be migrated into the projects table without losing that content.
alter table public.projects
  add column if not exists story_rows jsonb not null default '[]';
