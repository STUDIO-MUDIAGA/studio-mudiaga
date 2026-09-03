"use client";

import { useSyncExternalStore, useCallback } from "react";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

const STORAGE_KEY = "mudres.cart.v1";
const EMPTY: CartLine[] = [];

/** Module-level store so every component shares one cart without a provider.
 *  Snapshots are frozen references, which is what useSyncExternalStore needs. */
let snapshot: CartLine[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Private mode or quota: the cart still works for this session.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in step.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    try {
      const parsed = e.newValue ? JSON.parse(e.newValue) : [];
      snapshot = Array.isArray(parsed) ? parsed : EMPTY;
    } catch {
      snapshot = EMPTY;
    }
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartLine[] {
  // First read on the client pulls in whatever was stored; afterwards the
  // reference is stable until a mutation replaces it.
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) snapshot = parsed as CartLine[];
      }
    } catch {
      snapshot = EMPTY;
    }
  }
  return snapshot;
}

function getServerSnapshot(): CartLine[] {
  return EMPTY;
}

function commit(next: CartLine[]) {
  snapshot = next;
  persist();
  emit();
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      const existing = snapshot.find((l) => l.id === line.id);
      commit(
        existing
          ? snapshot.map((l) =>
              l.id === line.id ? { ...l, quantity: l.quantity + quantity } : l
            )
          : [...snapshot, { ...line, quantity }]
      );
    },
    []
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    commit(
      quantity <= 0
        ? snapshot.filter((l) => l.id !== id)
        : snapshot.map((l) => (l.id === id ? { ...l, quantity } : l))
    );
  }, []);

  const remove = useCallback((id: string) => {
    commit(snapshot.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);

  return {
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
    add,
    setQuantity,
    remove,
    clear,
  };
}
