"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompare } from "@/hooks/useStorageList";
import { getVehiculesBySlugsClient } from "@/lib/data-client";
import type { Vehicule } from "@/lib/types";

export default function CompareBar() {
  const cmp = useCompare();
  const [selected, setSelected] = useState<Vehicule[]>([]);

  useEffect(() => {
    if (!cmp.hydrated) return;
    let cancelled = false;
    (async () => {
      if (cmp.items.length === 0) { if (!cancelled) setSelected([]); return; }
      const rows = await getVehiculesBySlugsClient(cmp.items);
      const bySlug = new Map(rows.map((v) => [v.slug, v]));
      const sorted = cmp.items.map((s) => bySlug.get(s)).filter(Boolean) as Vehicule[];
      if (!cancelled) setSelected(sorted);
    })();
    return () => { cancelled = true; };
  }, [cmp.hydrated, cmp.items]);

  if (!cmp.hydrated || cmp.count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl">
      <div className="bg-brand-dark/95 backdrop-blur border border-brand-accent/40 text-white shadow-2xl rounded-md px-4 py-3 flex items-center gap-3">
        <div className="hidden md:block text-xs tracking-[0.3em] uppercase text-brand-accent shrink-0">
          Comparateur
        </div>

        {/* Vignettes des véhicules sélectionnés */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {selected.map((v) => (
            <div key={v.slug} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded px-2 py-1.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.photos[0]} alt="" className="w-8 h-8 object-cover rounded-sm" />
              <div className="text-xs leading-tight">
                <div className="font-medium">{v.marque}</div>
                <div className="text-white/60 truncate max-w-[100px]">{v.modele}</div>
              </div>
              <button
                onClick={() => cmp.remove(v.slug)}
                aria-label="Retirer"
                className="text-white/50 hover:text-brand-accent ml-1 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          {/* Slots vides */}
          {Array.from({ length: Math.max(0, 2 - selected.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="border border-dashed border-white/15 rounded text-white/30 text-[10px] tracking-widest uppercase px-3 py-2 shrink-0"
            >
              + ajouter
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => cmp.clear()}
            className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-brand-accent px-2"
          >
            Vider
          </button>
          <Link
            href="/vehicules/comparer"
            className={`text-xs tracking-[0.2em] uppercase px-4 py-2.5 ${
              selected.length >= 2
                ? "bg-brand-accent text-white hover:brightness-110"
                : "bg-white/10 text-white/40 pointer-events-none"
            }`}
          >
            Comparer ({selected.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
