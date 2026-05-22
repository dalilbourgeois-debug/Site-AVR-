"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, type Profile } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/auth-modal";

function isProfileComplete(p: Profile | null): boolean {
  if (!p) return false;
  return Boolean(p.prenom?.trim() && p.nom?.trim() && p.telephone?.trim() && p.adresse?.trim());
}

const ITEMS = [
  { href: "/compte",              icon: "🏠", label: "Tableau de bord" },
  { href: "/compte/favoris",      icon: "♡",  label: "Mes favoris" },
  { href: "/compte/estimations",  icon: "💰", label: "Mes estimations" },
  { href: "/compte/reservations", icon: "🚗", label: "Mes réservations" },
  { href: "/compte/rdv",          icon: "🛠️", label: "Mes RDV" },
  { href: "/compte/documents",    icon: "📄", label: "Mes documents" },
  { href: "/compte/parametres",   icon: "⚙️", label: "Mes informations" }
];

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, loading, user, profile, signOut, isAdmin } = useAuth();
  const onboarding = pathname === "/compte/bienvenue";
  const complete = isProfileComplete(profile);

  // Si l'utilisateur est connecté MAIS son profil n'est pas complet → forcer l'onboarding
  useEffect(() => {
    if (!loading && isLoggedIn && profile && !complete && !onboarding) {
      router.replace(`/compte/bienvenue?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isLoggedIn, profile, complete, onboarding, pathname, router]);

  // En cours de chargement de la session
  if (loading) {
    return (
      <div className="container-x py-16 text-sm text-gray-500 text-center">
        Chargement de votre espace...
      </div>
    );
  }

  // Non connecté → CTA de connexion
  if (!isLoggedIn) {
    return (
      <div className="container-x py-16 max-w-md">
        <div className="text-xs tracking-[0.4em] text-brand-accent uppercase text-center">
          Espace client
        </div>
        <h1 className="mt-3 text-3xl font-serif text-brand text-center">
          Connexion requise
        </h1>
        <p className="mt-3 text-center text-gray-600 text-sm">
          Connectez-vous pour accéder à vos favoris, vos demandes d'estimation,
          vos réservations et vos documents.
        </p>
        <button
          onClick={() => openAuthModal({ redirectTo: pathname })}
          className="w-full mt-8 inline-flex items-center justify-center h-12 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  // Connecté → layout avec sidebar
  const prenom = profile?.prenom ?? "";
  const initiale = (profile?.prenom?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  // Cas spécial : sur la page d'onboarding, on cache la sidebar (focus sur le form)
  if (onboarding) {
    return <>{children}</>;
  }

  return (
    <div className="container-x py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 md:gap-10">
        {/* ============ SIDEBAR ============ */}
        <aside>
          <div className="md:sticky md:top-28 space-y-4">
            {/* Carte utilisateur */}
            <div className="bg-brand text-white p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-accent text-white text-lg font-semibold flex items-center justify-center">
                  {initiale}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {prenom || "Bonjour"}
                  </div>
                  <div className="text-xs text-white/60 truncate">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Menu — sur mobile, on scrolle horizontalement ; sur desktop, vertical */}
            <nav className="bg-white border border-gray-100 md:p-2">
              <ul className="flex md:flex-col overflow-x-auto md:overflow-visible no-scrollbar">
                {ITEMS.map((item) => {
                  const active = isItemActive(pathname, item.href);
                  return (
                    <li key={item.href} className="shrink-0 md:shrink">
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap md:whitespace-normal transition-colors ${
                          active
                            ? "bg-brand-accent text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-brand-accent"
                        }`}
                      >
                        <span className="text-base" aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Admin link (uniquement si role=admin) */}
            {isAdmin && (
              <Link
                href="/admin"
                className="block bg-brand-dark text-white p-4 border-l-2 border-brand-accent text-sm hover:bg-brand transition-colors"
              >
                <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent">
                  Administrateur
                </div>
                <div className="mt-1 font-serif">Back-office →</div>
              </Link>
            )}

            {/* Déconnexion */}
            <button
              onClick={signOut}
              className="hidden md:block w-full text-left px-4 py-3 text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-brand-accent transition-colors border-t border-gray-100 mt-2"
            >
              ← Se déconnecter
            </button>
          </div>
        </aside>

        {/* ============ CONTENU CENTRAL ============ */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function isItemActive(pathname: string, href: string): boolean {
  if (href === "/compte") return pathname === "/compte";
  return pathname === href || pathname.startsWith(href + "/");
}
