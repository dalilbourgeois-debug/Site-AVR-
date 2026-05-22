import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback OAuth Google : Supabase nous renvoie ici avec un `code` à échanger contre une session.
 * On échange le code, on stocke la session dans les cookies, puis on redirige vers
 * la page d'origine (ou /compte si rien n'est précisé).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(`${origin}/compte?error=${encodeURIComponent(errorParam)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/compte?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/compte?error=missing_code`);
}
