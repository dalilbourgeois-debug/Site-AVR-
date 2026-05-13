import Link from "next/link";
import Reveal from "./Reveal";

export default function AtelierPageShell({
  surtitre,
  titre,
  description,
  badge,
  prestations,
  rdvHref,
  image
}: {
  surtitre: string;
  titre: string;
  description: string;
  badge?: string;
  prestations: string[];
  rdvHref: string;
  image: string;
}) {
  return (
    <>
      {/* Hero compact */}
      <section className="relative bg-brand-dark text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="relative container-x py-20 text-center">
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">{surtitre}</div>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{titre}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-white/80">{description}</p>
          {badge && (
            <div className="mt-6 inline-block bg-brand-accent/10 border border-brand-accent/40 text-brand-accent text-xs tracking-[0.2em] uppercase px-4 py-2">
              {badge}
            </div>
          )}
        </div>
      </section>

      {/* Prestations */}
      <section className="container-x py-16">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Prestations</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">
              Ce que nous prenons en charge
            </h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {prestations.map((p, i) => (
            <Reveal key={p} delay={(i % 6) * 60}>
              <div className="bg-white border border-gray-100 px-4 py-3 text-sm flex items-center gap-3 hover:border-brand-accent transition-colors">
                <span className="text-brand-accent">✓</span>
                <span>{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <Reveal>
          <div className="container-x text-center">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Réservation</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif text-brand">
              Réservez votre intervention
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Choisissez votre créneau en quelques clics. Confirmation par email et SMS.
            </p>
            <Link
              href={rdvHref}
              className="mt-6 inline-flex items-center justify-center px-10 py-4 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
