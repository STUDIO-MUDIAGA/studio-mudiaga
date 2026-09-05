"use client";

import { useSyncExternalStore, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

/** Module-level so every component shares one set without a provider, same
 *  pattern as lib/cart.ts. Backed by the API (not localStorage) because a
 *  wishlist is tied to the account and needs to follow the user across
 *  devices. */
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
    const res = await fetch("/api/wishlist");
    if (!res.ok) return;
    const items: { id: string }[] = await res.json();
    ids = new Set(items.map((i) => i.id));
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

export function useWishlist() {
  const { user } = useAuth();
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (!user) {
      if (loadedFor !== null) reset();
      return;
    }
    if (loadedFor !== user.id) load(user.id);
  }, [user]);

  const has = useCallback((itemId: string) => snapshot.has(itemId), [snapshot]);

  const toggle = useCallback(
    async (itemId: string) => {
      if (!user) return false; // caller should route to /mudres/login
      const wasSaved = ids.has(itemId);
      const next = new Set(ids);
      if (wasSaved) next.delete(itemId);
      else next.add(itemId);
      ids = next;
      emit();

      try {
        if (wasSaved) {
          await fetch(`/api/wishlist?item_id=${encodeURIComponent(itemId)}`, { method: "DELETE" });
        } else {
          await fetch("/api/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ item_id: itemId }),
          });
        }
      } catch {
        // Revert on failure so the UI does not lie about what is saved.
        const reverted = new Set(ids);
        if (wasSaved) reverted.add(itemId);
        else reverted.delete(itemId);
        ids = reverted;
        emit();
      }
      return !wasSaved;
    },
    [user]
  );

  return { ids: snapshot, has, toggle, signedIn: !!user };
}
