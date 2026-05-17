"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Section = {
  id: "parc" | "atelier";
  label: string;
  icon: string;
  links: { href: string; label: string }[];
};

const PARC: Section = {
  id: "parc",
  label: "Le parc",
  icon: "🚗",
  links: [
    { href: "/vehicules", label: "Tous nos véhicules" },
    { href: "/vehicules/vendus", label: "Vendus récemment" },
    { href: "/vehicules/favoris", label: "Mes favoris" },
    { href: "/vehicules/comparer", label: "Comparateur" },
    { href: "/vendre-reprendre", label: "Vendre / Reprendre" }
  ]
};

// La section Atelier est désormais une one-page : pas besoin de sous-nav.
// La SectionNav est cachée sur tous les /atelier*.

function getSection(pathname: string): Section | null {
  if (pathname.startsWith("/vehicules") || pathname.startsWith("/vendre-reprendre")) return PARC;
  return null;
}

function isActive(pathname: string, href: string): boolean {
  // Match exact pour les pages racines, sinon match avec préfixe
  if (href === "/vehicules") return pathname === "/vehicules";
  if (href === "/atelier") return pathname === "/atelier";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SectionNav() {
  const pathname = usePathname();
  const section = getSection(pathname);
  if (!section) return null;

  return (
    <div className="sticky top-20 z-30 bg-brand-dark border-t border-brand-accent/40 border-b border-white/5 shadow-md">
      <div className="container-x">
        <div className="flex items-center gap-6 h-12 overflow-x-auto no-scrollbar">
          {/* Label de section */}
          <div className="flex items-center gap-2 shrink-0 text-xs tracking-[0.3em] uppercase text-brand-accent">
            <span aria-hidden="true">{section.icon}</span>
            <span>{section.label}</span>
          </div>

          {/* Séparateur */}
          <div className="hidden md:block w-px h-5 bg-white/20 shrink-0" />

          {/* Sous-liens */}
          <nav className="flex items-center gap-6 text-[11px] tracking-[0.15em] uppercase">
            {section.links.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`whitespace-nowrap py-1 transition-colors ${
                    active
                      ? "text-brand-accent border-b-2 border-brand-accent"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
