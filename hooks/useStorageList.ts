"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hook générique de liste persistée dans localStorage.
 *
 * Particularité importante : on diffuse un CustomEvent quand on modifie
 * la liste, afin que tous les composants utilisant le même hook sur la
 * MÊME page se synchronisent immédiatement (l'évènement natif `storage`
 * ne se déclenche que pour les autres onglets, pas pour la même page).
 *
 * Toutes les opérations d'écriture relisent d'abord le localStorage avant
 * de modifier, pour éviter les écrasements (race conditions entre cartes).
 */

function readList(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, list: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
    // Diffuse à tous les autres hooks de cette page
    window.dispatchEvent(new CustomEvent(`avr-storage-${key}`, { detail: list }));
  } catch {
    /* quota dépassé : ignore */
  }
}

export function useStorageList(key: string, maxItems?: number) {
  const [items, setItems] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Synchronisation initiale + écoute des changements (autres onglets + autres composants)
  useEffect(() => {
    const sync = () => {
      setItems(readList(key));
      setHydrated(true);
    };
    sync();

    const onStorage = (e: StorageEvent) => {
      if (e.key === key) sync();
    };
    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<string[]>;
      if (Array.isArray(ce.detail)) setItems(ce.detail);
      else sync();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(`avr-storage-${key}`, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(`avr-storage-${key}`, onCustom);
    };
  }, [key]);

  const add = useCallback(
    (slug: string) => {
      const current = readList(key);
      if (current.includes(slug)) return;
      let next = [...current, slug];
      if (maxItems && next.length > maxItems) {
        next = next.slice(next.length - maxItems);
      }
      writeList(key, next);
      setItems(next);
    },
    [key, maxItems]
  );

  const remove = useCallback(
    (slug: string) => {
      const current = readList(key);
      const next = current.filter((s) => s !== slug);
      writeList(key, next);
      setItems(next);
    },
    [key]
  );

  const toggle = useCallback(
    (slug: string) => {
      const current = readList(key);
      const has = current.includes(slug);
      let next: string[];
      if (has) {
        next = current.filter((s) => s !== slug);
      } else {
        next = [...current, slug];
        if (maxItems && next.length > maxItems) {
          next = next.slice(next.length - maxItems);
        }
      }
      writeList(key, next);
      setItems(next);
    },
    [key, maxItems]
  );

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  const clear = useCallback(() => {
    writeList(key, []);
    setItems([]);
  }, [key]);

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
