"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import VehiculeCard from "@/components/VehiculeCard";
import { useFavorisDB } from "@/hooks/useFavorisDB";
import { vehicules } from "@/lib/data";

export default function FavorisPage() {
  const fav = useFavorisDB();

  if (!fav.hydrated) {
    return <div className="text-sm text-gray-500">Chargement de vos favoris...</div>;
  }

  const items = fav.slugs
    .map((slug) => vehicules.find((v) => v.slug === slug))
    .filter(Boolean);

  return (
    <div>
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mon espace</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
        Mes favoris
      </h1>
      <p className="mt-2 text-gray-600">
        {items.length === 0
          ? "Vous n'avez pas encore de favoris."
          : `${items.length} véhicule${items.length > 1 ? "s" : ""} sauvegardé${items.length > 1 ? "s" : ""}.`}
      </p>

      {items.length === 0 ? (
        <div className="mt-8 bg-white border border-gray-100 p-10 text-center">
          <Heart size={48} strokeWidth={1.4} className="mx-auto text-brand-accent" aria-hidden="true" />
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Parcourez le parc et cliquez sur le cœur des véhicules qui vous plaisent
            pour les retrouver ici.
          </p>
          <Link
            href="/vehicules"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition"
          >
            Voir le parc →
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((v) => v && <VehiculeCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
