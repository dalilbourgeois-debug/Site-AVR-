import RdvFlow from "@/app/atelier/rdv/RdvFlow";

export const metadata = { title: "Prendre RDV — Carrosserie" };

export default function Page() {
  return (
    <div className="container-x py-10 max-w-3xl pb-24">
      <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">Atelier · Carrosserie</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Prendre RDV carrosserie</h1>
      <p className="mt-3 text-gray-600">
        Calendrier dédié à l'atelier carrosserie — créneaux indépendants de la mécanique et du
        contrôle technique. Agréé AXA et Direct Assurance pour les sinistres.
      </p>
      <div className="mt-8">
        <RdvFlow section="carrosserie" />
      </div>
    </div>
  );
}
