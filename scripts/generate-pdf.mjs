#!/usr/bin/env node
/**
 * Génère un PDF de présentation du site AVR pour démarcher des prospects.
 *
 * Prérequis : le serveur dev tourne (`npm run dev` dans un autre terminal).
 * Usage     : `npm run pdf`
 *
 * Le PDF est créé à la racine du projet : AVR-Automobile-presentation.pdf
 */

import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const BASE = process.env.SITE_URL ?? "http://localhost:3000";

const PAGES = [
  {
    url: "/",
    title: "Accueil",
    caption:
      "Hero split avec image plein écran, animations d'entrée et 2 univers clairement identifiés (Parc / Atelier)."
  },
  {
    url: "/vehicules",
    title: "Nos véhicules",
    caption:
      "Liste avec filtres avancés (prix, km, énergie, marque, boîte), favoris et comparateur intégrés à chaque carte."
  },
  {
    url: "/vehicules/renault-clio-v-345678",
    title: "Fiche véhicule détaillée",
    caption:
      "Galerie photos, prix mis en avant, caractéristiques complètes, équipements, CTA Réserver / Essayer / Reprise, partage natif."
  },
  {
    url: "/atelier",
    title: "Atelier — page tout-en-un",
    caption:
      "Hero avec aperçu des 3 services, puis sections dédiées Carrosserie, Mécanique, Contrôle technique. Bloc « Décrivez votre panne » exclusif au mécanique."
  },
  {
    url: "/atelier/rdv",
    title: "Hub de prise de RDV",
    caption:
      "Choix entre 3 calendriers indépendants (mécanique, carrosserie, contrôle technique)."
  },
  {
    url: "/atelier/mecanique/rdv",
    title: "Calendrier RDV mécanique",
    caption:
      "Calendrier visuel : choix de la prestation puis du créneau, avec étape 1/2/3 et confirmation par email + SMS."
  },
  {
    url: "/vendre-reprendre",
    title: "Vendre / Reprendre",
    caption:
      "Formulaire complet avec upload de photos et documents (drag & drop, aperçus, limite de taille)."
  },
  {
    url: "/contact",
    title: "Contact",
    caption: "Coordonnées, horaires, carte Google Maps embarquée, formulaire de message."
  }
];

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
];

function findChrome() {
  for (const p of CHROME_CANDIDATES) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function ensureDevServer() {
  try {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    console.error(`\n❌ Le serveur dev n'est pas accessible sur ${BASE}.`);
    console.error(`   Lancez "npm run dev" dans un autre terminal, puis relancez ce script.\n`);
    process.exit(1);
  }
}

async function waitForImages(page) {
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map((img) =>
        img.complete ? Promise.resolve() : new Promise((r) => { img.onload = r; img.onerror = r; })
      )
    )
  );
}

async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("❌ Aucun navigateur Chrome / Edge trouvé sur le système.");
    process.exit(1);
  }
  console.log(`🌐 Chrome détecté : ${chrome}`);

  await ensureDevServer();

  const outDir = path.resolve("apercu");
  await fs.mkdir(outDir, { recursive: true });

  console.log("🚀 Lancement du navigateur headless...\n");
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  const screenshots = [];

  for (const [i, p] of PAGES.entries()) {
    const num = String(i + 1).padStart(2, "0");
    const safeName = p.url.replace(/[/?&=]/g, "_").replace(/^_+/, "") || "home";
    const filename = `${num}-${safeName}.png`;
    const filepath = path.join(outDir, filename);

    console.log(`📸 [${num}] ${p.title} → ${p.url}`);
    try {
      await page.goto(`${BASE}${p.url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      // laisser jouer les animations d'entrée et tenter de charger les images
      try {
        await Promise.race([
          waitForImages(page),
          new Promise((r) => setTimeout(r, 5000))
        ]);
      } catch {
        /* tant pis, on continue avec ce qui est chargé */
      }
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: filepath, fullPage: true });
      screenshots.push({ ...p, filepath, filename });
    } catch (e) {
      console.warn(`   ⚠  ${p.url} a échoué : ${e.message}`);
    }
  }

  console.log("\n📄 Assemblage du PDF...");
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const html = buildHtml(screenshots, today);
  const htmlPath = path.join(outDir, "presentation.html");
  await fs.writeFile(htmlPath, html);

  const pdfPage = await browser.newPage();
  await pdfPage.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded" });
  await waitForImages(pdfPage);
  await new Promise((r) => setTimeout(r, 600));

  const pdfPath = path.resolve("AVR-Automobile-presentation.pdf");
  await pdfPage.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();

  console.log(`\n✅ PDF généré : ${pdfPath}`);
  console.log(`📂 Captures unitaires dans : ${outDir}\n`);
}

function buildHtml(screenshots, today) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>AVR Automobile — Aperçu du site</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; color: #0a1f3a; }
  .surtitle {
    font-family: system-ui, sans-serif;
    font-size: 12px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #FF0000;
  }
  /* COUVERTURE */
  .cover {
    height: 100vh;
    page-break-after: always;
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 60px;
  }
  .cover .surtitle { color: #FF0000; margin-bottom: 28px; }
  .cover h1 {
    font-size: 88px;
    line-height: 0.95;
    font-weight: normal;
    letter-spacing: 0.05em;
  }
  .cover h1 .auto {
    display: block;
    font-size: 28px;
    margin-top: 14px;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.4em;
  }
  .cover .date {
    margin-top: 40px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }
  .cover .tagline {
    margin-top: 60px;
    font-family: system-ui, sans-serif;
    font-size: 16px;
    max-width: 620px;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
  }
  .cover .red-bar {
    width: 60px;
    height: 3px;
    background: #FF0000;
    margin: 24px auto 0;
  }
  /* PAGES INTERMÉDIAIRES */
  .page {
    page-break-after: always;
    padding: 36px 40px;
    min-height: 100vh;
    background: #fff;
  }
  .page-header { border-bottom: 2px solid #FF0000; padding-bottom: 14px; margin-bottom: 20px; }
  .page-header .num {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    color: #FF0000;
    text-transform: uppercase;
  }
  .page-header h2 { font-size: 32px; margin-top: 6px; font-weight: normal; }
  .page-header .caption {
    font-family: system-ui, sans-serif;
    font-size: 13px;
    color: #555;
    margin-top: 8px;
    line-height: 1.5;
    max-width: 720px;
  }
  .page img {
    width: 100%;
    height: auto;
    border: 1px solid #e5e7eb;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }
  /* FIN */
  .end {
    page-break-after: avoid;
    padding: 80px 60px;
    background: #000;
    color: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .end h2 { font-size: 48px; margin-top: 16px; line-height: 1.1; font-weight: normal; }
  .end .body {
    margin-top: 24px;
    font-family: system-ui, sans-serif;
    font-size: 15px;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    max-width: 620px;
  }
  .end ul { margin-top: 28px; list-style: none; padding: 0; font-family: system-ui, sans-serif; }
  .end li {
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    gap: 14px;
    font-size: 13px;
  }
  .end li::before { content: "✓"; color: #FF0000; flex-shrink: 0; }
</style>
</head>
<body>

<!-- COUVERTURE -->
<div class="cover">
  <div class="surtitle">Aperçu du site web</div>
  <h1>AVR<span class="auto">AUTOMOBILE</span></h1>
  <div class="red-bar"></div>
  <p class="tagline">Vente de véhicules d'occasion, atelier mécanique, carrosserie et contrôle technique. Une vitrine moderne, mobile-first, pensée pour la conversion.</p>
  <div class="date">${today}</div>
</div>

${screenshots
  .map(
    (s, i) => `
<div class="page">
  <div class="page-header">
    <div class="num">${String(i + 1).padStart(2, "0")} · ${escapeHtml(s.url)}</div>
    <h2>${escapeHtml(s.title)}</h2>
    <div class="caption">${escapeHtml(s.caption)}</div>
  </div>
  <img src="${escapeHtml(s.filepath.replace(/\\/g, "/"))}" alt="${escapeHtml(s.title)}" />
</div>
`
  )
  .join("")}

<!-- PAGE DE FIN -->
<div class="end">
  <div class="surtitle">Ce que le site offre</div>
  <h2>Plateforme complète,<br/>prête à l'emploi.</h2>
  <p class="body">Le site n'est pas une simple vitrine : c'est un outil business pensé pour générer des rendez-vous et qualifier les leads.</p>
  <ul>
    <li>Hero animé deux univers (Parc / Atelier) avec image plein écran</li>
    <li>Filtres véhicules avancés + tri + recherche par prix, km, énergie, marque</li>
    <li>Favoris stockés dans le navigateur, comparateur jusqu'à 3 véhicules côte à côte</li>
    <li>Fiches véhicule complètes avec galerie photo et partage natif (WhatsApp, SMS, mail)</li>
    <li>3 calendriers de RDV indépendants : mécanique, carrosserie, contrôle technique</li>
    <li>Bloc « Décrivez votre panne » pré-remplit la demande de diagnostic</li>
    <li>Formulaire de reprise avec upload de photos et documents (drag & drop)</li>
    <li>Section partenaires AXA & Direct Assurance avec vrais logos</li>
    <li>Bouton flottant d'appel direct sur mobile</li>
    <li>Notifications toast pour confirmer chaque action</li>
    <li>Sticky nav contextuelle par univers</li>
    <li>Pages légales complètes : mentions, CGV, RGPD, médiateur CNPA, Bloctel</li>
    <li>Compatible smartphone, tablette, ordinateur — design responsive intégral</li>
    <li>Architecture Next.js moderne, prête pour la synchro CardiffVO et Stripe</li>
  </ul>
</div>

</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

main().catch((e) => {
  console.error("\n❌ Erreur :", e);
  process.exit(1);
});
