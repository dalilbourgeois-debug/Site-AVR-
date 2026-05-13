"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hook générique de liste persistée dans localStorage (sync entre onglets).
 * Utilisé pour les favoris et le comparateur.
 */
export function useStorageList(key: string, maxItems?: number) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Lecture initiale + écoute des changements (sync entre onglets)
  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(key);
        const arr = raw ? (JSON.parse(raw) as string[]) : [];
        setItems(Array.isArray(arr) ? arr : []);
      } catch {
        setItems([]);
      }
      setHydrated(true);
    };
    read();
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  const persist = useCallback(
    (next: string[]) => {
      setItems(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* quota dépassé : on ignore */
      }
    },
    [key]
  );

  const add = useCallback(
    (slug: string) => {
      setItems((prev) => {
        if (prev.includes(slug)) return prev;
        let next = [...prev, slug];
        if (maxItems && next.length > maxItems) {
          // FIFO : on enlève le plus ancien si on dépasse la limite
          next = next.slice(next.length - maxItems);
        }
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key, maxItems]
  );

  const remove = useCallback(
    (slug: string) => {
      setItems((prev) => {
        const next = prev.filter((s) => s !== slug);
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key]
  );

  const toggle = useCallback(
    (slug: string) => {
      setItems((prev) => {
        const has = prev.includes(slug);
        let next: string[];
        if (has) next = prev.filter((s) => s !== slug);
        else {
          next = [...prev, slug];
          if (maxItems && next.length > maxItems) next = next.slice(next.length - maxItems);
        }
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key, maxItems]
  );

  const has = useCallback((slug: string) => items.includes(slug), [items]);
  const clear = useCallback(() => persist([]), [persist]);

  return { items, count: items.length, has, add, remove, toggle, clear, hydrated };
}

// API spécifiques pour clarifier l'usage côté UI
export function useFavorites() {
  return useStorageList("avr-favoris");
}
export function useCompare() {
  // Maximum 3 véhicules en comparaison
  return useStorageList("avr-comparateur", 3);
}
