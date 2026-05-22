"use client";

import { useAuth } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/auth-modal";

/**
 * Wrapper qui affiche les enfants si l'utilisateur est connecté,
 * sinon un CTA propre et contextuel pour se connecter.
 *
 * Usage :
 *   <RequireAuth
 *     title="Pour réserver ce véhicule"
 *     reason="Vous devez créer un compte (5 secondes avec Google) pour verser un acompte."
 *   >
 *     <ReservationForm ... />
 *   </RequireAuth>
 */
export default function RequireAuth({
  children,
  title,
  reason,
  ctaLabel = "Se connecter avec Google"
}: {
  children: React.ReactNode;
  title: string;
  reason: string;
  ctaLabel?: string;
}) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 p-8 text-center text-sm text-gray-500">
        Chargement...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white border border-gray-100 p-8">
        <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Connexion requise</div>
        <h2 className="mt-3 text-2xl font-serif text-brand leading-tight">{title}</h2>
        <p className="mt-3 text-gray-600 max-w-md">{reason}</p>
        <button
          onClick={() =>
            openAuthModal({
              reason,
              redirectTo:
                typeof window !== "undefined"
                  ? window.location.pathname + window.location.search
                  : undefined
            })
          }
          className="mt-6 inline-flex items-center justify-center h-12 px-8 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
        >
          {ctaLabel}
        </button>
        <p className="mt-4 text-xs text-gray-500 max-w-md">
          Aucun mot de passe à créer. Vous serez redirigé vers cette même page une fois connecté.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
