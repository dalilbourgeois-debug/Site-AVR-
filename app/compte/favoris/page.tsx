"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import VehiculeCard from "@/components/VehiculeCard";
import { useFavorisDB } from "@/hooks/useFavorisDB";
import { getVehiculesBySlugsClient } from "@/lib/data-client";
import type { Vehicule } from "@/lib/types";

export default function FavorisPage() {
  const fav = useFavorisDB();
  const [items, setItems] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fav.hydrated) return;
    let cancelled = false;
    (async () => {
      if (fav.slugs.length === 0) {
        if (!cancelled) { setItems([]); setLoading(false); }
        return;
      }
      const rows = await getVehiculesBySlugsClient(fav.slugs);
      // Trie selon l'ordre des slugs dans fav.slugs (ordre d'ajout)
      const bySlug = new Map(rows.map((v) => [v.slug, v]));
      const sorted = fav.slugs.map((s) => bySlug.get(s)).filter(Boolean) as Vehicule[];
      if (!cancelled) { setItems(sorted); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [fav.hydrated, fav.slugs]);

  if (!fav.hydrated || loading) {
    return <div className="text-sm text-gray-500">Chargement de vos favoris...</div>;
  }

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
          {items.map((v) => <VehiculeCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
