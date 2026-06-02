import { notFound } from "next/navigation";
import { getVehiculeBySlug } from "@/lib/data";
import { formatEur } from "@/lib/format";
import ReservationFlow from "./ReservationFlow";
import RequireAuth from "@/components/RequireAuth";

export const metadata = { title: "Réserver ce véhicule" };

export default async function ReserverPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getVehiculeBySlug(slug);
  if (!v) notFound();

  const acompte = Math.round(v.prixTtc * 0.05);

  return (
    <div className="container-x py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-brand">Réserver ce véhicule</h1>
      <p className="mt-2 text-gray-600">
        Vous êtes sur le point de réserver le {v.marque} {v.modele} {v.version}. Un acompte
        de <strong>{formatEur(acompte)}</strong> (5% du prix) vous est demandé pour bloquer le véhicule.
      </p>

      <div className="mt-8">
        <RequireAuth
          title="Pour réserver ce véhicule"
          reason="Créez un compte pour verser l'acompte en toute sécurité. Vous retrouverez votre reçu et le suivi de votre réservation dans votre espace client."
        >
          <ReservationFlow
            slug={v.slug}
            prix={v.prixTtc}
            acompte={acompte}
            titre={`${v.marque} ${v.modele} ${v.version}`}
            photo={v.photos[0]}
          />
        </RequireAuth>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        L'acompte est encaissé via Stripe (paiement sécurisé). Il est déductible du prix final.
        Conditions complètes : <a href="/cgv" className="underline">CGV</a>.
      </p>
    </div>
  );
}
