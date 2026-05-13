import Link from "next/link";
import VehiculeCard from "@/components/VehiculeCard";
import Reveal from "@/components/Reveal";
import Partners from "@/components/Partners";
import CountUp from "@/components/CountUp";
import { getVehicules } from "@/lib/data";

const AVIS = [
  { name: "Marie L.",   note: 5, text: "Équipe pro et sympa, voiture impeccable à la livraison." },
  { name: "Karim B.",   note: 5, text: "Atelier rapide et tarif honnête. Je recommande." },
  { name: "Sophie D.",  note: 5, text: "J'ai fait reprendre ma Clio, transaction simple et juste." },
  { name: "Julien M.",  note: 5, text: "Devis clair, pas de mauvaise surprise. Intervention rapide." },
  { name: "Anaïs P.",   note: 5, text: "Sinistre pris en charge via mon assurance, tout a été géré pour moi." },
  { name: "Patrick V.", note: 5, text: "Contrôle technique au top, équipe accueillante." },
  { name: "Léa R.",     note: 5, text: "Conseil au top, ils ont pris le temps de m'expliquer chaque détail." },
  { name: "Mehdi T.",   note: 5, text: "Voiture livrée nickel, contrat clair. Du sérieux." }
];

export default function HomePage() {
  const tous = getVehicules();
  const alaune = tous.filter((v) => v.alaune).slice(0, 6);
  const enStock = tous.length;

  return (
    <>
      {/* HERO — sous le bandeau de nav */}
      <section
        id="hero"
        className="relative w-full flex items-center justify-center text-white"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.75) 100%), url(/images/AVR%20image%20hero.avif)"
          }}
        />

        {/* Contenu centré */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-16 pb-32 hero-text">
          <div
            className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "150ms" }}
          >
            Garage multimarque · Couëron
          </div>
          <h1
            className="mt-6 font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight hero-title hero-anim hero-anim-title"
            style={{ animationDelay: "350ms" }}
          >
            AVR<br />AUTOMOBILE
          </h1>
          <div
            className="mt-6 text-sm md:text-base tracking-[0.25em] text-brand-accent uppercase hero-anim hero-accent"
            style={{ animationDelay: "850ms" }}
          >
            Achat · Vente · Reprise · Financement · Entretien
          </div>

          <p
            className="mt-8 max-w-xl mx-auto text-base md:text-lg text-white/90 hero-anim"
            style={{ animationDelay: "1050ms" }}
          >
            Votre véhicule, du choix à l'entretien — tout sous un même toit, depuis plus de 20 ans.
          </p>

          {/* CTA centrés */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 hero-anim"
            style={{ animationDelay: "1250ms" }}
          >
            <Link
              href="/vehicules"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/80 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-brand transition-colors w-[240px]"
            >
              Voir le parc
            </Link>
            <Link
              href="/atelier/rdv"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-accent text-brand font-medium text-sm tracking-[0.2em] uppercase hover:brightness-95 transition w-[240px]"
            >
              Prendre RDV
            </Link>
          </div>
        </div>

        {/* Flèche "scroll down" — sous les boutons, en bas du hero */}
        <a
          href="#suite"
          aria-label="Voir la suite"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/70 hover:text-brand-accent hero-anim"
          style={{ animationDelay: "1600ms" }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase">Découvrir</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-bounce">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* Ancrage */}
      <div id="suite" />

      {/* Chiffres */}
      <section className="bg-white border-b">
        <div className="container-x py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <Reveal delay={0}>
            <Stat label="Véhicules en stock">
              <CountUp end={70} suffix="+" />
            </Stat>
          </Reveal>
          <Reveal delay={120}>
            <Stat label="d'expérience">
              <CountUp end={25} suffix=" ans" />
            </Stat>
          </Reveal>
          <Reveal delay={240}>
            <Stat label="Note Google moyenne">
              <CountUp end={4.5} decimals={1} suffix=" / 5" />
            </Stat>
          </Reveal>
          <Reveal delay={360}>
            <Stat label="Garantie incluse">
              <CountUp end={6} suffix=" mois" />
            </Stat>
          </Reveal>
        </div>
      </section>

      {/* Partenaires assurances */}
      <Partners />

      {/* À la une */}
      <section className="container-x py-16">
        <Reveal>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Sélection</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Véhicules à la une</h2>
            </div>
            <Link href="/vehicules" className="text-sm tracking-widest uppercase text-brand hover:text-brand-accent">
              Voir tout le parc →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alaune.map((v, i) => (
            <Reveal key={v.id} delay={i * 100}>
              <VehiculeCard v={v} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-16">
        <div className="container-x text-center">
          <Reveal>
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Atelier</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Toutes les prestations</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <ServiceCard
                title="Mécanique"
                desc="Révision, vidange, freinage, embrayage, diagnostic. Agréé AXA et Direct Assurance."
                href="/atelier/mecanique"
              />
            </Reveal>
            <Reveal delay={150}>
              <ServiceCard
                title="Carrosserie"
                desc="Sinistres, peinture, redressage. Prise en charge assurance AXA et Direct Assurance."
                href="/atelier/carrosserie"
              />
            </Reveal>
            <Reveal delay={300}>
              <ServiceCard
                title="Contrôle technique"
                desc="Contrôle technique périodique et contre-visite, sur rendez-vous."
                href="/atelier/controle-technique"
              />
            </Reveal>
          </div>
          <Reveal delay={450}>
            <div className="mt-10">
              <Link
                href="/atelier/rdv"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reprise */}
      <section className="container-x py-16 grid md:grid-cols-2 gap-10 items-center">
        <Reveal variant="left">
          <div>
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Reprise & Achat</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Vous voulez vendre votre voiture ?</h2>
            <p className="mt-4 text-gray-700">
              Faites estimer votre véhicule gratuitement, en quelques clics. Reprise possible dans le cadre
              d'un achat ou en rachat cash.
            </p>
            <Link
              href="/vendre-reprendre"
              className="mt-6 inline-flex items-center justify-center px-8 py-3.5 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition"
            >
              Estimer mon véhicule
            </Link>
          </div>
        </Reveal>
        <Reveal variant="right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/reprise/900/600"
            alt="Reprise"
            className="rounded-sm shadow-md w-full h-auto"
          />
        </Reveal>
      </section>

      {/* Avis — défilement infini droite → gauche */}
      <section className="bg-brand-dark text-white py-16">
        <Reveal>
          <div className="container-x text-center">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Témoignages</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif">Ce que disent nos clients</h2>
          </div>
        </Reveal>

        <div className="marquee mt-10">
          <div className="marquee-track">
            {/* Le contenu est dupliqué pour donner l'illusion d'une boucle infinie */}
            {[...AVIS, ...AVIS].map((r, i) => (
              <Review key={i} name={r.name} note={r.note} text={r.text} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-serif text-brand tabular-nums">{children}</div>
      <div className="text-xs tracking-widest uppercase text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function ServiceCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="card p-6 hover:shadow-md transition-shadow block text-left">
      <div className="text-xl font-serif text-brand">{title}</div>
      <p className="mt-2 text-gray-600 text-sm">{desc}</p>
      <div className="mt-4 text-brand-accent text-xs tracking-[0.2em] uppercase font-medium">En savoir plus →</div>
    </Link>
  );
}

function Review({ name, note, text }: { name: string; note: number; text: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-sm p-6 text-left shrink-0 w-[320px] md:w-[360px]">
      <div className="text-brand-accent">{"★".repeat(note)}</div>
      <p className="mt-3 text-sm text-gray-100 leading-relaxed">"{text}"</p>
      <div className="mt-4 text-xs tracking-widest uppercase text-gray-400">— {name}</div>
    </div>
  );
}
