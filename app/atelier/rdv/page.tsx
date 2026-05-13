import RdvFlow from "./RdvFlow";

export const metadata = { title: "Prise de RDV atelier" };

export default async function RdvPage({
  searchParams
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="container-x py-10 max-w-3xl">
      <h1 className="text-3xl font-bold text-brand">Prendre rendez-vous à l'atelier</h1>
      <p className="mt-2 text-gray-600">
        Trois étapes : prestation, créneau, coordonnées. Confirmation par email et SMS.
      </p>
      <div className="mt-8">
        <RdvFlow servicePreset={sp.service} />
      </div>
    </div>
  );
}
