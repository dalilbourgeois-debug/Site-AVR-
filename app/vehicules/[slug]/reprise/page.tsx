import { notFound } from "next/navigation";
import { getVehiculeBySlug } from "@/lib/data";
import SimpleForm from "@/components/SimpleForm";
import RequireAuth from "@/components/RequireAuth";

export const metadata = { title: "Reprise dans le cadre d'un achat" };

export default async function RepriseVehiculePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVehiculeBySlug(slug);
  if (!v) notFound();

  return (
    <div className="container-x py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand">Reprise de votre véhicule</h1>
      <p className="mt-2 text-gray-600">
        Vous êtes intéressé par le {v.marque} {v.modele} et souhaitez nous remettre votre véhicule
        actuel ? Donnez-nous quelques informations, nous reviendrons vers vous avec une estimation.
      </p>

      <div className="mt-8">
        <RequireAuth
          title="Pour faire estimer votre véhicule"
          reason="Créez un compte pour suivre votre demande et retrouver la proposition du garage directement dans votre espace."
        >
          <SimpleForm
            endpoint="/api/leads/reprise"
          hidden={{ veh_souhaite_slug: v.slug }}
          fields={[
            { name: "immat", label: "Immatriculation", required: true, placeholder: "AB-123-CD" },
            { name: "marque", label: "Marque", required: true },
            { name: "modele", label: "Modèle", required: true },
            { name: "annee", label: "Année", type: "number", required: true },
            { name: "km", label: "Kilométrage", type: "number", required: true },
            {
              name: "etat",
              label: "État général",
              type: "select",
              required: true,
              options: [
                { value: "tres-bon", label: "Très bon état" },
                { value: "bon", label: "Bon état" },
                { value: "moyen", label: "État moyen" },
                { value: "a-reparer", label: "À réparer" }
              ]
            },
            { name: "description", label: "Description / commentaire", type: "textarea" },
            {
              name: "pieces",
              label: "Photos et documents (facultatif)",
              type: "files",
              hint: "Photos extérieur/intérieur, carte grise, factures d'entretien… 6 fichiers max, 5 Mo chacun.",
              maxFiles: 6,
              maxSizeMb: 5
            },
            { name: "nom", label: "Nom complet", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "telephone", label: "Téléphone", type: "tel", required: true }
          ]}
        />
        </RequireAuth>
      </div>
    </div>
  );
}
