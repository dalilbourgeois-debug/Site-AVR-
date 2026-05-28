import Link from "next/link";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Atelier — mécanique, carrosserie, contrôle technique",
  description:
    "Atelier AVR Automobile à Couëron : mécanique toutes marques, carrosserie agréée AXA et Direct Assurance, contrôle technique. Prise de rendez-vous en ligne."
};

export default function AtelierPage() {
  return (
    <>
      {/* En-tête simple, comme /vehicules */}
      <div className="container-x py-10">
        <Reveal>
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Atelier · Couëron</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">L'atelier AVR</h1>
          <p className="mt-2 text-gray-600">
            Trois expertises, un seul atelier de confiance — mécanique, carrosserie, contrôle technique.
          </p>
        </Reveal>
      </div>

      {/* SECTION 1 — CARROSSERIE (image gauche / texte droite) */}
      <SectionBlock
        id="carrosserie"
        bg="bg-gray-50"
        surtitre="Atelier · Carrosserie"
        titre="On remet votre carrosserie à neuf."
        image="/images/image%20carrosserie.png"
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
              <Check size={16} strokeWidth={2.2} className="text-brand-accent shrink-0" aria-hidden="true" />
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
        image="/images/m%C3%A9canique.jpg"
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
              <Check size={16} strokeWidth={2.2} className="text-brand-accent shrink-0" aria-hidden="true" />
              <span className="text-gray-700">{p}</span>
            </div>
          ))}
        </div>

      </SectionBlock>

      {/* SECTION 3 — CONTRÔLE TECHNIQUE (image gauche / texte droite) */}
      <SectionBlock
        id="controle-technique"
        bg="bg-gray-50"
        surtitre="Atelier · Contrôle technique"
        titre="Contrôle technique sur rendez-vous."
        image="/images/CT.png"
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
              <Check size={16} strokeWidth={2.2} className="text-brand-accent shrink-0" aria-hidden="true" />
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
        {/* Image avec liseré rouge subtil */}
        <Reveal variant={imagePosition === "left" ? "left" : "right"} className={imagePosition === "right" ? "lg:order-2" : ""}>
          <div className="p-0.5 bg-brand-accent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={imageAlt} className="w-full aspect-[4/3] object-cover block" />
          </div>
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
