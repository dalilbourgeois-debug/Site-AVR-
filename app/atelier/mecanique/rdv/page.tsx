import RdvFlow from "@/app/atelier/rdv/RdvFlow";

export const metadata = { title: "Prendre RDV — Mécanique" };

export default function Page() {
  return (
    <div className="container-x py-10 max-w-3xl pb-24">
      <div className="text-xs tracking-[0.4em] uppercase text-brand-accent">Atelier · Mécanique</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Prendre RDV mécanique</h1>
      <p className="mt-3 text-gray-600">
        Calendrier dédié à l'atelier mécanique — créneaux indépendants de la carrosserie et du
        contrôle technique. Confirmation par email et SMS.
      </p>
      <div className="mt-8">
        <RdvFlow section="mecanique" />
      </div>
    </div>
  );
}
