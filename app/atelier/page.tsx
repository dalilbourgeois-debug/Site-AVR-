import Link from "next/link";
import Reveal from "@/components/Reveal";
import DecrirePanneForm from "./DecrirePanneForm";

export const metadata = {
  title: "Atelier — mécanique, carrosserie, contrôle technique",
  description:
    "Atelier AVR Automobile à Couëron : mécanique toutes marques, carrosserie agréée AXA et Direct Assurance, contrôle technique. Prise de rendez-vous en ligne."
};

export default function AtelierPage() {
  return (
    <>
      {/* HERO atelier — 3 services présentés brièvement */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url(https://picsum.photos/seed/atelier-hero/1920/900)" }}
        />
        <div className="relative container-x py-20 md:py-24 text-center hero-text">
          <div
            className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "150ms" }}
          >
            Atelier · Couëron
          </div>
          <h1
            className="mt-4 font-serif text-4xl md:text-6xl leading-tight hero-title hero-anim hero-anim-title"
            style={{ animationDelay: "350ms" }}
          >
            L'atelier AVR
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/85 hero-anim"
            style={{ animationDelay: "850ms" }}
          >
            Trois expertises, un seul atelier de confiance.
          </p>

          {/* 3 mini-présentations */}
          <div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left hero-anim"
            style={{ animationDelay: "1050ms" }}
          >
            <MiniIntro
              href="#carrosserie"
              icon="🎨"
              label="Carrosserie"
              desc="Sinistre, peinture, redressage. Agréé AXA et Direct Assurance."
            />
            <MiniIntro
              href="#mecanique"
              icon="🔧"
              label="Mécanique"
              desc="Toutes marques : révision, freins, distribution, diagnostic…"
            />
            <MiniIntro
              href="#controle-technique"
              icon="📋"
              label="Contrôle technique"
              desc="Centre agréé. Périodique ou contre-visite, sous 1 heure."
            />
          </div>
        </div>
      </section>

      {/* Bandeau réassurance assurances */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-x py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-brand-accent">✓</span>
            Agréé <strong className="font-semibold">AXA</strong>
          </div>
          <span className="hidden md:inline text-gray-300">·</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-accent">✓</span>
            Agréé <strong className="font-semibold">Direct Assurance</strong>
          </div>
          <span className="hidden md:inline text-gray-300">·</span>
          <div className="flex items-center gap-2">
            <span className="text-brand-accent">✓</span>
            Prise en charge sinistre de A à Z
          </div>
        </div>
      </section>

      {/* SECTION 1 — CARROSSERIE (image gauche / texte droite) */}
      <SectionBlock
        id="carrosserie"
        bg="bg-gray-50"
        surtitre="Atelier · Carrosserie"
        titre="On remet votre carrosserie à neuf."
        image="https://picsum.photos/seed/carrosserie-bloc/1200/900"
        imageAlt="Atelier carrosserie"
        imagePosition="left"
        rdvHref="/atelier/carrosserie/rdv"
        rdvLabel="Prendre RDV carrosserie"
      >
        <p>
          Choc, rayure, accrochage, grêle ou sinistre complet :
          notre équipe de carrossiers prend en charge la remise en état totale de
          votre véhicule, avec ou sans assurance.
        </p>
        <p className="mt-3">
          Nous sommes <strong>agréés AXA et Direct Assurance</strong> — si c'est
          votre assureur, nous gérons l'expertise, la déclaration et les
          réparations de A à Z. Vous nous laissez les clés, on s'occupe du reste.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
          {[
            "Sinistre auto",
            "Peinture",
            "Redressage / tôlerie",
            "Smart Repair",
            "Pare-chocs / plastique",
            "Polish & rénovation"
          ].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className="text-brand-accent">✓</span>
              <span className="text-gray-700">{p}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* SECTION 2 — MÉCANIQUE (image droite / texte gauche) avec "décrivez votre panne" */}
      <SectionBlock
        id="mecanique"
        bg="bg-white"
        surtitre="Atelier · Mécanique"
        titre="Toutes interventions, toutes marques."
        image="https://picsum.photos/seed/mecanique-bloc/1200/900"
        imageAlt="Atelier mécanique"
        imagePosition="right"
        rdvHref="/atelier/mecanique/rdv"
        rdvLabel="Prendre RDV mécanique"
      >
        <p>
          Entretien courant ou grosse mécanique : nous travaillons sur tous les
          modèles, anciens comme récents, essence, diesel, hybride et électrique.
        </p>
        <p className="mt-3">
          <strong>Devis clair avant intervention</strong>, factures détaillées,
          pièces neuves d'origine ou équivalentes. Pas de mauvaise surprise.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
          {[
            "Révision / Vidange",
            "Freinage",
            "Distribution",
            "Suspension",
            "Échappement",
            "Climatisation",
            "Batterie",
            "Pneus",
            "Vitrage",
            "Diagnostic"
          ].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className="text-brand-accent">✓</span>
              <span className="text-gray-700">{p}</span>
            </div>
          ))}
        </div>

        {/* Bloc "Décrivez votre panne" — exclusif à la mécanique */}
        <div className="mt-8 bg-gray-50 border-l-2 border-brand-accent p-5">
          <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent">
            Pas sûr de la panne ?
          </div>
          <div className="mt-1 font-serif text-lg text-brand">
            Décrivez-nous ce que vous observez
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Bruit suspect, voyant allumé, fumée, comportement bizarre… On
            diagnostique pour vous.
          </p>
          <DecrirePanneForm />
        </div>
      </SectionBlock>

      {/* SECTION 3 — CONTRÔLE TECHNIQUE (image gauche / texte droite) */}
      <SectionBlock
        id="controle-technique"
        bg="bg-gray-50"
        surtitre="Atelier · Contrôle technique"
        titre="Contrôle technique sur rendez-vous."
        image="https://picsum.photos/seed/ct-bloc/1200/900"
        imageAlt="Contrôle technique"
        imagePosition="left"
        rdvHref="/atelier/controle-technique/rdv"
        rdvLabel="Prendre RDV CT"
      >
        <p>
          Contrôle technique périodique (obligatoire tous les 2 ans à partir du
          4ᵉ anniversaire du véhicule) et contre-visite après réparation.
        </p>
        <p className="mt-3">
          <strong>Résultat remis en moins d'une heure</strong>, en main propre.
          Rapport détaillé et explication des points contrôlés.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
          {[
            "Contrôle périodique",
            "Contre-visite",
            "133 points vérifiés",
            "Rapport remis sur place"
          ].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className="text-brand-accent">✓</span>
              <span className="text-gray-700">{p}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* Bandeau horaires */}
      <section className="bg-brand-dark text-white py-12">
        <div className="container-x text-center">
          <Reveal>
            <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">Horaires atelier</div>
            <div className="mt-3 text-2xl md:text-3xl font-serif">
              Lundi – Vendredi · 9h–12h / 14h–18h
            </div>
            <div className="mt-1 text-sm text-white/60">Fermé le week-end</div>
            <div className="mt-6">
              <a
                href="tel:0240862102"
                className="inline-flex items-center justify-center h-12 px-8 border border-white/80 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-brand transition"
              >
                02 40 86 21 02
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function MiniIntro({
  href,
  icon,
  label,
  desc
}: {
  href: string;
  icon: string;
  label: string;
  desc: string;
}) {
  return (
    <a
      href={href}
      className="group block bg-white/5 border border-white/10 hover:border-brand-accent backdrop-blur p-5 transition-all"
    >
      <div className="text-3xl">{icon}</div>
      <div className="mt-3 font-serif text-lg text-white">{label}</div>
      <p className="mt-1 text-xs text-white/70 leading-relaxed">{desc}</p>
      <div className="mt-3 text-[10px] tracking-[0.3em] uppercase text-brand-accent opacity-0 group-hover:opacity-100 transition">
        En savoir + ↓
      </div>
    </a>
  );
}

function SectionBlock({
  id,
  bg,
  surtitre,
  titre,
  image,
  imageAlt,
  imagePosition,
  rdvHref,
  rdvLabel,
  children
}: {
  id: string;
  bg: string;
  surtitre: string;
  titre: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  rdvHref: string;
  rdvLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${bg} scroll-mt-32 py-20`}>
      <div className="container-x grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Image */}
        <Reveal variant={imagePosition === "left" ? "left" : "right"} className={imagePosition === "right" ? "lg:order-2" : ""}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={imageAlt} className="w-full aspect-[4/3] object-cover" />
        </Reveal>

        {/* Texte */}
        <Reveal variant={imagePosition === "left" ? "right" : "left"} className={imagePosition === "right" ? "lg:order-1" : ""}>
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">{surtitre}</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-brand leading-tight">{titre}</h2>
            <div className="mt-6 text-gray-700 leading-relaxed">{children}</div>

            <div className="mt-8">
              <Link
                href={rdvHref}
                className="inline-flex items-center justify-center h-14 px-8 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
              >
                {rdvLabel} →
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
