// =============================================================================
//  Couche de données véhicules — version CLIENT.
//  Utilise le client Supabase navigateur (clé anon + RLS).
//  Pour les server components / route handlers, voir lib/data.ts.
// =============================================================================

"use client";

import { createClient } from "@/lib/supabase/client";
import { rowToVehicule } from "@/lib/vehicule-mapper";
import type { Vehicule } from "@/lib/types";

const COLS = "*";

/** Tous les véhicules visibles (disponibles + réservés). */
export async function getVehiculesClient(): Promise<Vehicule[]> {
  const sb = createClient();
  const { data, error } = await sb
    .from("vehicules")
    .select(COLS)
    .in("statut", ["disponible", "reserve"])
    .order("date_arrivee", { ascending: false });

  if (error) {
    console.error("[getVehiculesClient]", error.message);
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => rowToVehicule(r));
}

/** Map slug → Vehicule pour résoudre rapidement les listes (favoris, comparer). */
export async function getVehiculesBySlugsClient(slugs: string[]): Promise<Vehicule[]> {
  if (slugs.length === 0) return [];
  const sb = createClient();
  const { data, error } = await sb
    .from("vehicules")
    .select(COLS)
    .in("slug", slugs)
    .neq("statut", "masque");

  if (error) {
    console.error("[getVehiculesBySlugsClient]", error.message);
    return [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => rowToVehicule(r));
}
