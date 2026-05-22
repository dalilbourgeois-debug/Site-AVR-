import { Suspense } from "react";
import RdvFlow from "@/app/atelier/rdv/RdvFlow";
import RequireAuth from "@/components/RequireAuth";

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
        <RequireAuth
          title="Pour réserver un contrôle technique"
          reason="Créez un compte pour qu'on puisse vous envoyer la confirmation et que vous receviez votre rapport directement dans votre espace."
        >
          <Suspense fallback={<div className="text-sm text-gray-500">Chargement du calendrier...</div>}>
            <RdvFlow section="controle-technique" />
          </Suspense>
        </RequireAuth>
      </div>
    </div>
  );
}
