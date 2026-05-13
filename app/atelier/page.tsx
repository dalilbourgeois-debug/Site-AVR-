import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Atelier — mécanique, carrosserie, contrôle technique",
  description:
    "Services atelier AVR Automobile à Couëron : mécanique, carrosserie, contrôle technique. Agréé AXA et Direct Assurance."
};

export default function AtelierPage() {
  return (
    <>
      {/* Hero atelier */}
      <section className="relative bg-brand-dark text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(https://picsum.photos/seed/atelier-hero/1920/800)" }}
        />
        <div className="relative container-x py-24 md:py-32 text-center hero-text">
          <div
            className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "150ms" }}
          >
            Notre atelier · Couëron
          </div>
          <h1
            className="mt-6 font-serif text-4xl md:text-6xl lg:text-7xl leading-tight hero-title hero-anim hero-anim-title"
            style={{ animationDelay: "350ms" }}
          >
            L'atelier AVR
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-white/90 hero-anim"
            style={{ animationDelay: "900ms" }}
          >
            Mécanique, carrosserie, contrôle technique : tout sous un même toit, par une équipe
            qui connaît votre véhicule.
          </p>
          <div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 hero-anim"
            style={{ animationDelay: "1150ms" }}
          >
            <Link
              href="/atelier/rdv"
              className="inline-flex items-center justify-center h-14 w-[260px] bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
            >
              Prendre rendez-vous
            </Link>
            <a
              href="tel:0240862102"
              className="inline-flex items-center justify-center h-14 w-[260px] border border-white/80 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-brand transition"
            >
              02 40 86 21 02
            </a>
          </div>
        </div>
      </section>

      {/* Bandeau réassurance assurances */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-x py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-700">
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

      {/* 3 services */}
      <section className="container-x py-20">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Nos services</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
              Tout ce qu'il faut pour votre véhicule
            </h2>
            <p className="mt-4 text-gray-600">
              Devis clair avant intervention, factures détaillées, pièces neuves d'origine ou
              équivalentes. Sur toutes marques.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <Reveal delay={0} className="h-full">
            <ServiceBlock
              title="Mécanique"
              href="/atelier/mecanique"
              image="https://picsum.photos/seed/meca/800/600"
              tags={["Révision", "Freinage", "Vidange", "Embrayage", "Diagnostic"]}
              desc="Entretien courant et grosse mécanique sur toutes marques."
            />
          </Reveal>
          <Reveal delay={150} className="h-full">
            <ServiceBlock
              title="Carrosserie"
              href="/atelier/carrosserie"
              image="https://picsum.photos/seed/carrosserie/800/600"
              tags={["Sinistre", "Peinture", "Redressage", "Plastique"]}
              desc="Prise en charge complète des sinistres, expertise sur place."
            />
          </Reveal>
          <Reveal delay={300} className="h-full">
            <ServiceBlock
              title="Contrôle technique"
              href="/atelier/controle-technique"
              image="https://picsum.photos/seed/ct/800/600"
              tags={["Périodique", "Contre-visite"]}
              desc="Contrôle technique sur rendez-vous, résultat en moins d'une heure."
            />
          </Reveal>
        </div>
      </section>

      {/* Pourquoi choisir AVR pour l'atelier */}
      <section className="bg-gray-50 py-20">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Pourquoi AVR</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
                4 bonnes raisons de nous confier votre véhicule
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Équipe d'expérience", desc: "Plus de 25 ans à entretenir les véhicules de la région." },
              { num: "02", title: "Devis transparent", desc: "Aucune intervention sans votre accord, factures détaillées." },
              { num: "03", title: "Sinistre simplifié", desc: "Agréés AXA et Direct Assurance, nous gérons votre dossier." },
              { num: "04", title: "Multimarque", desc: "Toutes marques, toutes énergies, anciens véhicules acceptés." }
            ].map((b, i) => (
              <Reveal key={b.num} delay={i * 100}>
                <div className="bg-white p-6 h-full border-t-2 border-brand-accent">
                  <div className="text-3xl font-serif text-brand-accent">{b.num}</div>
                  <div className="mt-4 font-serif text-xl text-brand">{b.title}</div>
                  <p className="mt-2 text-sm text-gray-600">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Avis spécifiques atelier */}
      <section className="bg-brand-dark text-white py-20">
        <Reveal>
          <div className="container-x text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Témoignages</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif">Ils ont passé l'atelier en revue</h2>
          </div>
        </Reveal>
        <div className="container-x grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Julien M.", text: "Devis clair, intervention rapide. Pas de mauvaise surprise." },
            { name: "Anaïs P.", text: "Pris en charge sinistre via mon assurance, tout a été géré pour moi." },
            { name: "Patrick V.", text: "Contrôle technique au top, équipe sympa et professionnelle." }
          ].map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <div className="bg-white/5 border border-white/10 p-6 h-full">
                <div className="text-brand-accent">★★★★★</div>
                <p className="mt-3 text-sm text-gray-100 leading-relaxed">"{r.text}"</p>
                <div className="mt-4 text-xs tracking-widest uppercase text-gray-400">— {r.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA bas de page */}
      <section className="container-x py-20 text-center">
        <Reveal>
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Prêt ?</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
            Réservez votre créneau en 3 clics
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Choisissez votre prestation, votre créneau et laissez-nous vos coordonnées. Confirmation
            immédiate par email et SMS.
          </p>
          <Link
            href="/atelier/rdv"
            className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
          >
            Prendre rendez-vous
          </Link>
        </Reveal>
      </section>
    </>
  );
}

function ServiceBlock({
  title,
  href,
  tags,
  desc,
  image
}: {
  title: string;
  href: string;
  tags: string[];
  desc: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group h-full flex flex-col bg-white overflow-hidden border border-gray-100 hover:border-brand-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(255,0,0,0.20)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <div className="text-2xl font-serif text-white">{title}</div>
        </div>
        {/* Liseré rouge animé */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-gray-600">{desc}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-[10px] tracking-widest uppercase bg-gray-50 border border-gray-200 px-2 py-1 text-gray-700">
              {t}
            </span>
          ))}
        </div>
        {/* "En savoir plus" toujours collé en bas */}
        <div className="mt-auto pt-5 text-xs tracking-[0.25em] uppercase text-brand-accent">
          En savoir plus →
        </div>
      </div>
    </Link>
  );
}
