-- Schéma PostgreSQL — AVR Automobile
-- À exécuter sur la base cible (psql -f db/schema.sql).

CREATE TABLE IF NOT EXISTS vehicules (
  id              SERIAL PRIMARY KEY,
  vin             VARCHAR(17) UNIQUE NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,

  -- Identité
  marque          VARCHAR(50),
  modele          VARCHAR(100),
  version         VARCHAR(150),
  annee           INTEGER,
  carrosserie     VARCHAR(50),
  couleur_ext     VARCHAR(50),
  couleur_int     VARCHAR(50),
  genre           VARCHAR(50),
  categorie       VARCHAR(50),

  -- Technique
  energie         VARCHAR(30),
  boite           VARCHAR(20),
  nb_portes       INTEGER,
  nb_places       INTEGER,
  cylindree       INTEGER,
  puissance_fisc  INTEGER,
  puissance_reel  INTEGER,
  transmission    VARCHAR(30),

  -- Historique
  date_mec        DATE,
  kilometrage     INTEGER,
  km_garanti      BOOLEAN,
  premiere_main   BOOLEAN,
  garantie_duree  VARCHAR(50),
  garantie_libelle VARCHAR(200),
  date_ct         DATE,
  accidente       BOOLEAN,

  -- Prix
  prix_ttc        DECIMAL(10,2),
  montant_tva     DECIMAL(10,2),

  -- Environnement
  co2             INTEGER,
  crit_air        VARCHAR(10),

  -- Texte libre
  commentaire_public TEXT,

  -- Équipements (JSON)
  equip_serie     JSONB,
  equip_option    JSONB,
  equip_perso     JSONB,

  -- Spécifique électrique
  soh             INTEGER,
  autonomie       INTEGER,
  capacite_bat    DECIMAL(5,2),
  temps_recharge  VARCHAR(50),

  -- État commercial
  -- valeurs : 'disponible', 'reserve', 'vendu', 'masque'
  statut          VARCHAR(20) DEFAULT 'disponible',
  date_arrivee    TIMESTAMP DEFAULT NOW(),
  date_sortie     TIMESTAMP,

  -- Sync
  last_sync       TIMESTAMP DEFAULT NOW(),
  raw_xml         JSONB,

  -- Flag éditorial
  alaune          BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_vehicules_statut ON vehicules(statut);
CREATE INDEX IF NOT EXISTS idx_vehicules_marque ON vehicules(marque);
CREATE INDEX IF NOT EXISTS idx_vehicules_prix ON vehicules(prix_ttc);

CREATE TABLE IF NOT EXISTS vehicules_photos (
  id           SERIAL PRIMARY KEY,
  vehicule_id  INTEGER REFERENCES vehicules(id) ON DELETE CASCADE,
  url_origine  TEXT,
  chemin_local TEXT,
  position     INTEGER,
  is_principal BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_photos_vehicule ON vehicules_photos(vehicule_id);

-- Réservations Stripe
CREATE TABLE IF NOT EXISTS reservations (
  id              SERIAL PRIMARY KEY,
  vehicule_id     INTEGER REFERENCES vehicules(id),
  vin             VARCHAR(17),
  nom             VARCHAR(200),
  email           VARCHAR(200),
  telephone       VARCHAR(50),
  adresse         TEXT,
  montant_acompte INTEGER,
  stripe_session  VARCHAR(200),
  statut          VARCHAR(20) DEFAULT 'pending', -- pending, paid, cancelled
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Leads génériques (essai, reprise, vente, contact)
CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  type        VARCHAR(30), -- 'essai' | 'reprise' | 'vente' | 'contact'
  vehicule_id INTEGER REFERENCES vehicules(id),
  payload     JSONB,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- RDV atelier
CREATE TABLE IF NOT EXISTS rdv_atelier (
  id          SERIAL PRIMARY KEY,
  service     VARCHAR(50),
  jour        DATE,
  heure       TIME,
  nom         VARCHAR(200),
  email       VARCHAR(200),
  telephone   VARCHAR(50),
  immat       VARCHAR(20),
  message     TEXT,
  statut      VARCHAR(20) DEFAULT 'pending',
  created_at  TIMESTAMP DEFAULT NOW()
);
