#!/usr/bin/env node
/**
 * Génère un PDF récap des fonctionnalités du site AVR — utile pour un devis client.
 * Usage : npm run pdf:recap
 * Sortie : AVR-recap-fonctionnalites.pdf à la racine
 */

import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

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

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================
// DONNÉES DU RÉCAP
// ============================================
const today = new Date().toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric"
});

const sections = [
  {
    num: "01",
    icon: "🚗",
    title: "Le Parc — Catalogue de véhicules",
    rows: [
      ["Page d'accueil hero split (Parc / Atelier) avec animations", "done"],
      ["Liste véhicules avec filtres avancés (prix, km, énergie, marque, boîte, tri)", "done"],
      ["Fiches véhicules détaillées (galerie + caractéristiques + équipements)", "done"],
      ["Favoris en base de données (suit l'utilisateur sur tous ses appareils)", "done"],
      ["Comparateur jusqu'à 3 véhicules côte à côte", "done"],
      ["Partage natif (WhatsApp, SMS, mail, copier lien)", "done"],
      ["Section « Vendus récemment »", "done"],
      ["Tunnel de réservation avec acompte 5 %", "ready", "Stripe à brancher"],
      ["Demande d'essai par véhicule", "done"],
      ["Demande de reprise liée à un achat", "done"],
      ["Synchronisation automatique du stock depuis CardiffVO", "ready", "Worker prêt, FTP Bee2link à brancher"]
    ]
  },
  {
    num: "02",
    icon: "🛠️",
    title: "Atelier",
    rows: [
      ["Page atelier en one-page avec 3 sections détaillées", "done"],
      ["Sous-nav sticky avec ancres rapides", "done"],
      ["Calendrier RDV mécanique (planning indépendant)", "done"],
      ["Calendrier RDV carrosserie (planning indépendant)", "done"],
      ["Calendrier RDV contrôle technique (planning indépendant)", "done"],
      ["Hub de choix entre les 3 ateliers", "done"],
      ["Description libre / décris ta panne en étape 1", "done"],
      ["Mise en avant des agréments AXA + Direct Assurance", "done"],
      ["Horaires (Lun-Ven 9h-12h / 14h-18h)", "done"],
      ["Confirmation email + SMS + rappel J-1", "ready", "À brancher Brevo / Twilio"],
      ["Synchro agenda atelier (Cardiff / Google Calendar)", "planned"]
    ]
  },
  {
    num: "03",
    icon: "💰",
    title: "Reprise / Vente",
    rows: [
      ["Formulaire d'estimation (immat, marque, modèle, état, km, description)", "done"],
      ["Upload de pièces jointes (photos + carte grise + factures) avec drag & drop", "done"],
      ["Suivi des estimations dans l'espace client", "done"],
      ["Réception de la proposition du garage dans l'espace client", "done"],
      ["Notifications email à chaque étape", "ready", "À brancher"]
    ]
  },
  {
    num: "04",
    icon: "👤",
    title: "Espace client (compte connecté)",
    rows: [
      ["Connexion Google en 1 clic (sans mot de passe)", "done"],
      ["Onboarding obligatoire à la 1ère connexion (prénom, nom, tél, adresse)", "done"],
      ["Tableau de bord avec compteurs (favoris, estimations, réservations, RDV)", "done"],
      ["Mes favoris", "done"],
      ["Mes estimations + réponses du garage", "done"],
      ["Mes réservations + acomptes versés", "done"],
      ["Mes RDV atelier", "done"],
      ["Mes documents (PDF transmis par le garage, téléchargement sécurisé)", "done"],
      ["Modification de mes informations personnelles", "done"],
      ["Sidebar de navigation persistante", "done"]
    ]
  },
  {
    num: "05",
    icon: "🛡️",
    title: "Back-office garage (admin)",
    rows: [
      ["Page admin protégée par rôle", "ready", "Lien actif, contenu à construire"],
      ["Liste de tous les clients", "planned"],
      ["Fiche client détaillée (véhicules, docs, RDV, estimations)", "planned"],
      ["Gestion des demandes d'estimation (répondre, fixer un prix)", "planned"],
      ["Upload de documents vers un client", "planned"],
      ["Gestion des RDV (confirmer, modifier, annuler)", "planned"]
    ]
  },
  {
    num: "06",
    icon: "⚖️",
    title: "Légal & RGPD",
    rows: [
      ["Mentions légales", "done"],
      ["Conditions générales de vente", "done"],
      ["Politique de confidentialité RGPD", "done"],
      ["Gestion des cookies", "done"],
      ["Médiateur CNPA", "done"],
      ["Bloctel", "done"]
    ]
  },
  {
    num: "07",
    icon: "🎨",
    title: "Design & expérience utilisateur",
    rows: [
      ["Palette noir + rouge cohérente sur tout le site", "done"],
      ["Logo personnalisé intégré dans le bandeau", "done"],
      ["Animations d'entrée du hero (fade + zoom + halo)", "done"],
      ["Animations d'apparition au scroll", "done"],
      ["Notifications « toast » pour les actions utilisateur", "done"],
      ["Carrousel d'avis qui défile en continu", "done"],
      ["Effet hover sur les boutons du hero (diagonale qui s'élargit)", "done"],
      ["Bouton flottant « Appeler » sur mobile", "done"],
      ["Sous-nav contextuelle par univers (Parc / Atelier)", "done"],
      ["Modal de connexion personnalisée", "done"],
      ["Bandeau partenaires (logos AXA + Direct Assurance)", "done"],
      ["Responsive total (mobile, tablette, ordinateur)", "done"]
    ]
  },
  {
    num: "08",
    icon: "🔌",
    title: "Intégrations externes",
    rows: [
      ["Supabase (authentification + base de données + stockage)", "done", "Configuré et fonctionnel"],
      ["Google OAuth (connexion en 1 clic)", "done", "Configuré et fonctionnel"],
      ["Google Maps (carte de localisation)", "done"],
      ["Eurorepar (liste de prestations à jour)", "done"],
      ["Stripe (acomptes véhicules)", "ready"],
      ["CardiffVO FTP (sync du stock véhicules)", "ready", "Worker codé, identifiants à fournir"],
      ["Brevo / Resend (emails transactionnels)", "planned"],
      ["OVH / Twilio (SMS de rappel J-1)", "planned"],
      ["Google Reviews API (vrais avis Google)", "planned"]
    ]
  }
];

const stats = [
  ["38", "Routes / pages"],
  ["9", "Tables en base de données"],
  ["~3 000", "Lignes de code"],
  ["~50", "Composants React"],
  ["3", "Versions Git publiées"],
  ["0 €", "Coût infra de démarrage (free tier)"]
];

const stack = [
  "Next.js 15 (App Router, React 19)",
  "TypeScript strict",
  "Tailwind CSS",
  "Supabase (Auth + Postgres + Storage)",
  "Row Level Security activée — chaque client voit uniquement ses données",
  "Trigger SQL pour création automatique du profil",
  "Middleware d'authentification",
  "Repo GitHub avec versionnement"
];

const nextSteps = [
  ["Construction du back-office admin complet", "4-5 sessions"],
  ["Branchement Stripe en production (webhook + confirmation)", "1 session"],
  ["Branchement email transactionnel (Brevo)", "1 session"],
  ["Branchement SMS (OVH/Brevo)", "1 session"],
  ["Connexion CardiffVO (en attente des identifiants FTP)", "1 session"],
  ["Mise en ligne sur Vercel + nom de domaine personnalisé", "1 session"],
  ["5 améliorations design « premium » (polices custom, skeletons, illustrations)", "1-2 sessions"],
  ["Synchro des vrais avis Google", "1 session"]
];

// ============================================
// GÉNÉRATION HTML
// ============================================
function buildHtml() {
  const totalRows = sections.reduce((a, s) => a + s.rows.length, 0);
  const doneCount = sections.reduce(
    (a, s) => a + s.rows.filter((r) => r[1] === "done").length,
    0
  );
  const readyCount = sections.reduce(
    (a, s) => a + s.rows.filter((r) => r[1] === "ready").length,
    0
  );
  const plannedCount = sections.reduce(
    (a, s) => a + s.rows.filter((r) => r[1] === "planned").length,
    0
  );

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>AVR Automobile — Récap fonctionnalités</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, "Times New Roman", serif; color: #0a1f3a; line-height: 1.5; }
  .surtitle { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: #FF0000; }

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
    font-size: 72px;
    line-height: 0.95;
    font-weight: normal;
    letter-spacing: 0.04em;
  }
  .cover h1 .small {
    display: block;
    font-size: 24px;
    margin-top: 14px;
    color: rgba(255,255,255,0.7);
    letter-spacing: 0.4em;
  }
  .cover .red-bar { width: 60px; height: 3px; background: #FF0000; margin: 32px auto 0; }
  .cover .tagline {
    margin-top: 50px;
    font-family: system-ui, sans-serif;
    font-size: 15px;
    max-width: 600px;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
  }
  .cover .date {
    margin-top: 40px;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.3em;
    text-transform: uppercase;
  }
  .cover .label-doc {
    position: absolute;
    bottom: 60px;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  /* PAGE STANDARD */
  .page {
    page-break-after: always;
    padding: 50px 48px;
    min-height: 100vh;
    background: #fff;
  }
  .page-header {
    border-bottom: 2px solid #FF0000;
    padding-bottom: 16px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .page-header .num {
    font-family: system-ui, sans-serif;
    font-size: 28px;
    color: #FF0000;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .page-header .head-text { flex: 1; }
  .page-header .surtitle { font-size: 10px; }
  .page-header h2 {
    font-size: 28px;
    font-weight: normal;
    margin-top: 4px;
  }

  /* STATS BOXES (page intro) */
  .intro-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 24px;
  }
  .stat-card {
    background: #f9fafb;
    border-left: 3px solid #FF0000;
    padding: 18px 16px;
  }
  .stat-card .v {
    font-size: 28px;
    font-weight: 700;
    color: #0a1f3a;
  }
  .stat-card .l {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6b7280;
    margin-top: 4px;
  }

  .stack-block {
    margin-top: 28px;
    background: #f9fafb;
    padding: 18px 20px;
    border-radius: 4px;
  }
  .stack-block h3 {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #FF0000;
    margin-bottom: 12px;
  }
  .stack-block ul { list-style: none; }
  .stack-block li {
    font-family: system-ui, sans-serif;
    font-size: 12px;
    padding: 5px 0;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    gap: 10px;
  }
  .stack-block li:last-child { border-bottom: 0; }
  .stack-block li::before {
    content: "▪";
    color: #FF0000;
    flex-shrink: 0;
  }

  .summary-totals {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 24px;
  }
  .summary-totals .tot {
    border: 1px solid #e5e7eb;
    padding: 14px 16px;
    text-align: center;
  }
  .summary-totals .v {
    font-size: 24px;
    font-weight: 700;
  }
  .summary-totals .l {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #6b7280;
    margin-top: 4px;
  }
  .summary-totals .v.done { color: #16a34a; }
  .summary-totals .v.ready { color: #f59e0b; }
  .summary-totals .v.planned { color: #6b7280; }

  /* TABLEAU FEATURES */
  table.features {
    width: 100%;
    border-collapse: collapse;
    font-family: system-ui, sans-serif;
    font-size: 12px;
  }
  table.features tr { border-bottom: 1px solid #f3f4f6; }
  table.features tr:last-child { border-bottom: 0; }
  table.features td { padding: 9px 10px; vertical-align: top; }
  table.features td.feat { width: 70%; line-height: 1.5; }
  table.features td.feat .note {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    color: #6b7280;
    font-style: italic;
  }
  table.features td.status { width: 30%; text-align: right; }
  .badge {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 2px;
    font-weight: 600;
  }
  .badge.done { background: #dcfce7; color: #166534; }
  .badge.ready { background: #fef3c7; color: #92400e; }
  .badge.planned { background: #f3f4f6; color: #4b5563; }

  /* PAGE NEXT STEPS */
  .nextstep-table {
    width: 100%;
    border-collapse: collapse;
    font-family: system-ui, sans-serif;
    font-size: 13px;
    margin-top: 24px;
  }
  .nextstep-table tr { border-bottom: 1px solid #f3f4f6; }
  .nextstep-table td { padding: 12px 10px; }
  .nextstep-table td.estim {
    width: 30%;
    text-align: right;
    color: #FF0000;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.05em;
  }

  /* PIED DE PAGE FIN */
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
  .end h2 { font-size: 44px; margin-top: 12px; line-height: 1.1; font-weight: normal; }
  .end .body {
    margin-top: 24px;
    font-family: system-ui, sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    line-height: 1.7;
    max-width: 580px;
  }
  .end .contact-block {
    margin-top: 40px;
    padding-top: 28px;
    border-top: 2px solid rgba(255,255,255,0.1);
  }
  .end .contact-block .label {
    font-family: system-ui, sans-serif;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: #FF0000;
    text-transform: uppercase;
  }
  .end .contact-block .value {
    font-family: system-ui, sans-serif;
    font-size: 16px;
    color: #fff;
    margin-top: 6px;
  }
</style>
</head>
<body>

<!-- COUVERTURE -->
<div class="cover">
  <div class="surtitle">Récap des fonctionnalités</div>
  <h1>AVR<span class="small">AUTOMOBILE</span></h1>
  <div class="red-bar"></div>
  <p class="tagline">État de réalisation du site web — détail des fonctionnalités, intégrations et architecture technique. Document de référence pour le devis et le suivi de projet.</p>
  <div class="date">${escapeHtml(today)}</div>
  <div class="label-doc">Document interne · v3</div>
</div>

<!-- PAGE INTRO -->
<div class="page">
  <div class="page-header">
    <div class="num">00</div>
    <div class="head-text">
      <div class="surtitle">Vue d'ensemble</div>
      <h2>Le projet en chiffres</h2>
    </div>
  </div>

  <p style="font-family: system-ui, sans-serif; font-size: 13px; color: #374151; line-height: 1.6;">
    Site web complet pour garage multimarque + concession : vitrine du parc de véhicules d'occasion,
    atelier mécanique / carrosserie / contrôle technique, espace client privé avec authentification,
    base de données sécurisée. Conçu mobile-first, design moderne et professionnel.
  </p>

  <div class="intro-summary">
    ${stats
      .map(
        ([v, l]) => `
    <div class="stat-card">
      <div class="v">${escapeHtml(v)}</div>
      <div class="l">${escapeHtml(l)}</div>
    </div>`
      )
      .join("")}
  </div>

  <div class="stack-block">
    <h3>Stack technique</h3>
    <ul>
      ${stack.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}
    </ul>
  </div>

  <div class="summary-totals">
    <div class="tot">
      <div class="v done">${doneCount}</div>
      <div class="l">Livrées</div>
    </div>
    <div class="tot">
      <div class="v ready">${readyCount}</div>
      <div class="l">Prêtes à brancher</div>
    </div>
    <div class="tot">
      <div class="v planned">${plannedCount}</div>
      <div class="l">À venir</div>
    </div>
  </div>
  <p style="font-family: system-ui, sans-serif; font-size: 11px; color: #6b7280; text-align: center; margin-top: 10px;">
    sur ${totalRows} fonctionnalités identifiées
  </p>
</div>

${sections
  .map(
    (s) => `
<div class="page">
  <div class="page-header">
    <div class="num">${escapeHtml(s.num)}</div>
    <div class="head-text">
      <div class="surtitle">${escapeHtml(s.icon)} Module</div>
      <h2>${escapeHtml(s.title)}</h2>
    </div>
  </div>
  <table class="features">
    <tbody>
      ${s.rows
        .map(
          ([feat, status, note]) => `
        <tr>
          <td class="feat">
            ${escapeHtml(feat)}
            ${note ? `<span class="note">${escapeHtml(note)}</span>` : ""}
          </td>
          <td class="status">
            <span class="badge ${status}">${badgeLabel(status)}</span>
          </td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>`
  )
  .join("")}

<!-- PAGE NEXT STEPS -->
<div class="page">
  <div class="page-header">
    <div class="num">09</div>
    <div class="head-text">
      <div class="surtitle">À chiffrer</div>
      <h2>Prochaines étapes</h2>
    </div>
  </div>
  <p style="font-family: system-ui, sans-serif; font-size: 13px; color: #374151; margin-bottom: 16px;">
    Estimation indicative d'effort par module restant. Une session = ½ journée à 1 journée de
    développement selon complexité.
  </p>
  <table class="nextstep-table">
    <tbody>
      ${nextSteps
        .map(
          ([title, estim]) => `
        <tr>
          <td>${escapeHtml(title)}</td>
          <td class="estim">${escapeHtml(estim)}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>

<!-- FIN -->
<div class="end">
  <div class="surtitle" style="color: #FF0000;">Coordonnées</div>
  <h2>AVR Automobile</h2>
  <p class="body">
    Garage multimarque indépendant à Couëron (44).
    Vente de véhicules d'occasion, mécanique, carrosserie et contrôle technique.
    Site web propulsé par Next.js + Supabase, déployable instantanément sur Vercel.
  </p>
  <div class="contact-block">
    <div class="label">Adresse</div>
    <div class="value">27 rue des Maraîchers, 44220 Couëron</div>
  </div>
  <div class="contact-block">
    <div class="label">Téléphone</div>
    <div class="value">02 40 86 21 02</div>
  </div>
  <div class="contact-block">
    <div class="label">Horaires</div>
    <div class="value">Lundi – Vendredi · 9h-12h / 14h-18h</div>
  </div>
</div>

</body>
</html>`;
}

function badgeLabel(status) {
  if (status === "done") return "Livré";
  if (status === "ready") return "Prêt à brancher";
  if (status === "planned") return "À venir";
  return "—";
}

// ============================================
// MAIN
// ============================================
async function main() {
  const chrome = findChrome();
  if (!chrome) {
    console.error("❌ Aucun navigateur Chrome / Edge trouvé sur le système.");
    process.exit(1);
  }

  const outDir = path.resolve("apercu");
  await fs.mkdir(outDir, { recursive: true });

  const html = buildHtml();
  const htmlPath = path.join(outDir, "recap-fonctionnalites.html");
  await fs.writeFile(htmlPath, html);

  console.log("🚀 Lancement du navigateur...");
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true
  });

  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "domcontentloaded" });

  console.log("📄 Génération du PDF...");
  const pdfPath = path.resolve("AVR-recap-fonctionnalites.pdf");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();

  const stats = await fs.stat(pdfPath);
  console.log(`\n✅ PDF généré : ${pdfPath}`);
  console.log(`   Taille : ${(stats.size / 1024).toFixed(0)} Ko\n`);
}

main().catch((e) => {
  console.error("\n❌ Erreur :", e);
  process.exit(1);
});
