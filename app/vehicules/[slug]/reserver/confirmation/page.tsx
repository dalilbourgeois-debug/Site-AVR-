import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getVehiculeBySlug } from "@/lib/data";

export const metadata = { title: "Réservation confirmée" };

export default async function ConfirmationPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; demo?: string; nom?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const v = getVehiculeBySlug(slug);
  if (!v) notFound();

  return (
    <div className="container-x py-16 max-w-2xl text-center">
      <CheckCircle2 size={72} strokeWidth={1.4} className="mx-auto text-brand-accent" aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-bold text-brand">Réservation confirmée</h1>
      <p className="mt-3 text-gray-700">
        Merci{sp.nom ? `, ${sp.nom}` : ""} ! Votre acompte est bien enregistré pour le{" "}
        <strong>{v.marque} {v.modele} {v.version}</strong>.
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Vous allez recevoir un email de confirmation. AVR vous contactera dans les 24 h ouvrées pour
        organiser la livraison ou le retrait du véhicule.
      </p>
      {sp.demo && (
        <p className="mt-6 text-xs text-amber-700 bg-amber-50 p-3 rounded">
          Démo : Stripe n'est pas encore configuré. Définissez <code>STRIPE_SECRET_KEY</code> dans <code>.env</code>{" "}
          pour activer le paiement réel.
        </p>
      )}
      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <Link href="/vehicules" className="btn-outline">Voir le parc</Link>
        <Link href="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
