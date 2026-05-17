"use client";

import Link from "next/link";
import type { Vehicule } from "@/lib/types";
import { formatEur, formatKm, joursDepuis } from "@/lib/format";
import { useCompare, useFavorites } from "@/hooks/useStorageList";
import ShareButton from "@/components/ShareButton";
import { showToast } from "@/lib/toast";

export default function VehiculeCard({ v }: { v: Vehicule }) {
  const isNouveau = joursDepuis(v.dateArrivee) < 7;
  const fav = useFavorites();
  const cmp = useCompare();

  const isFav = fav.has(v.slug);
  const isComparing = cmp.has(v.slug);

  return (
    <div className="group relative bg-white rounded-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(255,0,0,0.25)] hover:border-brand-accent">
      {/* Liseré rouge animé sur le haut au hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />

      {/* Image cliquable */}
      <Link href={`/vehicules/${v.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={v.photos[0]}
            alt={`${v.marque} ${v.modele}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Voile au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          {v.statut === "reserve" && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] tracking-widest font-bold px-2.5 py-1 uppercase">
              Réservé
            </div>
          )}
          {v.statut === "vendu" && (
            <div className="absolute top-3 right-3 bg-gray-700 text-white text-[10px] tracking-widest font-bold px-2.5 py-1 uppercase">
              Vendu
            </div>
          )}
          {isNouveau && v.statut === "disponible" && (
            <div className="absolute top-3 left-3 bg-brand-accent text-white text-[10px] tracking-widest font-bold px-2.5 py-1 uppercase">
              Nouveau
            </div>
          )}
        </div>
      </Link>

      {/* Boutons d'action superposés (cœur + partage) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-20" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={() => {
            fav.toggle(v.slug);
            showToast(
              isFav
                ? `Retiré de vos favoris`
                : `${v.marque} ${v.modele} ajouté à vos favoris`
            );
          }}
          className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur transition-all ${
            isFav
              ? "bg-brand-accent text-white"
              : "bg-white/90 text-gray-700 hover:bg-brand-accent hover:text-white"
          }`}
          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.5 4 4 7-2.5 4.5-9.5 9-9.5 9z" />
          </svg>
        </button>
        <ShareButton
          variant="ghost"
          title={`${v.marque} ${v.modele} ${v.version}`}
          text={`${formatEur(v.prixTtc)} · ${formatKm(v.kilometrage)} · ${v.annee}`}
          url={typeof window !== "undefined" ? `${window.location.origin}/vehicules/${v.slug}` : `/vehicules/${v.slug}`}
        />
      </div>

      {/* Bandeau bas — case "Comparer" */}
      <Link href={`/vehicules/${v.slug}`} className="block">
        <div className="p-5">
          <div className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">{v.marque}</div>
          <div className="font-serif text-lg text-brand mt-1">{v.modele}</div>
          <div className="text-sm text-gray-600 line-clamp-1">{v.version}</div>
          <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-600">
            <span>{v.annee}</span>
            <span className="text-gray-300">·</span>
            <span>{formatKm(v.kilometrage)}</span>
            <span className="text-gray-300">·</span>
            <span>{v.energie}</span>
            <span className="text-gray-300">·</span>
            <span>{v.boite}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] tracking-widest text-gray-400 uppercase">Prix TTC</div>
              <div className="text-2xl font-serif font-bold text-brand">{formatEur(v.prixTtc)}</div>
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity">
              Voir →
            </span>
          </div>
        </div>
      </Link>

      {/* Bouton Comparer (collé en bas, hors du lien) */}
      <button
        type="button"
        onClick={() => {
          cmp.toggle(v.slug);
          showToast(
            isComparing
              ? "Retiré du comparateur"
              : "Ajouté au comparateur"
          );
        }}
        className={`w-full text-[11px] tracking-[0.25em] uppercase py-2.5 border-t transition-colors ${
          isComparing
            ? "bg-brand-accent text-white border-brand-accent"
            : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-brand hover:text-white hover:border-brand"
        }`}
      >
        {isComparing ? "✓ Sélectionné" : "+ Comparer"}
      </button>
    </div>
  );
}
