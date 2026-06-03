import SimpleForm from "@/components/SimpleForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-x py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-3xl font-bold text-brand">Contactez-nous</h1>
        <p className="mt-2 text-gray-600">
          Une question, un devis, un véhicule particulier à rechercher ? Écrivez-nous, nous
          répondons sous 24 h ouvrées.
        </p>
        <ul className="mt-6 text-sm text-gray-700 space-y-2">
          <li><strong>Adresse :</strong> 27 rue des Maraîchers, 44220 Couëron</li>
          <li><strong>Téléphone :</strong> 02 40 86 21 02</li>
          <li><strong>Email :</strong> contact@avr-automobile.fr</li>
          <li><strong>Horaires :</strong> Lun–Ven 8h–12h / 14h–19h · Sam 9h–12h / 14h–18h · fermé le dimanche</li>
        </ul>
        <div className="mt-6 rounded-lg overflow-hidden border bg-white aspect-[4/3]">
          <iframe
            title="Carte AVR"
            src="https://www.google.com/maps?q=27+rue+des+Maraichers+44220+Coueron&output=embed"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
      </div>
      <div>
        <SimpleForm
          endpoint="/api/leads/contact"
          fields={[
            { name: "nom", label: "Nom complet", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "telephone", label: "Téléphone", type: "tel" },
            { name: "sujet", label: "Sujet", required: true },
            { name: "message", label: "Message", type: "textarea", required: true }
          ]}
        />
      </div>
    </div>
  );
}
