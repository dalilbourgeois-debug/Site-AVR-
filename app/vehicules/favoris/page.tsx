"use client";

import Link from "next/link";
import VehiculeCard from "@/components/VehiculeCard";
import { useFavorites } from "@/hooks/useStorageList";
import { vehicules } from "@/lib/data";

export default function FavorisPage() {
  const fav = useFavorites();
  if (!fav.hydrated) return null;

  const items = fav.items
    .map((slug) => vehicules.find((v) => v.slug === slug))
    .filter(Boolean);

  return (
    <div className="container-x py-10">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
        <div>
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mes favoris</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
            {items.length} véhicule{items.length > 1 ? "s" : ""} sauvegardé{items.length > 1 ? "s" : ""}
          </h1>
        </div>
        {items.length > 0 && (
          <button onClick={() => fav.clear()} className="text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-brand-accent">
            Tout retirer
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center">
          <div className="text-6xl">♡</div>
          <p className="mt-4 text-gray-600">
            Vous n'avez pas encore de favoris. Cliquez sur le cœur ♡ d'un véhicule pour le retrouver ici.
          </p>
          <Link
            href="/vehicules"
            className="mt-8 inline-flex items-center justify-center px-8 py-3.5 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition"
          >
            Voir le parc
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((v) => v && <VehiculeCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
