"use client";

import Link from "next/link";
import { useCompare } from "@/hooks/useStorageList";
import { vehicules } from "@/lib/data";
import { formatDate, formatEur, formatKm } from "@/lib/format";
import type { Vehicule } from "@/lib/types";

export default function CompareurPage() {
  const cmp = useCompare();
  if (!cmp.hydrated) return null;

  const items = cmp.items
    .map((slug) => vehicules.find((v) => v.slug === slug))
    .filter(Boolean) as Vehicule[];

  if (items.length === 0) {
    return (
      <div className="container-x py-16 max-w-2xl text-center">
        <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Comparateur</div>
        <h1 className="mt-3 text-3xl font-serif text-brand">Aucun véhicule sélectionné</h1>
        <p className="mt-3 text-gray-600">
          Cochez "Comparer" sur 2 ou 3 véhicules depuis la liste pour les afficher côte à côte.
        </p>
        <Link href="/vehicules" className="mt-8 inline-flex items-center justify-center px-8 py-3.5 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition">
          Voir le parc
        </Link>
      </div>
    );
  }

  // Lignes du tableau de comparaison
  const ROWS: { label: string; render: (v: Vehicule) => string | number | null }[] = [
    { label: "Prix TTC", render: (v) => formatEur(v.prixTtc) },
    { label: "Marque", render: (v) => v.marque },
    { label: "Modèle", render: (v) => v.modele },
    { label: "Version", render: (v) => v.version },
    { label: "Année", render: (v) => v.annee },
    { label: "1ʳᵉ mise en circulation", render: (v) => formatDate(v.dateMec) },
    { label: "Kilométrage", render: (v) => formatKm(v.kilometrage) },
    { label: "Énergie", render: (v) => v.energie },
    { label: "Boîte", render: (v) => v.boite },
    { label: "Puissance", render: (v) => v.puissanceReel ? `${v.puissanceReel} ch` : "—" },
    { label: "Puissance fiscale", render: (v) => v.puissanceFisc ? `${v.puissanceFisc} CV` : "—" },
    { label: "CO₂", render: (v) => v.co2 != null ? `${v.co2} g/km` : "—" },
    { label: "Crit'Air", render: (v) => v.critAir ?? "—" },
    { label: "Couleur extérieure", render: (v) => v.couleurExt ?? "—" },
    { label: "Portes / Places", render: (v) => `${v.nbPortes ?? "—"} / ${v.nbPlaces ?? "—"}` },
    { label: "Garantie", render: (v) => v.garantieDuree ?? "—" }
  ];

  return (
    <div className="container-x py-10 pb-32">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Comparateur</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
            {items.length} véhicule{items.length > 1 ? "s" : ""} côte à côte
          </h1>
        </div>
        <button onClick={() => cmp.clear()} className="text-xs tracking-[0.2em] uppercase text-gray-500 hover:text-brand-accent">
          Vider la comparaison
        </button>
      </div>

      {/* En-têtes véhicules */}
      <div
        className="grid gap-4 mb-6"
        style={{ gridTemplateColumns: `200px repeat(${items.length}, minmax(220px, 1fr))` }}
      >
        <div />
        {items.map((v) => (
          <div key={v.slug} className="bg-white border border-gray-100 hover:border-brand-accent rounded-sm overflow-hidden">
            <Link href={`/vehicules/${v.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.photos[0]} alt="" className="aspect-[4/3] object-cover w-full" />
            </Link>
            <div className="p-3">
              <div className="text-[10px] tracking-widest uppercase text-gray-400">{v.marque}</div>
              <div className="font-serif text-brand">{v.modele}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{v.version}</div>
              <button
                onClick={() => cmp.remove(v.slug)}
                className="mt-3 w-full text-[11px] tracking-[0.2em] uppercase py-2 border border-gray-200 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition"
              >
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau des caractéristiques */}
      <div className="bg-white border border-gray-100 rounded-sm overflow-x-auto">
        {ROWS.map((row, i) => (
          <div
            key={row.label}
            className={`grid gap-4 items-center px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            style={{ gridTemplateColumns: `200px repeat(${items.length}, minmax(220px, 1fr))` }}
          >
            <div className="text-xs tracking-widest uppercase text-gray-500">{row.label}</div>
            {items.map((v) => (
              <div key={v.slug} className="font-medium text-brand">{row.render(v) ?? "—"}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/vehicules" className="text-sm tracking-[0.2em] uppercase text-brand hover:text-brand-accent">
          ← Continuer à parcourir le parc
        </Link>
      </div>
    </div>
  );
}
