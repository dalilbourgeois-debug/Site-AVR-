"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  email: string;
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  adresse: string | null;
  role: "client" | "admin";
};

/**
 * Hook qui expose la session utilisateur Supabase + son profil.
 * Réagit aux changements de session (login / logout / refresh token).
 * `refreshProfile()` force un re-fetch du profil depuis la BDD —
 * à appeler après avoir mis à jour le profil (bienvenue / paramètres) pour
 * que le layout voit immédiatement les nouvelles valeurs.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Un seul client Supabase pour tout le hook, stocké dans un ref pour éviter le re-create
  const supabaseRef = useRef(createClient());

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabaseRef.current
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile((data as Profile | null) ?? null);
    return data as Profile | null;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const supabase = supabaseRef.current;

    async function loadInitial() {
      const { data } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(data.user ?? null);
      if (data.user) {
        await loadProfile(data.user.id);
      }
      if (isMounted) setLoading(false);
    }
    loadInitial();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    return await loadProfile(user.id);
  }, [user, loadProfile]);

  async function signOut() {
    await supabaseRef.current.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return {
    user,
    profile,
    loading,
    isLoggedIn: !!user,
    isAdmin: profile?.role === "admin",
    signOut,
    refreshProfile
  };
}
