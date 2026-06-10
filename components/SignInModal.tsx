"use client";

import { useEffect, useState } from "react";
import { subscribeAuthModal, closeAuthModal, type AuthModalState } from "@/lib/auth-modal";
import { createClient } from "@/lib/supabase/client";

export default function SignInModal() {
  const [state, setState] = useState<AuthModalState>({ open: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeAuthModal(setState), []);

  // Fermer avec Escape
  useEffect(() => {
    if (!state.open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.open]);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const redirectTo = state.redirectTo ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/compte");
      // On force l'origin canonique (https://avrauto.fr) au lieu de window.location.origin
      // pour éviter que Supabase fallback sur Site URL si le navigateur est sur www.avrauto.fr
      // ou un autre variant. NEXT_PUBLIC_SITE_URL est défini dans .env.local (prod = https://avrauto.fr).
      const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? (typeof window !== "undefined" ? window.location.origin : "");
      const callback = `${canonicalOrigin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;

      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback }
      });
      if (err) throw err;
      // signInWithOAuth redirige automatiquement vers Google
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  if (!state.open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && closeAuthModal()}
      />

      {/* Carte */}
      <div className="relative bg-white max-w-md w-full p-8 shadow-2xl">
        {/* Liseré rouge en haut */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-accent" />

        <button
          onClick={() => closeAuthModal()}
          disabled={loading}
          aria-label="Fermer"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-brand-accent text-lg"
        >
          ✕
        </button>

        <div className="text-[10px] tracking-[0.4em] uppercase text-brand-accent">
          AVR Automobile
        </div>
        <h2 className="mt-3 text-2xl font-serif text-brand leading-tight">
          {state.reason ? "Créez un compte" : "Bienvenue"}
        </h2>

        {state.reason ? (
          <p className="mt-3 text-sm text-gray-700">{state.reason}</p>
        ) : (
          <p className="mt-3 text-sm text-gray-700">
            Connectez-vous pour profiter pleinement de votre espace client :
            favoris, RDV, estimations, réservations et historique.
          </p>
        )}

        {/* Bouton Google */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="mt-6 w-full inline-flex items-center justify-center gap-3 h-12 border-2 border-gray-200 hover:border-brand-accent hover:bg-gray-50 transition-colors text-sm font-medium text-gray-800 disabled:opacity-50"
        >
          <GoogleIcon />
          {loading ? "Redirection..." : "Continuer avec Google"}
        </button>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 p-3">
            {error}
          </div>
        )}

        <p className="mt-6 text-[11px] text-gray-500 text-center leading-relaxed">
          En continuant, vous acceptez nos{" "}
          <a href="/cgv" className="underline hover:text-brand-accent">CGV</a>{" "}
          et notre{" "}
          <a href="/politique-confidentialite-rgpd" className="underline hover:text-brand-accent">
            politique de confidentialité
          </a>.
        </p>

        <button
          onClick={() => closeAuthModal()}
          disabled={loading}
          className="mt-4 w-full text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-brand-accent py-2"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
