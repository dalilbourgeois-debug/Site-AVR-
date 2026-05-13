# AVR Automobile — site web

Site Next.js (App Router) pour AVR Automobile : vente de véhicules d'occasion, atelier
(mécanique / carrosserie / contrôle technique), reprise, prise de RDV.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** pour le style
- **PostgreSQL** côté stock (schéma fourni dans `db/schema.sql`)
- **Stripe Checkout** pour les acomptes 5%
- **Worker Node** pour la synchro CardiffVO via FTP (`scripts/sync-cardiff.mjs`)

## Démarrage local

```bash
npm install
cp .env.example .env       # complétez les clés au fur et à mesure
npm run dev                # http://localhost:3000
```

Le site fonctionne tel quel avec des données mock (`lib/data.ts`) tant que la base
Postgres et le flux CardiffVO ne sont pas connectés.

## Branchement CardiffVO

1. Demande du compte FTP à `media@bee2linkgroup.io` (offre Basic, gratuite, 1 sync/nuit).
2. Renseigner `CARDIFF_FTP_HOST / USER / PASSWORD` dans `.env`.
3. Créer la base : `psql -f db/schema.sql`.
4. Brancher la persistence Postgres dans `scripts/sync-cardiff.mjs` (les TODOs marquent
   les emplacements pour l'INSERT / UPDATE).
5. Tester en local : `node scripts/sync-cardiff.mjs --local --file path/to/tt4Basic.xml`.
6. Mettre en place le cron : `0 6 * * * node scripts/sync-cardiff.mjs`.

Filtres à demander à Bee2link pour le flux :

- ❌ marchand / casse
- ❌ sans photo
- ❌ sans prix TTC
- ❌ sans kilométrage
- ❌ sans marque

## Branchement Stripe

1. Créer un compte Stripe, récupérer les clés.
2. Renseigner `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` dans `.env`.
3. (Production) Configurer le webhook `checkout.session.completed` →
   `/api/reservations/webhook` (à créer) pour passer la réservation en `paid` et le
   véhicule en `reserve` dans la BDD.

## Branchement email / SMS

- Email : Brevo, Resend ou Postmark — clé dans `EMAIL_API_KEY`.
- SMS : Brevo, OVH SMS, Twilio — clé dans `SMS_API_KEY`.
- Envoi à brancher dans `app/api/leads/[type]/route.ts` et `app/api/atelier/rdv/route.ts`.

## Arborescence applicative

```
app/
├── page.tsx                                   /
├── vehicules/
│   ├── page.tsx                               /vehicules
│   ├── vendus/page.tsx                        /vehicules/vendus
│   └── [slug]/
│       ├── page.tsx                           /vehicules/<slug>
│       ├── reserver/page.tsx                  /vehicules/<slug>/reserver
│       ├── reserver/ReservationFlow.tsx       (client component)
│       ├── reserver/confirmation/page.tsx
│       ├── essayer/page.tsx                   /vehicules/<slug>/essayer
│       └── reprise/page.tsx                   /vehicules/<slug>/reprise
├── atelier/
│   ├── page.tsx                               /atelier
│   ├── mecanique/page.tsx
│   ├── carrosserie/page.tsx
│   ├── controle-technique/page.tsx
│   └── rdv/page.tsx + RdvFlow.tsx             /atelier/rdv
├── vendre-reprendre/page.tsx
├── garage/page.tsx
├── contact/page.tsx
├── mentions-legales/page.tsx
├── cgv/page.tsx
├── politique-confidentialite-rgpd/page.tsx
├── cookies/page.tsx
├── mediateur-cnpa/page.tsx
├── bloctel/page.tsx
└── api/
    ├── reservations/checkout/route.ts         POST → session Stripe
    ├── leads/[type]/route.ts                  POST → essai|reprise|vente|contact
    └── atelier/rdv/route.ts                   POST → demande de RDV

components/
├── Nav.tsx
├── Footer.tsx
├── VehiculeCard.tsx
├── Filters.tsx
├── Gallery.tsx
├── SimpleForm.tsx
└── LegalPage.tsx

lib/
├── types.ts
├── format.ts
└── data.ts                                    (mock — à remplacer par la requête Postgres)

scripts/
└── sync-cardiff.mjs                           (worker FTP → BDD)

db/
└── schema.sql
```

## Roadmap (extrait du cahier des charges)

- [x] Phase 1 — Socle (pages statiques)
- [x] Phase 2a — Pages véhicules (liste, filtres, fiche) sur mock data
- [x] Phase 3 — Conversion (tunnel Stripe stubé, RDV atelier, reprise)
- [ ] Phase 2b — Branchement CardiffVO réel (compte FTP en attente)
- [ ] Stripe en prod (webhook + passage `statut = 'reserve'`)
- [ ] Email + SMS transactionnels
- [ ] Synchro agenda atelier (Google Calendar / Cardiff)
- [ ] SEO : sitemap dynamique, schema.org Vehicle
- [ ] Mise en production (OVH ou Hetzner)
```
