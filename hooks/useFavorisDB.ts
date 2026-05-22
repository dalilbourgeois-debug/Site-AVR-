"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook qui gère les favoris :
 * - Si l'utilisateur est connecté → lecture/écriture dans la table Supabase `favoris`
 * - Si déconnecté → l'appel à `toggle()` ne fait rien (c'est au composant
 *   appelant d'ouvrir le modal d'auth via `openAuthModal()`)
 */
export function useFavorisDB() {
  const { user, isLoggedIn } = useAuth();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Charge les favoris quand l'utilisateur se connecte ou change
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isLoggedIn || !user) {
        setSlugs([]);
        setHydrated(true);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("favoris")
        .select("vehicule_slug")
        .eq("user_id", user.id);
      if (cancelled) return;
      setSlugs((data ?? []).map((row: { vehicule_slug: string }) => row.vehicule_slug));
      setHydrated(true);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, user]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  /**
   * Toggle un favori. Retourne true si l'action a été effectuée,
   * false si l'utilisateur n'est pas connecté (l'appelant doit ouvrir le modal).
   */
  const toggle = useCallback(
    async (slug: string): Promise<{ ok: boolean; isFav: boolean }> => {
      if (!isLoggedIn || !user) return { ok: false, isFav: false };
      const supabase = createClient();
      const currentlyFav = slugs.includes(slug);
      if (currentlyFav) {
        await supabase.from("favoris").delete().eq("user_id", user.id).eq("vehicule_slug", slug);
        setSlugs((prev) => prev.filter((s) => s !== slug));
        return { ok: true, isFav: false };
      } else {
        await supabase.from("favoris").insert({ user_id: user.id, vehicule_slug: slug });
        setSlugs((prev) => [...prev, slug]);
        return { ok: true, isFav: true };
      }
    },
    [isLoggedIn, user, slugs]
  );

  return {
    slugs,
    count: slugs.length,
    has,
    toggle,
    hydrated
  };
}
