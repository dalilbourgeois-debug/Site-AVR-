"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavorites } from "@/hooks/useStorageList";

const links = [
  { href: "/vehicules", label: "Nos véhicules" },
  { href: "/vehicules/favoris", label: "Mes favoris" },
  { href: "/vehicules/vendus", label: "Vendus récemment" },
  { href: "/atelier", label: "Atelier" },
  { href: "/atelier/rdv", label: "Prendre RDV" },
  { href: "/vendre-reprendre", label: "Vendre / Reprendre" },
  { href: "/garage", label: "Le garage" },
  { href: "/contact", label: "Contact" }
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const fav = useFavorites();

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
          <Link href="/" className="text-center leading-none">
            <div className="text-2xl md:text-3xl font-serif tracking-[0.3em] text-white">AVR</div>
            <div className="text-[10px] md:text-xs tracking-[0.4em] text-white/70 mt-1">AUTOMOBILE</div>
          </Link>
        </div>

        {/* DROITE : favoris + créer un compte */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/vehicules/favoris"
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
          <Link
            href="/compte"
            className="flex items-center gap-2 text-sm tracking-wide text-white/90 hover:text-brand-accent transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
            <span className="hidden sm:inline text-xs tracking-[0.3em] uppercase">Créer un compte</span>
          </Link>
        </div>
      </div>

      {/* Drawer du menu */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-full sm:w-96 bg-brand-dark text-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="text-xs tracking-[0.4em] text-white/60">MENU</div>
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="text-2xl hover:text-brand-accent">
                ✕
              </button>
            </div>
            <nav className="px-6 py-6 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg font-serif border-b border-white/5 hover:text-brand-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 py-6 border-t border-white/10 text-sm text-white/70 space-y-1">
              <div>27 rue des Maraîchers</div>
              <div>44220 Couëron</div>
              <div className="text-brand-accent mt-2">02 40 86 21 02</div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
