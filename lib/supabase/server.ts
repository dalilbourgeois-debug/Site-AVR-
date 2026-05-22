import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client Supabase pour les composants/route handlers SERVEUR.
 * Lit/écrit la session via les cookies de Next.js.
 *
 * Note : on utilise la clé anon (publique) + la session du user.
 * Les politiques RLS s'appliquent automatiquement.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // `setAll` peut échouer dans un Server Component (cookies en lecture seule)
            // → c'est OK si on a un middleware qui rafraîchit la session
          }
        }
      }
    }
  );
}

/**
 * Client Supabase ADMIN avec la clé service_role.
 * BYPASSE les politiques RLS → à utiliser UNIQUEMENT côté serveur pour des opérations privilégiées
 * (uploads admin, créations système, etc.).
 *
 * Ne jamais exposer cette clé côté client.
 */
export function createAdminClient() {
  const { createClient } = require("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
