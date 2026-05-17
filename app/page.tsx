import Link from "next/link";
import Reveal from "@/components/Reveal";
import Partners from "@/components/Partners";
import CountUp from "@/components/CountUp";

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
  return (
    <>
      {/* HERO SPLIT — 2 panneaux : VOIR LE PARC | ATELIER */}
      <section
        id="hero"
        className="relative w-full text-white overflow-hidden"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        {/* Version desktop : split diagonal */}
        <div className="hidden md:block absolute inset-0">
          {/* MOITIÉ GAUCHE — Le parc */}
          <div
            className="absolute inset-0"
            style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 100%), url(/images/AVR%20image%20hero%202.jpg)"
              }}
            />
            <div className="absolute inset-y-0 left-0 w-[45%] flex flex-col items-center justify-center text-center px-8 hero-text">
              <div
                className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
                style={{ animationDelay: "150ms" }}
              >
                Concession · Couëron
              </div>
              <h2
                className="mt-6 font-serif text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight hero-title hero-anim hero-anim-title"
                style={{ animationDelay: "350ms" }}
              >
                LE PARC
              </h2>
              <p
                className="mt-6 max-w-md text-sm lg:text-base text-white/90 hero-anim"
                style={{ animationDelay: "900ms" }}
              >
                Plus de 70 véhicules d'occasion expertisés et garantis 6 mois.
                Reprise possible de votre voiture actuelle.
              </p>
              <Link
                href="/vehicules"
                className="mt-8 inline-flex items-center justify-center h-14 w-[240px] bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition hero-anim"
                style={{ animationDelay: "1100ms" }}
              >
                Découvrir →
              </Link>
            </div>
          </div>

          {/* MOITIÉ DROITE — Atelier */}
          <div
            className="absolute inset-0"
            style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
          >
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.65) 100%), url(/images/image%20hero%203.avif)",
                backgroundPosition: "10% center"
              }}
            />
            <div className="absolute inset-y-0 right-0 w-[45%] flex flex-col items-center justify-center text-center px-8 hero-text">
              <div
                className="text-xs md:text-sm tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent"
                style={{ animationDelay: "250ms" }}
              >
                Atelier · Couëron
              </div>
              <h2
                className="mt-6 font-serif text-4xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight hero-title hero-anim hero-anim-title"
                style={{ animationDelay: "450ms" }}
              >
                L'ATELIER
              </h2>
              <p
                className="mt-6 max-w-md text-sm lg:text-base text-white/90 hero-anim"
                style={{ animationDelay: "1000ms" }}
              >
                Mécanique, carrosserie, contrôle technique.
                Agréé AXA et Direct Assurance — sinistre pris en charge de A à Z.
              </p>
              <Link
                href="/atelier"
                className="mt-8 inline-flex items-center justify-center h-14 w-[240px] bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition hero-anim"
                style={{ animationDelay: "1200ms" }}
              >
                Prendre RDV →
              </Link>
            </div>
          </div>

          {/* Ligne diagonale rouge subtile entre les deux panneaux */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <line x1="55" y1="0" x2="45" y2="100" stroke="#FF0000" strokeWidth="0.25" />
            </svg>
          </div>
        </div>

        {/* Version mobile : panneaux empilés sans diagonal */}
        <div className="md:hidden">
          {/* Le parc */}
          <div
            className="relative h-[55vh] min-h-[420px] bg-cover bg-center flex flex-col items-center justify-center text-center px-6 hero-text"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.65) 100%), url(/images/AVR%20image%20hero%202.jpg)"
            }}
          >
            <div className="text-[10px] tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent">
              Concession · Couëron
            </div>
            <h2 className="mt-4 font-serif text-4xl leading-tight hero-title hero-anim hero-anim-title">
              LE PARC
            </h2>
            <p className="mt-3 text-sm text-white/90 max-w-sm hero-anim">
              70+ véhicules expertisés, garantis 6 mois.
            </p>
            <Link
              href="/vehicules"
              className="mt-5 inline-flex items-center justify-center h-12 w-[200px] bg-brand-accent text-white text-xs tracking-[0.2em] uppercase hover:brightness-110 transition"
            >
              Découvrir →
            </Link>
          </div>

          {/* Atelier */}
          <div
            className="relative h-[55vh] min-h-[420px] bg-cover bg-center flex flex-col items-center justify-center text-center px-6 hero-text border-t-2 border-brand-accent"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.70) 100%), url(/images/image%20hero%203.avif)"
            }}
          >
            <div className="text-[10px] tracking-[0.4em] text-brand-accent uppercase hero-anim hero-accent">
              Atelier · Couëron
            </div>
            <h2 className="mt-4 font-serif text-4xl leading-tight hero-title hero-anim hero-anim-title">
              L'ATELIER
            </h2>
            <p className="mt-3 text-sm text-white/90 max-w-sm hero-anim">
              Mécanique · Carrosserie · CT — Agréé AXA, Direct Assurance.
            </p>
            <Link
              href="/atelier"
              className="mt-5 inline-flex items-center justify-center h-12 w-[200px] bg-brand-accent text-white text-xs tracking-[0.2em] uppercase hover:brightness-110 transition"
            >
              Prendre RDV →
            </Link>
          </div>
        </div>
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

      {/* LE GARAGE — Notre histoire + équipe */}
      <section className="container-x py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <Reveal variant="left">
            <div>
              <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Le garage</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Notre histoire</h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                AVR Automobile est né de la passion de l'auto et du goût du travail bien fait.
                Depuis nos premières années à Couëron, nous accompagnons des centaines de clients
                chaque année — choix d'un véhicule d'occasion, entretien régulier, sinistre,
                contrôle technique.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Notre force : être à la fois <strong>vendeur et atelier</strong>, donc capables de
                garantir ce que nous vendons.
              </p>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">L'équipe</div>
                <p className="mt-2 text-gray-700">
                  Une dizaine de personnes au quotidien : commerciaux, mécaniciens, carrossiers,
                  contrôleur technique. Tous formés, tous passionnés, tous à votre écoute.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal variant="right">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/avr-equipe/1200/900"
              alt="L'équipe AVR Automobile"
              className="w-full h-auto shadow-md"
            />
          </Reveal>
        </div>
      </section>

      {/* NOUS TROUVER — adresse + carte */}
      <section className="bg-gray-50 py-20">
        <div className="container-x">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Visite</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Nous trouver</h2>
              <p className="mt-3 text-gray-600">
                Au 27 rue des Maraîchers à Couëron, à 5 minutes du centre de Nantes par le pont de Cheviré.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal variant="left">
              <div className="bg-white p-8 h-full">
                <InfoRow label="Adresse">
                  27 rue des Maraîchers<br />
                  44220 Couëron
                </InfoRow>
                <InfoRow label="Téléphone">
                  <a href="tel:0240862102" className="text-brand-accent hover:brightness-110">
                    02 40 86 21 02
                  </a>
                </InfoRow>
                <InfoRow label="Horaires">
                  Lundi – Vendredi · 9h → 12h / 14h → 18h<br />
                  Samedi · Fermé<br />
                  Dimanche · Fermé
                </InfoRow>
                <InfoRow label="Transports" last>
                  Bus ligne 93 — arrêt Maraîchers
                </InfoRow>
              </div>
            </Reveal>
            <Reveal variant="right">
              <div className="overflow-hidden border bg-white aspect-[4/3] h-full">
                <iframe
                  title="Carte AVR Automobile"
                  src="https://www.google.com/maps?q=27+rue+des+Maraichers+44220+Coueron&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>
        </div>
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

function InfoRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={`py-4 ${last ? "" : "border-b border-gray-100"}`}>
      <div className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">{label}</div>
      <div className="text-sm text-gray-800 leading-relaxed">{children}</div>
    </div>
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
