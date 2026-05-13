#!/usr/bin/env node
// Worker de synchronisation CardiffVO → base AVR.
// Récupère tt4Basic.xml sur le FTP Bee2link, parse, met à jour la table vehicules,
// télécharge les nouvelles photos.
//
// Exécution :
//   node scripts/sync-cardiff.mjs
// Cron suggéré :
//   0 6 * * *   cd /var/www/avr && node scripts/sync-cardiff.mjs >> /var/log/avr-sync.log 2>&1
//
// Variables d'env requises : voir .env.example

import { Client as FtpClient } from "basic-ftp";
import { XMLParser } from "fast-xml-parser";
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";

const cfg = {
  host: process.env.CARDIFF_FTP_HOST,
  user: process.env.CARDIFF_FTP_USER,
  password: process.env.CARDIFF_FTP_PASSWORD,
  file: process.env.CARDIFF_FTP_FILE ?? "tt4Basic.xml",
  storageDir: process.env.STORAGE_DIR ?? path.resolve(process.cwd(), "public/uploads/vehicules")
};

function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function downloadXmlFromFtp() {
  if (!cfg.host || !cfg.user || !cfg.password) {
    throw new Error("FTP non configuré : renseignez CARDIFF_FTP_HOST / USER / PASSWORD dans .env");
  }
  const client = new FtpClient();
  client.ftp.verbose = false;
  await client.access({ host: cfg.host, user: cfg.user, password: cfg.password, secure: false });
  const localTmp = path.resolve(process.cwd(), "tmp", cfg.file);
  await fs.mkdir(path.dirname(localTmp), { recursive: true });
  await client.downloadTo(localTmp, cfg.file);
  client.close();
  return localTmp;
}

function parseXml(xmlString) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@",
    arrayMode: false
  });
  return parser.parse(xmlString);
}

/**
 * Mappe un noeud "Vehicule" du flux CardiffVO vers la structure BDD AVR.
 * Les noms de champs précis dépendent du XSD tt4Basic — adaptez après réception du flux réel.
 */
function mapVehicule(node) {
  const vin = node.VehiculeVin ?? node.VIN ?? node.vin;
  if (!vin) return null;

  const marque = node.VehiculeMarque ?? node.Marque ?? "";
  const modele = node.VehiculeModele ?? node.Modele ?? "";
  const version = node.VehiculeVersion ?? node.Version ?? "";

  const slug = `${slugify(`${marque}-${modele}`)}-${vin.slice(-6).toLowerCase()}`;

  const photoUrls = []
    .concat(node.VehiculePhotosUrl?.PhotoUrl ?? [])
    .filter(Boolean)
    .map((p) => (typeof p === "string" ? p : p["#text"] ?? p));

  return {
    vin,
    slug,
    marque,
    modele,
    version,
    annee: numOrNull(node.VehiculeAnnee),
    carrosserie: node.VehiculeCarrosserie ?? null,
    couleur_ext: node.VehiculeCouleurExt ?? null,
    couleur_int: node.VehiculeCouleurInt ?? null,
    energie: node.VehiculeEnergie ?? null,
    boite: node.VehiculeBoite ?? null,
    nb_portes: numOrNull(node.VehiculeNbPortes),
    nb_places: numOrNull(node.VehiculeNbPlaces),
    puissance_fisc: numOrNull(node.VehiculePuissanceFisc),
    puissance_reel: numOrNull(node.VehiculePuissanceReel),
    date_mec: node.VehiculeDateMec ?? null,
    kilometrage: numOrNull(node.VehiculeKilometrage),
    km_garanti: boolOrNull(node.VehiculeKmGaranti),
    prix_ttc: numOrNull(node.VehiculePrixTtc),
    co2: numOrNull(node.VehiculeCo2),
    crit_air: node.VehiculeCritAir ?? null,
    commentaire_public: node.VehiculeCommentairePublic ?? null,
    equip_serie: arrOrNull(node.VehiculeEquipementsSerie?.Equipement),
    equip_option: arrOrNull(node.VehiculeEquipementsOption?.Equipement),
    equip_perso: arrOrNull(node.VehiculeEquipementsPerso?.Equipement),
    soh: numOrNull(node.VehiculeSOH),
    autonomie: numOrNull(node.VehiculeAutonomie),
    capacite_bat: numOrNull(node.VehiculeCapaciteBatterie),
    temps_recharge: node.VehiculeTempsRecharge ?? null,
    photos: photoUrls
  };
}

function numOrNull(v) {
  if (v == null) return null;
  const n = Number(v);
  return isFinite(n) ? n : null;
}
function boolOrNull(v) {
  if (v == null) return null;
  return ["true", "1", "oui", "yes"].includes(String(v).toLowerCase());
}
function arrOrNull(v) {
  if (!v) return null;
  return Array.isArray(v) ? v : [v];
}

async function downloadPhoto(url, destDir, position) {
  await fs.mkdir(destDir, { recursive: true });
  const ext = path.extname(new URL(url).pathname) || ".jpg";
  const dest = path.join(destDir, `photo-${position}${ext}`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Téléchargement échoué ${url} : ${res.status}`);
  const fileStream = createWriteStream(dest);
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  return dest;
}

/**
 * Persistence : ici on logge uniquement. À brancher sur Postgres
 * (pg, drizzle, prisma) au moment de la mise en prod.
 */
async function upsertVehicule(v) {
  console.log(`[upsert] ${v.vin} — ${v.marque} ${v.modele}`);
  // TODO :
  //   const existing = await pg.query('SELECT id, statut FROM vehicules WHERE vin = $1', [v.vin]);
  //   if (existing.rowCount === 0) INSERT INTO vehicules ...
  //   else UPDATE vehicules SET ... WHERE vin = $1
  //   (NE PAS écraser statut = 'reserve' ou 'vendu')
}

async function markMissingAsSold(vinSet) {
  console.log(`[diff] VINs reçus : ${vinSet.size}`);
  // TODO :
  //   UPDATE vehicules
  //   SET statut = 'vendu', date_sortie = NOW()
  //   WHERE statut = 'disponible'
  //     AND vin NOT IN (...)
  //     AND last_sync < NOW() - INTERVAL '24 hours'
}

async function main() {
  console.log("=== Sync CardiffVO — démarrage ===");
  let xmlPath;
  if (process.argv.includes("--local") && process.argv.includes("--file")) {
    const i = process.argv.indexOf("--file");
    xmlPath = process.argv[i + 1];
  } else {
    xmlPath = await downloadXmlFromFtp();
  }

  const xml = await fs.readFile(xmlPath, "utf8");
  const parsed = parseXml(xml);

  // Racine probable : <Vehicules><Vehicule>...</Vehicule></Vehicules> — à adapter au XSD réel
  const rawList = parsed?.Vehicules?.Vehicule ?? parsed?.vehicules?.vehicule ?? [];
  const list = Array.isArray(rawList) ? rawList : [rawList];

  const vinSet = new Set();
  let added = 0;
  let updated = 0;

  for (const node of list) {
    const v = mapVehicule(node);
    if (!v) continue;
    vinSet.add(v.vin);

    const destDir = path.join(cfg.storageDir, v.vin);
    for (let i = 0; i < v.photos.length; i++) {
      try {
        await downloadPhoto(v.photos[i], destDir, i + 1);
      } catch (e) {
        console.warn(`[photo] ${v.vin} #${i + 1} échec : ${e.message}`);
      }
    }

    await upsertVehicule(v);
    updated++;
  }

  await markMissingAsSold(vinSet);

  console.log(`=== Sync terminé : ${updated} véhicules traités, ${added} ajoutés ===`);
}

main().catch((e) => {
  console.error("Sync erreur :", e);
  process.exit(1);
});
