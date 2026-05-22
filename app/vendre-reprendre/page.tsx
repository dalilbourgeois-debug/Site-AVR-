import SimpleForm from "@/components/SimpleForm";

export const metadata = { title: "Vendre ou faire reprendre votre véhicule" };

export default function VendreReprendrePage() {
  return (
    <div className="container-x py-12 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-brand">Vendre ou faire reprendre votre véhicule</h1>
      <p className="mt-4 text-gray-700">
        Vous voulez vendre votre voiture rapidement ou la faire reprendre dans le cadre d'un achat
        chez AVR ? Donnez-nous quelques informations, nous reviendrons vers vous sous 24 h ouvrées
        avec une estimation.
      </p>

      <div className="mt-8">
        <SimpleForm
          endpoint="/api/leads/vente"
          gateOnSubmit
          gateTitle="Pour envoyer votre demande"
          gateReason="Créez un compte (5 secondes avec Google) pour suivre votre estimation et retrouver la proposition du garage dans votre espace client. Vos infos déjà remplies sont conservées."
          fields={[
            {
              name: "type",
              label: "Type de demande",
              type: "select",
              required: true,
              options: [
                { value: "reprise", label: "Reprise dans le cadre d'un achat" },
                { value: "vente-cash", label: "Vente cash sans achat" }
              ]
            },
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
            { name: "description", label: "Description / historique", type: "textarea" },
            {
              name: "pieces",
              label: "Photos et documents (facultatif)",
              type: "files",
              hint: "Photos extérieur/intérieur, carte grise, factures d'entretien… 6 fichiers max, 5 Mo chacun.",
              maxFiles: 6,
              maxSizeMb: 5
            }
          ]}
          buttonLabel="Demander mon estimation"
        />
      </div>

      <p className="mt-6 text-xs text-gray-500">
        L'estimation finale sera confirmée après inspection du véhicule à notre atelier.
        Le contact (nom, email, téléphone) sera récupéré automatiquement depuis votre compte.
      </p>
    </div>
  );
}
