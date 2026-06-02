// =============================================================================
//  Client Supabase pour les contextes hors-requête (build-time,
//  generateStaticParams, scripts CLI...).
//  Utilise la clé anon, donc respecte RLS — pas besoin de cookies/session.
// =============================================================================

import { createClient } from "@supabase/supabase-js";

export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false }
    }
  );
}
