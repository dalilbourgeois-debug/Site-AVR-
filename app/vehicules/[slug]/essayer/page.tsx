import { notFound } from "next/navigation";
import { getVehiculeBySlug } from "@/lib/data";
import SimpleForm from "@/components/SimpleForm";

export const metadata = { title: "Demande d'essai" };

export default async function EssayerPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVehiculeBySlug(slug);
  if (!v) notFound();

  return (
    <div className="container-x py-10 max-w-2xl">
      <h1 className="text-3xl font-bold text-brand">Demande d'essai</h1>
      <p className="mt-2 text-gray-600">
        Vous souhaitez essayer le {v.marque} {v.modele} {v.version} ? Remplissez ce formulaire,
        nous vous recontacterons pour fixer un créneau.
      </p>

      <div className="mt-8">
        <SimpleForm
          endpoint="/api/leads/essai"
          hidden={{ slug: v.slug, vin: v.vin }}
          fields={[
            { name: "nom", label: "Nom complet", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "telephone", label: "Téléphone", type: "tel", required: true },
            {
              name: "creneau",
              label: "Créneau souhaité",
              type: "select",
              required: true,
              options: [
                { value: "semaine-matin", label: "En semaine, matin" },
                { value: "semaine-aprem", label: "En semaine, après-midi" },
                { value: "samedi", label: "Le samedi" }
              ]
            },
            { name: "message", label: "Message (facultatif)", type: "textarea" }
          ]}
        />
      </div>
    </div>
  );
}
