"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavorisDB } from "@/hooks/useFavorisDB";
import { useAuth } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/auth-modal";

// Menu structuré en 2 univers
const linksParc = [
  { href: "/vehicules", label: "Nos véhicules" },
  { href: "/vehicules/vendus", label: "Vendus récemment" },
  { href: "/compte/favoris", label: "Mes favoris" },
  { href: "/vehicules/comparer", label: "Comparateur" },
  { href: "/vendre-reprendre", label: "Vendre / Reprendre" }
];
const linksAtelier = [
  { href: "/atelier", label: "Tous nos services" },
  { href: "/atelier/mecanique", label: "Mécanique" },
  { href: "/atelier/carrosserie", label: "Carrosserie" },
  { href: "/atelier/controle-technique", label: "Contrôle technique" },
  { href: "/atelier/rdv", label: "Prendre RDV" }
];
const linksDivers = [
  { href: "/contact", label: "Contact" }
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [menuCompteOpen, setMenuCompteOpen] = useState(false);
  const fav = useFavorisDB();
  const { isLoggedIn, profile, user, signOut } = useAuth();
  const initiale = (profile?.prenom?.[0] ?? user?.email?.[0] ?? "?").toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-brand-dark border-b-2 border-brand-accent/60 shadow-sm">
      <div className="container-x grid grid-cols-3 items-center h-20 text-white">
        {/* GAUCHE : hamburger */}
        <div className="flex items-center justify-start">
          <button
            aria-label="Menu"
            className="flex items-center gap-2 p-2 hover:text-brand-accent transition-colors"
            onClick={() => setOpen(true)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <span className="hidden sm:inline text-xs tracking-[0.3em] uppercase">Menu</span>
          </button>
        </div>

        {/* CENTRE : logo */}
        <div className="flex justify-center">
          <Link href="/" className="block" aria-label="AVR Automobile — Accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo%20avr%201.png"
              alt="AVR Automobile"
              className="h-14 md:h-[68px] w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>

        {/* DROITE : favoris + créer un compte */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/compte/favoris"
            aria-label="Mes favoris"
            className="relative p-2 text-white/90 hover:text-brand-accent transition-colors"
            title="Mes favoris"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill={fav.count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.5 4 4 7-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
            {fav.hydrated && fav.count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-accent text-white text-[10px] font-bold rounded-full px-1">
                {fav.count}
              </span>
            )}
          </Link>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuCompteOpen((v) => !v)}
                onBlur={() => setTimeout(() => setMenuCompteOpen(false), 150)}
                className="flex items-center gap-2 text-sm tracking-wide text-white/90 hover:text-brand-accent transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuCompteOpen}
              >
                <span className="w-9 h-9 rounded-full bg-brand-accent text-white text-sm font-semibold flex items-center justify-center">
                  {initiale}
                </span>
                <span className="hidden sm:inline text-xs tracking-[0.3em] uppercase">
                  {profile?.prenom ?? "Mon compte"}
                </span>
              </button>

              {menuCompteOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-brand-dark border border-white/10 shadow-2xl">
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">Connecté</div>
                    <div className="text-sm text-white truncate">{user?.email}</div>
                  </div>
                  <Link
                    href="/compte"
                    onClick={() => setMenuCompteOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-white/5 hover:text-brand-accent transition-colors"
                  >
                    Mon tableau de bord
                  </Link>
                  <Link
                    href="/compte/favoris"
                    onClick={() => setMenuCompteOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-white/5 hover:text-brand-accent transition-colors"
                  >
                    Mes favoris
                  </Link>
                  <button
                    onClick={() => { setMenuCompteOpen(false); signOut(); }}
                    className="w-full text-left block px-4 py-2.5 text-sm text-white/70 border-t border-white/10 hover:bg-white/5 hover:text-brand-accent transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal()}
              className="flex items-center gap-2 text-sm tracking-wide text-white/90 hover:text-brand-accent transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
              <span className="hidden sm:inline text-xs tracking-[0.3em] uppercase">Se connecter</span>
            </button>
          )}
        </div>
      </div>

      {/* Drawer du menu */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-full sm:w-[480px] bg-brand-dark text-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="text-xs tracking-[0.4em] text-white/60">MENU</div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-2xl hover:text-brand-accent">
                ✕
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* Univers 1 — LE PARC */}
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🚗</span>
                  <div className="text-[10px] tracking-[0.4em] text-brand-accent uppercase">Le parc</div>
                </div>
                <nav className="space-y-0.5 pl-1 border-l-2 border-brand-accent/40">
                  {linksParc.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block pl-4 py-2.5 text-base font-serif hover:text-brand-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </section>

              {/* Univers 2 — ATELIER */}
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🛠️</span>
                  <div className="text-[10px] tracking-[0.4em] text-brand-accent uppercase">Atelier</div>
                </div>
                <nav className="space-y-0.5 pl-1 border-l-2 border-brand-accent/40">
                  {linksAtelier.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block pl-4 py-2.5 text-base font-serif hover:text-brand-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </section>

              {/* Divers */}
              <section className="border-t border-white/10 pt-6">
                <nav className="space-y-0.5">
                  {linksDivers.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-2.5 text-sm tracking-widest uppercase text-white/70 hover:text-brand-accent transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </section>
            </div>

            <div className="px-6 py-6 border-t border-white/10 text-sm text-white/70 space-y-1">
              <div>27 rue des Maraîchers</div>
              <div>44220 Couëron</div>
              <a href="tel:0240862102" className="block text-brand-accent mt-2 hover:brightness-110">
                02 40 86 21 02
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
