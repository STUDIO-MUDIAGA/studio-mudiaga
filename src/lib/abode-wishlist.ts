"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/** Same pattern as lib/wishlist.ts (MUDRES) — module-level so every
 *  component shares one set without a provider, backed by the API (not
 *  localStorage) so saved listings follow the account across devices. */
let ids = new Set<string>();
let loadedFor: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return ids;
}

function getServerSnapshot() {
  return ids;
}

async function load(userId: string) {
  loadedFor = userId;
  try {
    const res = await fetch("/api/abode/wishlist");
    if (!res.ok) return;
    const listings: { id: string }[] = await res.json();
    ids = new Set(listings.map((l) => l.id));
    emit();
  } catch {
    // Leave the previous snapshot in place; the UI can retry on next mount.
  }
}

function reset() {
  loadedFor = null;
  ids = new Set();
  emit();
}

export function useAbodeWishlist() {
  const { user } = useAuth();
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!user) {
      if (loadedFor !== null) reset();
      return;
    }
    if (loadedFor !== user.id) load(user.id);
  }, [user]);

  const has = useCallback((shortletId: string) => snapshot.has(shortletId), [snapshot]);

  const toggle = useCallback(
    async (shortletId: string) => {
      if (!user) return false; // caller should route to /login
      const wasSaved = ids.has(shortletId);
      const next = new Set(ids);
      if (wasSaved) next.delete(shortletId);
      else next.add(shortletId);
      ids = next;
      emit();

      try {
        if (wasSaved) {
          await fetch(`/api/abode/wishlist?shortlet_id=${encodeURIComponent(shortletId)}`, { method: "DELETE" });
        } else {
          await fetch("/api/abode/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ shortlet_id: shortletId }),
          });
        }
      } catch {
        // Revert on failure so the UI does not lie about what is saved.
        const reverted = new Set(ids);
        if (wasSaved) reverted.add(shortletId);
        else reverted.delete(shortletId);
        ids = reverted;
        emit();
      }
      return !wasSaved;
    },
    [user]
  );

  return { ids: snapshot, has, toggle, signedIn: !!user };
}
