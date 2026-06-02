#!/usr/bin/env node
// =============================================================================
//  Sync CardiffVO/Bee2link → Supabase
// =============================================================================
//  Récupère bigq.xml sur le FTP publicationvo.com, parse les véhicules,
//  upsert dans la table public.vehicules de Supabase.
//
//  Protections :
//    1. Anti-flicker : un véhicule absent du XML pendant 2 syncs consécutifs
//       est marqué "vendu" (évite les disparitions temporaires).
//    2. Les véhicules réservés (statut="reserve") ne sont jamais
//       automatiquement marqués vendus — gestion manuelle après livraison.
//    3. Le statut "masque" (caché manuellement par l'admin) est respecté.
//
//  Variables d'env requises :
//    NEXT_PUBLIC_SUPABASE_URL
//    SUPABASE_SERVICE_ROLE_KEY
//    CARDIFF_FTP_HOST
//    CARDIFF_FTP_USER
//    CARDIFF_FTP_PASSWORD
//    CARDIFF_FTP_FILE      (défaut : datas/bigq.xml)
//
//  Exécution :
//    node --env-file=.env.local scripts/sync-cardiff.mjs
//
//  Cron (production) :
//    0 6 * * *   cd /var/www/avr && /usr/bin/node --env-file=.env.local \
//                scripts/sync-cardiff.mjs >> /var/log/avr-sync.log 2>&1
// =============================================================================

import { Client as FtpClient } from "basic-ftp";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs/promises";
import path from "node:path";

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
const cfg = {
  supaUrl:   process.env.NEXT_PUBLIC_SUPABASE_URL,
  supaKey:   process.env.SUPABASE_SERVICE_ROLE_KEY,
  ftpHost:   process.env.CARDIFF_FTP_HOST,
  ftpUser:   process.env.CARDIFF_FTP_USER,
  ftpPass:   process.env.CARDIFF_FTP_PASSWORD,
  ftpFile:   process.env.CARDIFF_FTP_FILE ?? "datas/bigq.xml",
  missMax:   Number(process.env.SYNC_MISS_MAX ?? 2), // anti-flicker
  tmpDir:    path.resolve(process.cwd(), "tmp")
};

for (const k of ["supaUrl", "supaKey", "ftpHost", "ftpUser", "ftpPass"]) {
  if (!cfg[k]) {
    console.error(`[FATAL] Variable d'env manquante : ${k}`);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function slugify(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numOrNull(v) {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function intOrNull(v) {
  const n = numOrNull(v);
  return n == null ? null : Math.round(n);
}

function boolFromFr(v) {
  if (v == null) return null;
  const s = String(v).trim().toLowerCase();
  if (["oui", "yes", "true", "1", "garanti"].includes(s)) return true;
  if (["non", "no", "false", "0"].includes(s)) return false;
  return null;
}

// Cardiff stocke des listes séparées par "|" — ex: "ABS|Airbag|Climatisation"
function pipeArray(v) {
  if (!v) return [];
  return String(v).split("|").map((s) => s.trim()).filter(Boolean);
}

// "22-12-2016" (FR) → "2016-12-22" (ISO)
function dateMecToIso(v) {
  if (!v) return null;
  const m = String(v).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

// -----------------------------------------------------------------------------
// FTP : télécharge le XML
// -----------------------------------------------------------------------------
async function downloadXml() {
  await fs.mkdir(cfg.tmpDir, { recursive: true });
  const local = path.join(cfg.tmpDir, path.basename(cfg.ftpFile));

  const client = new FtpClient(20_000);
  client.ftp.verbose = false;
  try {
    await client.access({
      host: cfg.ftpHost,
      user: cfg.ftpUser,
      password: cfg.ftpPass,
      secure: false
    });
    await client.downloadTo(local, cfg.ftpFile);
  } finally {
    client.close();
  }

  const stat = await fs.stat(local);
  console.log(`[ftp] ${cfg.ftpFile} téléchargé (${(stat.size / 1024).toFixed(1)} KB)`);
  return local;
}

// -----------------------------------------------------------------------------
// XML → tableau de véhicules normalisés
// -----------------------------------------------------------------------------
function parseStock(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    parseTagValue: false,
    trimValues: true
  });
  const root = parser.parse(xmlString);
  const rawList = root?.Stock?.Vehicule ?? [];
  return Array.isArray(rawList) ? rawList : [rawList];
}

function mapVehicule(node) {
  // Identifiant unique Cardiff (sert de VIN logique)
  const idCardiff = String(node.VehiculeIdentifiant ?? "").trim();
  if (!idCardiff) return null;

  const marque  = String(node.VehiculeMarque ?? "").trim();
  const modele  = String(node.VehiculeModele ?? "").trim();
  const version = String(node.VehiculeVersion ?? "").trim();

  // Slug stable et lisible : marque-modele-id (les 6 derniers chiffres)
  const slug = `${slugify(`${marque}-${modele}`)}-${idCardiff.slice(-6)}`;

  // Photos : URLs HTTPS séparées par "|"
  const photos = pipeArray(node.VehiculePhotosUrl);

  return {
    vin:                idCardiff,
    slug,
    marque,
    modele,
    version,
    annee:              intOrNull(node.VehiculeAnnee),
    carrosserie:        node.VehiculeCategorie || node.VehiculeCarrosserie || null,
    couleur_ext:        node.VehiculeCouleurExterieure || null,
    couleur_int:        node.VehiculeCouleurInterieure || null,
    energie:            node.VehiculeEnergie || null,
    boite:              node.VehiculeBoite || null,
    nb_portes:          intOrNull(node.VehiculeNbPortes),
    nb_places:          intOrNull(node.VehiculeNbPlaces),
    cylindree:          intOrNull(node.VehiculeCylindree),
    puissance_fisc:     intOrNull(node.VehiculePuissanceFiscale),
    puissance_reel:     intOrNull(node.VehiculePuissanceReelle),
    transmission:       node.VehiculeTransmission || null,
    date_mec:           dateMecToIso(node.VehiculeDate1Mec),
    kilometrage:        intOrNull(node.VehiculeKilometrage),
    km_garanti:         boolFromFr(node.VehiculeKmGaranti),
    premiere_main:      boolFromFr(node.VehiculePremiereMain),
    garantie_duree:     node.VehiculeGarantieDuree ? `${node.VehiculeGarantieDuree} mois` : null,
    garantie_libelle:   node.VehiculeGarantie || null,
    prix_ttc:           numOrNull(node.VehiculePrixVenteTTC),
    co2:                intOrNull(node.VehiculeCo2),
    crit_air:           node.CritairLibelle ? String(node.CritairLibelle).replace(/CRIT'?Air\s*/i, "") : null,
    commentaire_public: node.VehiculeCommentairePublic || null,
    equip_serie:        pipeArray(node.VehiculeEquipementsSerie),
    equip_option:       pipeArray(node.VehiculeEquipementsOption),
    equip_perso:        pipeArray(node.VehiculeEquipementsPerso),
    soh:                intOrNull(node.SOH),
    autonomie:          intOrNull(node.VehiculeAutonomie),
    capacite_bat:       numOrNull(node.VehiculeCapaciteBatterie),
    temps_recharge:     node.VehiculeTempsRecharge || null,
    photos
  };
}

// -----------------------------------------------------------------------------
// Supabase REST (sans SDK pour éviter le souci WebSocket en Node 20)
// -----------------------------------------------------------------------------
async function sb(method, pathQuery, body, extraHeaders = {}) {
  const url = `${cfg.supaUrl}/rest/v1/${pathQuery}`;
  const res = await fetch(url, {
    method,
    headers: {
      apikey: cfg.supaKey,
      Authorization: `Bearer ${cfg.supaKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...extraHeaders
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${method} ${pathQuery} → ${res.status} ${text}`);
  }
  // Retourne JSON quand possible (header Prefer "return=representation"), sinon null
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? res.json() : null;
}

async function fetchExistingVins() {
  const url = `${cfg.supaUrl}/rest/v1/vehicules?select=vin,statut,miss_count,alaune`;
  const res = await fetch(url, {
    headers: { apikey: cfg.supaKey, Authorization: `Bearer ${cfg.supaKey}` }
  });
  if (!res.ok) throw new Error(`[fetch existing] ${res.status} ${await res.text()}`);
  return res.json(); // [{ vin, statut, miss_count, alaune }, ...]
}

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------
async function main() {
  const t0 = Date.now();
  console.log("=== Sync Cardiff → Supabase ===");

  // 1. Télécharge le XML
  const xmlPath = await downloadXml();
  const xml = await fs.readFile(xmlPath, "utf8");

  // 2. Parse les véhicules
  const nodes = parseStock(xml);
  const records = nodes.map(mapVehicule).filter(Boolean);
  console.log(`[parse] ${records.length} véhicules valides`);

  if (records.length === 0) {
    console.warn("[WARN] Aucun véhicule dans le XML — abort pour ne pas marquer tout en vendu");
    return;
  }

  // 3. Récupère ce qui est déjà en BDD pour comparaison
  const existing = await fetchExistingVins();
  const existingByVin = new Map(existing.map((v) => [v.vin, v]));
  console.log(`[db] ${existing.length} véhicules existants en BDD`);

  // 4. Upsert chaque véhicule (sauf ceux en "reserve" ou "masque" → on les laisse intacts côté statut)
  //    On respecte aussi le flag "alaune" si déjà set par l'admin.
  let inserted = 0;
  let updated  = 0;
  const seenVins = new Set();

  for (const rec of records) {
    seenVins.add(rec.vin);
    const exists = existingByVin.get(rec.vin);

    // Anti-régression statut : si déjà "reserve" ou "masque", on garde
    const finalStatut =
      exists && (exists.statut === "reserve" || exists.statut === "masque")
        ? exists.statut
        : "disponible";

    const payload = {
      ...rec,
      statut: finalStatut,
      last_sync: new Date().toISOString(),
      miss_count: 0,
      // Conserve le flag "à la une" s'il est déjà set
      alaune: exists?.alaune ?? false
    };

    // Pour les nouveaux, set date_arrivee
    if (!exists) {
      payload.date_arrivee = new Date().toISOString();
    }

    // Upsert (sur conflit vin → update)
    await sb(
      "POST",
      "vehicules?on_conflict=vin",
      [payload],
      { Prefer: "resolution=merge-duplicates,return=minimal" }
    );

    if (exists) updated++; else inserted++;
  }

  // 5. Gestion des disparus (anti-flicker)
  const missingVins = existing
    .filter((v) => !seenVins.has(v.vin))
    .filter((v) => v.statut === "disponible"); // on ignore déjà vendu/reserve/masque

  let marquesVendu = 0;
  let increments = 0;

  for (const m of missingVins) {
    const newMiss = (m.miss_count ?? 0) + 1;
    if (newMiss >= cfg.missMax) {
      // Confirme la vente
      await sb(
        "PATCH",
        `vehicules?vin=eq.${encodeURIComponent(m.vin)}`,
        { statut: "vendu", date_sortie: new Date().toISOString(), miss_count: newMiss }
      );
      marquesVendu++;
    } else {
      // Incrémente le compteur sans changer statut
      await sb(
        "PATCH",
        `vehicules?vin=eq.${encodeURIComponent(m.vin)}`,
        { miss_count: newMiss }
      );
      increments++;
    }
  }

  // 6. Récap
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    [
      "=== Sync terminé en " + dt + "s ===",
      `  ➕ Ajoutés        : ${inserted}`,
      `  🔁 Mis à jour     : ${updated}`,
      `  ⏳ Disparus (avt confirmation vendu) : ${increments}`,
      `  ✅ Marqués vendus : ${marquesVendu}`,
      `  📦 Total stock dispo désormais       : ${inserted + updated - marquesVendu}`
    ].join("\n")
  );
}

main().catch((e) => {
  console.error("[FATAL] Sync échouée :", e);
  process.exit(1);
});
