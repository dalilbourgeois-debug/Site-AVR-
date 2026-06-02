// =============================================================================
//  Mapper Supabase row → Vehicule TypeScript
//  Module NEUTRE (sans dépendance server/client) — importable des 2 côtés.
// =============================================================================

import type { Vehicule, Statut } from "@/lib/types";

export type VehiculeRow = {
  id: number;
  vin: string;
  slug: string;
  marque: string | null;
  modele: string | null;
  version: string | null;
  annee: number | null;
  carrosserie: string | null;
  couleur_ext: string | null;
  couleur_int: string | null;
  energie: string | null;
  boite: string | null;
  nb_portes: number | null;
  nb_places: number | null;
  cylindree: number | null;
  puissance_fisc: number | null;
  puissance_reel: number | null;
  transmission: string | null;
  date_mec: string | null;
  kilometrage: number | null;
  km_garanti: boolean | null;
  premiere_main: boolean | null;
  garantie_duree: string | null;
  garantie_libelle: string | null;
  prix_ttc: number | string | null;
  co2: number | null;
  crit_air: string | null;
  commentaire_public: string | null;
  equip_serie: string[] | null;
  equip_option: string[] | null;
  equip_perso: string[] | null;
  soh: number | null;
  autonomie: number | null;
  capacite_bat: number | string | null;
  temps_recharge: string | null;
  statut: Statut;
  date_arrivee: string;
  date_sortie: string | null;
  photos: string[] | null;
  alaune: boolean | null;
};

export function rowToVehicule(r: VehiculeRow): Vehicule {
  return {
    id: r.id,
    vin: r.vin,
    slug: r.slug,
    marque: r.marque ?? "",
    modele: r.modele ?? "",
    version: r.version ?? "",
    annee: r.annee ?? 0,
    carrosserie: r.carrosserie ?? undefined,
    couleurExt: r.couleur_ext ?? undefined,
    couleurInt: r.couleur_int ?? undefined,
    energie: r.energie ?? "",
    boite: r.boite ?? "",
    nbPortes: r.nb_portes ?? undefined,
    nbPlaces: r.nb_places ?? undefined,
    puissanceFisc: r.puissance_fisc ?? undefined,
    puissanceReel: r.puissance_reel ?? undefined,
    transmission: r.transmission ?? undefined,
    dateMec: r.date_mec ?? "",
    kilometrage: r.kilometrage ?? 0,
    kmGaranti: r.km_garanti ?? undefined,
    premiereMain: r.premiere_main ?? undefined,
    garantieDuree: r.garantie_duree ?? undefined,
    garantieLibelle: r.garantie_libelle ?? undefined,
    prixTtc: Number(r.prix_ttc ?? 0),
    co2: r.co2 ?? undefined,
    critAir: r.crit_air ?? undefined,
    commentairePublic: r.commentaire_public ?? undefined,
    equipSerie: r.equip_serie ?? undefined,
    equipOption: r.equip_option ?? undefined,
    equipPerso: r.equip_perso ?? undefined,
    soh: r.soh ?? undefined,
    autonomie: r.autonomie ?? undefined,
    capaciteBat: r.capacite_bat == null ? undefined : Number(r.capacite_bat),
    tempsRecharge: r.temps_recharge ?? undefined,
    statut: r.statut,
    dateArrivee: r.date_arrivee,
    dateSortie: r.date_sortie ?? undefined,
    photos: r.photos ?? [],
    alaune: r.alaune ?? undefined
  };
}
