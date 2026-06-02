// =============================================================================
//  Couche de données véhicules — alimentée par la table public.vehicules de
//  Supabase, mise à jour quotidiennement par scripts/sync-cardiff.mjs.
//
//  ⚠️ Ce fichier est SERVEUR (utilise les cookies Next.js + Supabase SSR).
//     Pour les composants "use client", voir lib/data-client.ts.
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { rowToVehicule, type VehiculeRow } from "@/lib/vehicule-mapper";
import type { Vehicule } from "@/lib/types";

// Colonnes à toujours sélectionner (économise la bande passante en évitant raw_xml etc.)
const COLS = "*";

// -----------------------------------------------------------------------------
// API publique — toutes async
// -----------------------------------------------------------------------------

/** Tous les véhicules visibles sur le site (disponibles + réservés). */
export async function getVehicules(): Promise<Vehicule[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("vehicules")
    .select(COLS)
    .in("statut", ["disponible", "reserve"])
    .order("date_arrivee", { ascending: false });

  if (error) {
    console.error("[getVehicules]", error.message);
    return [];
  }
  return (data ?? []).map(rowToVehicule);
}

/** Véhicules vendus, triés du plus récent au plus ancien. */
export async function getVendus(): Promise<Vehicule[]> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("vehicules")
    .select(COLS)
    .eq("statut", "vendu")
    .order("date_sortie", { ascending: false })
    .limit(24);

  if (error) {
    console.error("[getVendus]", error.message);
    return [];
  }
  return (data ?? []).map(rowToVehicule);
}

/** Récupère un véhicule par son slug (ou null s'il n'existe pas / est masqué). */
export async function getVehiculeBySlug(slug: string): Promise<Vehicule | null> {
  const sb = await createClient();
  const { data, error } = await sb
    .from("vehicules")
    .select(COLS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getVehiculeBySlug]", error.message);
    return null;
  }
  return data ? rowToVehicule(data as VehiculeRow) : null;
}

/** 4 véhicules similaires (même modèle ou prix proche), hors la voiture courante. */
export async function getSimilaires(v: {
  id: number;
  modele: string;
  prixTtc: number;
}): Promise<Vehicule[]> {
  const all = await getVehicules();
  return all
    .filter((x) => x.id !== v.id)
    .map((x) => ({
      x,
      score: Math.abs(x.prixTtc - v.prixTtc) + (x.modele === v.modele ? -5000 : 0)
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((p) => p.x);
}

/** Slugs disponibles (pour generateStaticParams — utilise un client sans cookies). */
export async function getAllSlugs(): Promise<string[]> {
  // Import dynamique pour ne pas charger le client statique côté navigateur
  const { createStaticClient } = await import("@/lib/supabase/static");
  const sb = createStaticClient();
  const { data, error } = await sb
    .from("vehicules")
    .select("slug")
    .neq("statut", "masque");
  if (error) {
    console.error("[getAllSlugs]", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}
