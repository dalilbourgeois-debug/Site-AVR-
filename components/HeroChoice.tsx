"use client";

import Link from "next/link";

/**
 * Lien stylisé pour les CTA du hero (Découvrir / Prendre RDV).
 * Pas de popup : la navigation se fait directement.
 * Les actions qui nécessitent un compte (favoris, estimation, réservation, RDV)
 * sont gardées séparément par le composant <RequireAuth>.
 */
export default function HeroChoice({
  href,
  label,
  variant = "primary",
  className
}: {
  href: string;
  label: React.ReactNode;
  variant?: "primary" | "ghost";
  /** Override des classes du bouton (sinon défaut du variant) */
  className?: string;
  /** Prop conservée pour compat — non utilisée */
  destination?: string;
}) {
  const defaultCls =
    variant === "primary"
      ? "inline-flex items-center justify-center h-14 w-[240px] bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
      : "inline-flex items-center justify-center h-14 w-[240px] border border-white/80 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-brand transition-colors";

  return (
    <Link href={href} className={className ?? defaultCls}>
      {label}
    </Link>
  );
}
