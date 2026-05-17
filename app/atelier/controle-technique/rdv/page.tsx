import RdvFlow from "@/app/atelier/rdv/RdvFlow";

export const metadata = { title: "Prendre RDV — Contrôle technique" };

export default function Page() {
  return (
    <div className="container-x py-10 max-w-3xl pb-24">
      <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">Atelier · Contrôle technique</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Prendre RDV contrôle technique</h1>
      <p className="mt-3 text-gray-600">
        Calendrier dédié au contrôle technique — planning indépendant. Résultat remis en moins
        d'une heure.
      </p>
      <div className="mt-8">
        <RdvFlow section="controle-technique" />
      </div>
    </div>
  );
}
