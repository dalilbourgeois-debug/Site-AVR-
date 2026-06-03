// =============================================================================
//  Génère un document Word (.docx) avec tous les credentials du projet AVR.
//  Le fichier est sauvegardé sur le Bureau de l'utilisateur.
// =============================================================================

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} from "docx";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CELL_MARGINS = { top: 100, bottom: 100, left: 150, right: 150 };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun(text)]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun(text)]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [new TextRun({ text, ...opts })]
  });
}

function pBold(text) {
  return p(text, { bold: true });
}

function pItalic(text) {
  return p(text, { italics: true, color: "666666" });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun(text)]
  });
}

function bulletBold(label, value) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [
      new TextRun({ text: label + " : ", bold: true }),
      new TextRun(value)
    ]
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")] });
}

function infoTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3000, 6360],
    rows: rows.map(([label, value, isMissing]) => new TableRow({
      children: [
        new TableCell({
          borders: BORDERS,
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
          margins: CELL_MARGINS,
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })]
        }),
        new TableCell({
          borders: BORDERS,
          width: { size: 6360, type: WidthType.DXA },
          shading: isMissing ? { fill: "FFF3CD", type: ShadingType.CLEAR } : undefined,
          margins: CELL_MARGINS,
          children: [new Paragraph({
            children: [new TextRun({
              text: value,
              size: 20,
              color: isMissing ? "856404" : "000000",
              italics: isMissing
            })]
          })]
        })
      ]
    }))
  });
}

function fillMe(hint = "à compléter") {
  return `[ ${hint.toUpperCase()} ]`;
}

// -----------------------------------------------------------------------------
// Contenu du document
// -----------------------------------------------------------------------------

const today = new Date().toLocaleDateString("fr-FR", {
  day: "2-digit", month: "long", year: "numeric"
});

const content = [
  // -----------------------------------------------------------
  // COUVERTURE
  // -----------------------------------------------------------
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2000, after: 400 },
    children: [new TextRun({ text: "AVR AUTOMOBILE", size: 56, bold: true, color: "8B0000" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text: "Carnet de bord — Accès & Identifiants", size: 32, color: "333333" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1600 },
    children: [new TextRun({ text: "avrauto.fr", size: 28, italics: true, color: "8B0000" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: "Document généré le " + today, size: 22, color: "666666" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1200 },
    children: [new TextRun({ text: "Détenteur : Dalil SASSI", size: 22, color: "666666" })]
  }),

  // Avertissement
  new Paragraph({
    spacing: { before: 600, after: 200 },
    border: {
      top: { style: BorderStyle.SINGLE, size: 8, color: "DC3545" },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: "DC3545" }
    },
    children: [new TextRun({ text: "⚠ AVERTISSEMENT DE SÉCURITÉ", size: 24, bold: true, color: "DC3545" })]
  }),
  p("Ce document contient des informations CONFIDENTIELLES (mots de passe, clés API, accès serveur). Toute personne qui y accède peut prendre le contrôle complet du site avrauto.fr, de ses données clients, et du compte Hostinger associé."),
  spacer(),
  pBold("Bonnes pratiques :"),
  bullet("Ne stocke ce fichier que sur ton PC, dans un dossier non synchronisé avec OneDrive/Dropbox/iCloud."),
  bullet("Protège-le avec un mot de passe Word (Fichier → Informations → Protéger le document → Chiffrer avec mot de passe)."),
  bullet("Ne l'envoie JAMAIS par email, SMS, ou WhatsApp."),
  bullet("À moyen terme, transfère ces infos dans un gestionnaire de mots de passe (Bitwarden, 1Password, Dashlane, KeePass)."),
  bullet("Imprime-le en 1 exemplaire à conserver dans un coffre/lieu sûr (en cas de panne de ton PC)."),
  bullet("En cas de doute sur la sécurité de ton PC, régénère immédiatement TOUTES les clés listées ici."),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // SOMMAIRE
  // -----------------------------------------------------------
  h1("Sommaire"),
  pItalic("Légende : les zones jaunes sont les valeurs à compléter par toi-même."),
  spacer(),
  bullet("1. Identité du garage & contacts"),
  bullet("2. Compte Hostinger (panel & VPS)"),
  bullet("3. VPS de production (srv1713040 - 2.24.11.164)"),
  bullet("4. Nom de domaine avrauto.fr"),
  bullet("5. Supabase (base de données & authentification)"),
  bullet("6. GitHub (code source)"),
  bullet("7. Cardiff / Bee2link (stock véhicules)"),
  bullet("8. Email & téléphone professionnels"),
  bullet("9. Google OAuth (Sign in with Google)"),
  bullet("10. Stripe (paiements — à configurer)"),
  bullet("11. Clé SSH locale (ton PC)"),
  bullet("12. Fichiers importants sur ton PC"),
  bullet("13. Commandes utiles au quotidien"),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // 1. IDENTITÉ
  // -----------------------------------------------------------
  h1("1. Identité du garage & contacts"),
  infoTable([
    ["Raison sociale", "AVR AUTOMOBILE"],
    ["SIRET", "44452722000024"],
    ["Adresse", "27 rue des Maraîchers, 44220 Couëron"],
    ["Téléphone", "02 40 86 21 02"],
    ["Email pro", "contact@avr-auto.fr"],
    ["Site web", "https://avrauto.fr"],
    ["Détenteur du compte", "Dalil SASSI"],
    ["Email perso (admin)", "dalilsassi@gmail.com"],
    ["Email secondaire", "dalil.bourgeois@gmail.com"]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 2. HOSTINGER (panel)
  // -----------------------------------------------------------
  h1("2. Compte Hostinger"),
  p("Le compte Hostinger contrôle TOUT : le VPS, le domaine, l'accès root, les sauvegardes. C'est l'accès le plus critique de tout le dispositif."),
  spacer(),
  infoTable([
    ["URL connexion", "https://hPanel.hostinger.com / hostinger.com/login"],
    ["Email du compte", fillMe("email Hostinger")],
    ["Mot de passe Hostinger", fillMe("mot de passe Hostinger")],
    ["2FA activée ?", fillMe("oui/non — recommandé : OUI")],
    ["Code de récupération 2FA", fillMe("8 chiffres de secours")],
    ["Date d'expiration plan VPS", fillMe("ex: 14/05/2027")]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 3. VPS DE PRODUCTION
  // -----------------------------------------------------------
  h1("3. VPS de production"),
  p("Le serveur Linux qui héberge le site Next.js. Tu n'as pas à t'y connecter manuellement au quotidien — les commandes d'administration passent par SSH avec ta clé."),
  spacer(),
  infoTable([
    ["Nom du serveur", "srv1713040.hstgr.cloud"],
    ["Adresse IP", "2.24.11.164"],
    ["OS", "Ubuntu 24.04 LTS"],
    ["Plan", "KVM 2"],
    ["Mot de passe root", fillMe("mot de passe root (peu utilisé : on a key-only)")],
    ["User Linux principal", "deploy"],
    ["Mot de passe sudo de 'deploy'", "HardPass$2026!"],
    ["Connexion SSH", "ssh root@2.24.11.164  OU  ssh deploy@2.24.11.164"],
    ["Path de l'app", "/var/www/avr"],
    ["URL public", "https://avrauto.fr"]
  ]),
  spacer(),
  pBold("Services actifs sur le VPS :"),
  bullet("Nginx 1.24 (reverse proxy HTTPS, port 80/443)"),
  bullet("Node.js 20 + pm2 (le process Next.js, écoute en localhost:3000)"),
  bullet("Certbot Let's Encrypt (certificat HTTPS renouvelé tous les 90j)"),
  bullet("UFW (firewall — ports 22, 80, 443 ouverts seulement)"),
  bullet("fail2ban (bannit les IPs qui tentent du brute-force SSH)"),
  bullet("Cron quotidien 6h00 (sync Cardiff → Supabase)"),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // 4. DOMAINE
  // -----------------------------------------------------------
  h1("4. Nom de domaine avrauto.fr"),
  infoTable([
    ["Domaine", "avrauto.fr"],
    ["Registrar (chez qui acheté)", fillMe("Hostinger probablement")],
    ["DNS géré chez", fillMe("Hostinger (même panel que le VPS)")],
    ["Enregistrement A @", "2.24.11.164"],
    ["Enregistrement A www", "2.24.11.164"],
    ["Date d'expiration", fillMe("ex: 14/05/2027")],
    ["Renouvellement auto", fillMe("oui/non — recommandé : OUI")]
  ]),
  pItalic("À surveiller : si le domaine expire, le site disparaît et un squatter peut le racheter. Active toujours le renouvellement automatique."),

  spacer(),

  // -----------------------------------------------------------
  // 5. SUPABASE
  // -----------------------------------------------------------
  h1("5. Supabase"),
  p("Supabase héberge la base de données (clients, RDV, réservations, favoris, 68 véhicules). C'est aussi le système d'authentification Google."),
  spacer(),
  infoTable([
    ["URL dashboard", "https://supabase.com/dashboard/project/wfssjkfewardendkluix"],
    ["Email compte Supabase", fillMe("email Supabase")],
    ["Mot de passe Supabase", fillMe("mot de passe ou méthode SSO (Google/GitHub)")],
    ["Project ID", "wfssjkfewardendkluix"],
    ["Project URL", "https://wfssjkfewardendkluix.supabase.co"],
    ["Mot de passe Postgres DB", fillMe("récupérable dans Settings → Database")],
    ["Région", fillMe("ex: eu-central-1")],
    ["Plan", fillMe("Free / Pro")]
  ]),
  spacer(),
  pBold("Clés API (depuis Settings → API) :"),
  bullet("anon (public) : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi..."),
  bullet("service_role (secret) : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3..."),
  pItalic("⚠ Les 2 clés ci-dessus ont été partagées en chat avec Claude — il est recommandé de les régénérer (Settings → API → Reset) au plus tôt."),
  spacer(),
  pBold("Tables :"),
  bullet("profiles, favoris, estimations, reservations, rdv_atelier, documents, vehicules, vehicules_photos"),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // 6. GITHUB
  // -----------------------------------------------------------
  h1("6. GitHub (code source)"),
  infoTable([
    ["URL du repo", "https://github.com/dalilbourgeois-debug/Site-AVR-"],
    ["Visibilité", fillMe("Privé / Public")],
    ["Nom d'utilisateur GitHub", "dalilbourgeois-debug"],
    ["Email associé", "dalilsassi@gmail.com"],
    ["Mot de passe GitHub", fillMe("mot de passe GitHub")],
    ["2FA activée ?", fillMe("oui/non — recommandé : OUI")],
    ["Personal Access Token (PAT)", fillMe("si utilisé pour push HTTPS")],
    ["Branche de production", "version-6 (Cardiff sync activé)"],
    ["Branches précédentes", "main, version-1, version-2, version-3, version-4, version-5"]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 7. CARDIFF / BEE2LINK
  // -----------------------------------------------------------
  h1("7. Cardiff / Bee2link (stock véhicules)"),
  p("Cardiff/Bee2link est la plateforme où tu enregistres ton stock de voitures. Toutes les nuits, le site va chercher les véhicules ici et les met à jour."),
  spacer(),
  pBold("Accès FTP (utilisé par le script de sync) :"),
  infoTable([
    ["Serveur FTP", "ftp.publicationvo.com"],
    ["Utilisateur FTP", "avrauto"],
    ["Mot de passe FTP", "sb9Cb3QmfcPNeznYNmj7"],
    ["Port", "21"],
    ["Chiffrement", "Sans chiffrement (FTP standard)"],
    ["Dossier", "/datas/"],
    ["Fichier XML stock", "bigq.xml"],
    ["Validité credentials", "7 jours d'usage du lien OneTimeSecret initial"]
  ]),
  spacer(),
  pBold("Compte d'administration Bee2link (back-office) :"),
  infoTable([
    ["URL back-office", fillMe("URL du panel Bee2link/Cardiff")],
    ["Identifiant", fillMe("login back-office Cardiff")],
    ["Mot de passe", fillMe("mot de passe back-office Cardiff")],
    ["Contact support", "Ayoupe OUMAR — media@bee2linkgroup.io"]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 8. EMAIL
  // -----------------------------------------------------------
  h1("8. Email & téléphone professionnels"),
  infoTable([
    ["Email pro affiché sur le site", "contact@avr-auto.fr"],
    ["Téléphone affiché", "02 40 86 21 02"],
    ["Fournisseur email", fillMe("ex: OVH, Microsoft 365, Google Workspace, Hostinger…")],
    ["URL webmail", fillMe("URL pour consulter le webmail")],
    ["Mot de passe email", fillMe("mot de passe boîte contact@")]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 9. GOOGLE OAUTH
  // -----------------------------------------------------------
  h1("9. Google OAuth (Connexion avec Google)"),
  p("Le bouton 'Se connecter avec Google' est géré par Supabase, qui utilise une app Google Cloud que TU possèdes."),
  spacer(),
  infoTable([
    ["URL Google Cloud Console", "https://console.cloud.google.com"],
    ["Compte Google propriétaire", fillMe("email Google compte propriétaire")],
    ["Nom du projet GCP", fillMe("ex: AVR Automobile OAuth")],
    ["Client ID OAuth", fillMe("xxx.apps.googleusercontent.com")],
    ["Client Secret OAuth", fillMe("GOCSPX-xxx")],
    ["Redirect URI configurée", "https://wfssjkfewardendkluix.supabase.co/auth/v1/callback"]
  ]),

  spacer(),

  // -----------------------------------------------------------
  // 10. STRIPE
  // -----------------------------------------------------------
  h1("10. Stripe (paiements — à configurer)"),
  p("Stripe sera utilisé pour les acomptes de réservation (5% du prix d'une voiture). Pas encore configuré aujourd'hui — le bouton 'Réserver' fonctionne en mode démo."),
  spacer(),
  infoTable([
    ["URL dashboard", "https://dashboard.stripe.com"],
    ["Email compte Stripe", fillMe("email Stripe")],
    ["Mot de passe Stripe", fillMe("mot de passe Stripe")],
    ["Mode actif", fillMe("Test / Live")],
    ["Clé publique (pk_)", fillMe("pk_live_… ou pk_test_…")],
    ["Clé secrète (sk_)", fillMe("sk_live_… ou sk_test_…")],
    ["Webhook secret", fillMe("whsec_… si configuré")],
    ["IBAN encaissement", fillMe("IBAN du compte qui reçoit les acomptes")]
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // 11. SSH
  // -----------------------------------------------------------
  h1("11. Clé SSH locale"),
  p("La clé SSH te permet de te connecter au VPS sans mot de passe. Elle est stockée sur ton PC."),
  spacer(),
  infoTable([
    ["Type", "ED25519"],
    ["Chemin clé PRIVÉE", "C:\\Users\\Dalil\\.ssh\\id_ed25519"],
    ["Chemin clé PUBLIQUE", "C:\\Users\\Dalil\\.ssh\\id_ed25519.pub"],
    ["Email associé", "dalil.bourgeois@gmail.com"],
    ["Passphrase", "(vide)"]
  ]),
  spacer(),
  pBold("Clé publique (à coller dans GitHub / nouveaux serveurs) :"),
  p("ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJdHXMmfMAdZEsC9JgNOOxACAPFYTKCyAy72idAZbtJg dalil.bourgeois@gmail.com"),
  spacer(),
  pItalic("⚠ Si ton PC plante ou est volé, tu perds l'accès SSH au VPS. Il faut alors passer par le mot de passe root via la console Hostinger pour réinstaller une nouvelle clé."),

  spacer(),

  // -----------------------------------------------------------
  // 12. FICHIERS LOCAUX
  // -----------------------------------------------------------
  h1("12. Fichiers importants sur ton PC"),
  infoTable([
    ["Dossier du projet", "C:\\Users\\Dalil\\site avr"],
    ["Variables d'env locales", "C:\\Users\\Dalil\\site avr\\.env.local"],
    ["Dossier SSH", "C:\\Users\\Dalil\\.ssh\\"],
    ["Présentation PDF", "C:\\Users\\Dalil\\site avr\\AVR-Automobile-presentation.pdf"],
    ["Récap fonctionnalités PDF", "C:\\Users\\Dalil\\site avr\\AVR-recap-fonctionnalites.pdf"],
    ["Ce carnet de bord", "C:\\Users\\Dalil\\Desktop\\AVR-Carnet-de-bord.docx"]
  ]),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // 13. COMMANDES UTILES
  // -----------------------------------------------------------
  h1("13. Commandes utiles au quotidien"),
  p("Toutes ces commandes se lancent depuis PowerShell (touche Windows → tape 'powershell')."),
  spacer(),
  pBold("Se connecter au VPS :"),
  p("ssh deploy@2.24.11.164"),
  spacer(),
  pBold("Forcer une sync Cardiff manuelle (si tu veux pas attendre 6h du mat) :"),
  p('ssh deploy@2.24.11.164 "cd /var/www/avr && node --env-file=.env.local scripts/sync-cardiff.mjs"'),
  spacer(),
  pBold("Voir l'état de l'app sur le VPS :"),
  p('ssh deploy@2.24.11.164 "pm2 status"'),
  spacer(),
  pBold("Voir les logs de l'app (dernières 50 lignes) :"),
  p('ssh deploy@2.24.11.164 "pm2 logs avr --lines 50 --nostream"'),
  spacer(),
  pBold("Redémarrer l'app si besoin :"),
  p('ssh deploy@2.24.11.164 "pm2 restart avr"'),
  spacer(),
  pBold("Voir les logs de la dernière sync Cardiff :"),
  p('ssh deploy@2.24.11.164 "tail -50 /var/log/avr/sync.log"'),
  spacer(),
  pBold("Déployer une nouvelle version (après un commit + push) :"),
  p('ssh deploy@2.24.11.164 "cd /var/www/avr && git pull && npm ci && npm run build && pm2 restart avr"'),

  new Paragraph({ children: [new PageBreak()] }),

  // -----------------------------------------------------------
  // FOOTER : EN CAS DE PROBLÈME
  // -----------------------------------------------------------
  h1("En cas de problème"),
  pBold("Le site est down :"),
  bullet("1. Vérifie sur https://hPanel.hostinger.com que le VPS tourne (statut 'En cours d'exécution')."),
  bullet("2. Sinon, clique sur 'Démarrer le VPS' dans le panel."),
  bullet('3. Si le VPS tourne mais le site répond pas : ssh deploy@2.24.11.164 puis "pm2 restart avr".'),
  bullet("4. Si vraiment bloqué : contacte le support Hostinger (chat dans hPanel)."),
  spacer(),
  pBold("Mail Monarx 'Logiciel malveillant détecté' :"),
  bullet("1. NE clique JAMAIS sur 'Supprimer automatiquement' (peut casser le site)."),
  bullet("2. Va en Mode d'urgence Hostinger pour voir QUELS fichiers sont flaggés."),
  bullet("3. Si le nom contient 'xmrig', 'scanner_linux', ou des chiffres random : c'est une compromission."),
  bullet("4. Dans ce cas : réinstalle Ubuntu propre (perte de données acceptable, tout est dans GitHub + Supabase)."),
  spacer(),
  pBold("Cardiff n'envoie plus de données :"),
  bullet("1. Vérifie /var/log/avr/sync.log sur le VPS pour voir le message d'erreur."),
  bullet("2. Si 'authentication failed' : les credentials FTP ont peut-être expiré → contacte Ayoupe (media@bee2linkgroup.io)."),
  bullet("3. Si timeout : le serveur Cardiff est peut-être down (attendre 1-2h)."),
  spacer(),
  pBold("J'ai oublié les credentials Cardiff :"),
  bullet("Contacte Ayoupe OUMAR : media@bee2linkgroup.io — demande un nouveau lien OneTimeSecret."),

  spacer(),
  spacer(),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 600 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "8B0000" } },
    children: [new TextRun({ text: "— Fin du carnet de bord —", size: 22, italics: true, color: "8B0000" })]
  })
];

// -----------------------------------------------------------------------------
// Document
// -----------------------------------------------------------------------------

const doc = new Document({
  creator: "AVR Automobile",
  title: "Carnet de bord — Accès & Identifiants",
  description: "Document de référence des accès du site avrauto.fr",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "8B0000" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "AVR Automobile — Carnet de bord (CONFIDENTIEL)", size: 16, italics: true, color: "999999" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: "999999" }),
            new TextRun({ text: " / ", size: 16, color: "999999" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: "999999" })
          ]
        })]
      })
    },
    children: content
  }]
});

// -----------------------------------------------------------------------------
// Écriture du fichier
// -----------------------------------------------------------------------------

const desktopPath = path.join(os.homedir(), "Desktop");
const outPath = path.join(desktopPath, "AVR-Carnet-de-bord.docx");

const buf = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buf);

console.log(`✓ Carnet de bord créé : ${outPath}`);
console.log(`  Taille : ${(buf.length / 1024).toFixed(1)} KB`);
