"use client";

import { useState } from "react";
import HeroChoice from "@/components/HeroChoice";

/**
 * Hero split desktop avec effet de hover :
 * quand on survole un panneau, sa surface s'agrandit légèrement (la diagonale se décale)
 * et son image zoome subtilement.
 */
export default function HomeHeroDesktop() {
  const [side, setSide] = useState<"left" | "right" | null>(null);

  // Coordonnées de la diagonale :
  //   X = position sur l'axe horizontal en haut
  //   Y = position sur l'axe horizontal en bas
  //   Repos : 55 / 45 — équilibré
  //   Hover gauche : 65 / 55 — décalé à droite (gauche s'agrandit)
  //   Hover droite : 45 / 35 — décalé à gauche (droite s'agrandit)
  const X = side === "left" ? 65 : side === "right" ? 45 : 55;
  const Y = side === "left" ? 55 : side === "right" ? 35 : 45;
  const leftPath = `polygon(0 0, ${X}% 0, ${Y}% 100%, 0 100%)`;
  const rightPath = `polygon(${X}% 0, 100% 0, 100% 100%, ${Y}% 100%)`;

  // Tailles SVG de la diagonale rouge — synchro avec le clip
  const diagX1 = X;
  const diagX2 = Y;

  return (
    <div className="hidden md:block absolute inset-0">
      {/* MOITIÉ GAUCHE — Le parc */}
      <div
        className="absolute inset-0 transition-[clip-path] duration-500 ease-out"
        style={{ clipPath: leftPath }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 100%), url(/images/AVR%20image%20hero%202.jpg)",
            transform: side === "left" ? "scale(1.04)" : "scale(1)"
          }}
        />
        {/* Voile supplémentaire quand l'autre côté est survolé (atténue ce côté) */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
          style={{ opacity: side === "right" ? 0.25 : 0 }}
        />
        <div className="absolute inset-y-0 left-0 w-[45%] flex flex-col items-center justify-center text-center px-8 hero-text">
          <div
            className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "150ms" }}
          >
            Concession · Couëron
          </div>
          <h2
            className="mt-6 font-serif text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight hero-title hero-anim hero-anim-title"
            style={{ animationDelay: "350ms" }}
          >
            LE PARC
          </h2>
          <p
            className="mt-6 max-w-md text-sm lg:text-base text-white/90 hero-anim"
            style={{ animationDelay: "900ms" }}
          >
            Plus de 70 véhicules d'occasion expertisés et garantis 6 mois.
            Reprise possible de votre voiture actuelle.
          </p>
          <div
            className="mt-8 hero-anim"
            style={{ animationDelay: "1100ms" }}
            onMouseEnter={() => setSide("left")}
            onMouseLeave={() => setSide(null)}
          >
            <HeroChoice
              href="/vehicules"
              destination="Le Parc"
              label={<>Découvrir →</>}
            />
          </div>
        </div>
      </div>

      {/* MOITIÉ DROITE — Atelier */}
      <div
        className="absolute inset-0 transition-[clip-path] duration-500 ease-out"
        style={{ clipPath: rightPath }}
      >
        <div
          className="absolute inset-0 bg-cover transition-transform duration-700 ease-out"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.65) 100%), url(/images/image%20hero%204.png)",
            backgroundPosition: "10% center",
            transform: side === "right" ? "scale(1.04)" : "scale(1)"
          }}
        />
        {/* Voile supplémentaire quand l'autre côté est survolé */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
          style={{ opacity: side === "left" ? 0.25 : 0 }}
        />
        <div className="absolute inset-y-0 right-0 w-[45%] flex flex-col items-center justify-center text-center px-8 hero-text">
          <div
            className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "250ms" }}
          >
            Atelier · Couëron
          </div>
          <h2
            className="mt-6 font-serif text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight hero-title hero-anim hero-anim-title"
            style={{ animationDelay: "450ms" }}
          >
            L'ATELIER
          </h2>
          <p
            className="mt-6 max-w-md text-sm lg:text-base text-white/90 hero-anim"
            style={{ animationDelay: "1000ms" }}
          >
            Mécanique, carrosserie, contrôle technique.
            Agréé AXA et Direct Assurance — sinistre pris en charge de A à Z.
          </p>
          <div
            className="mt-8 hero-anim"
            style={{ animationDelay: "1200ms" }}
            onMouseEnter={() => setSide("right")}
            onMouseLeave={() => setSide(null)}
          >
            <HeroChoice
              href="/atelier"
              destination="L'Atelier"
              label={<>Prendre RDV →</>}
            />
          </div>
        </div>
      </div>

      {/* Ligne diagonale rouge — anime en sync avec le clip-path */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <line
            x1={diagX1}
            y1="0"
            x2={diagX2}
            y2="100"
            stroke="#FF0000"
            strokeWidth="0.25"
            style={{ transition: "all 500ms ease-out" }}
          />
        </svg>
      </div>
    </div>
  );
}
