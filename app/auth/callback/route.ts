import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Callback OAuth Google : Supabase nous renvoie ici avec un `code` à échanger
 * contre une session.
 *
 * Pattern critique : on crée le client Supabase avec des callbacks `cookies`
 * qui écrivent DIRECTEMENT sur l'objet `response` final (celui qu'on retourne),
 * pas sur le cookie store de Next.js. Sinon, NextResponse.redirect() ne
 * propage pas les Set-Cookie au navigateur, et la session est invisible
 * tant qu'on n'a pas rechargé manuellement la page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin: reqOrigin } = new URL(request.url);
  // Force toujours l'origine canonique (https://avrauto.fr) pour les redirects,
  // pour eviter d'atterrir sur www.avrauto.fr ou pire sur un host parasite.
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? reqOrigin;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";
  const errorParam = searchParams.get("error");

  // Cas d'erreur OAuth : on renvoie sur /compte avec le message
  if (errorParam) {
    return NextResponse.redirect(`${origin}/compte?error=${encodeURIComponent(errorParam)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/compte?error=missing_code`);
  }

  // Réponse de redirection : c'est sur celle-ci qu'on attache les cookies
  // de session. Une fois retournée, le navigateur stocke les cookies et
  // les renvoie sur la prochaine requête (la page de destination).
  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // On écrit sur la réponse, pas sur le request.cookies
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/compte?error=${encodeURIComponent(error.message)}`
    );
  }

  return response;
}
