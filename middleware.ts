import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

/**
 * Middleware Next.js — rafraîchit la session Supabase à chaque requête.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes SAUF :
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     * - fichiers d'images (jpg, png, webp, avif, svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)"
  ]
};
