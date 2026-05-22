"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase pour le NAVIGATEUR.
 * Utilise la clé anon (publique) + la session de l'utilisateur via les cookies.
 * Les RLS Postgres garantissent que chaque utilisateur ne voit que ses propres lignes.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
