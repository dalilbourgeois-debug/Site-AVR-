"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Wrench, type LucideIcon } from "lucide-react";

type Section = {
  id: "parc" | "atelier";
  label: string;
  Icon: LucideIcon;
  links: { href: string; label: string }[];
};

const PARC: Section = {
  id: "parc",
  label: "Le parc",
  Icon: Car,
  links: [
    { href: "/vehicules", label: "Tous nos véhicules" },
    { href: "/vehicules/vendus", label: "Vendus récemment" },
    { href: "/compte/favoris", label: "Mes favoris" },
    { href: "/vehicules/comparer", label: "Comparateur" },
    { href: "/vendre-reprendre", label: "Vendre / Reprendre" }
  ]
};

// Atelier : "Tous nos services" amène sur la one-page de présentation,
// les 3 autres liens amènent DIRECTEMENT sur la prise de RDV de chaque univers
// (logique : si on clique "Carrosserie" dans la sous-nav, on veut réserver,
// pas relire la présentation).
const ATELIER: Section = {
  id: "atelier",
  label: "Atelier",
  Icon: Wrench,
  links: [
    { href: "/atelier", label: "Tous nos services" },
    { href: "/atelier/carrosserie/rdv", label: "Carrosserie" },
    { href: "/atelier/mecanique/rdv", label: "Mécanique" },
    { href: "/atelier/controle-technique/rdv", label: "Contrôle technique" }
  ]
};

function getSection(pathname: string): Section | null {
  if (pathname.startsWith("/vehicules") || pathname.startsWith("/vendre-reprendre")) return PARC;
  if (pathname.startsWith("/atelier")) return ATELIER;
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
            <section.Icon size={16} strokeWidth={1.8} aria-hidden="true" />
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
