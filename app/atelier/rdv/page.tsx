import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Prendre RDV atelier" };

const SECTIONS = [
  {
    href: "/atelier/mecanique/rdv",
    icon: "🔧",
    label: "Mécanique",
    desc: "Révision, freins, distribution, diagnostic, pneus, climatisation, vitrage…",
    color: "from-brand to-brand-light"
  },
  {
    href: "/atelier/carrosserie/rdv",
    icon: "🎨",
    label: "Carrosserie",
    desc: "Sinistre, peinture, redressage, pare-chocs, Smart Repair, polish…",
    color: "from-brand to-brand-light"
  },
  {
    href: "/atelier/controle-technique/rdv",
    icon: "📋",
    label: "Contrôle technique",
    desc: "Contrôle périodique et contre-visite. Résultat sous 1 heure.",
    color: "from-brand to-brand-light"
  }
];

export default function RdvHubPage() {
  return (
    <div className="container-x py-10 pb-24 max-w-5xl">
      <Reveal>
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">Réservation atelier</div>
          <h1 className="mt-3 text-3xl md:text-4xl font-serif text-brand">
            Quel service souhaitez-vous réserver ?
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Chaque atelier a son propre planning et son équipe dédiée. Choisissez votre univers
            pour voir ses créneaux disponibles.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.href} delay={i * 120}>
            <Link
              href={s.href}
              className="group block bg-white border border-gray-100 h-full hover:border-brand-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(255,0,0,0.20)]"
            >
              {/* Liseré rouge animé en haut */}
              <div className="h-[3px] bg-brand-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <div className="p-8 text-center">
                <div className="text-5xl">{s.icon}</div>
                <div className="mt-4 text-xl font-serif text-brand">{s.label}</div>
                <p className="mt-3 text-sm text-gray-600">{s.desc}</p>
                <div className="mt-6 inline-flex items-center text-xs tracking-[0.25em] uppercase text-brand-accent">
                  Réserver →
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center text-xs tracking-widest uppercase text-gray-500">
        Horaires atelier · Lundi → vendredi · 9h–12h / 14h–18h · fermé le week-end
      </div>
    </div>
  );
}
