import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Conditions générales de vente" };

export default function Page() {
  return (
    <LegalPage title="Conditions générales de vente">
      <p>Les présentes CGV régissent les ventes de véhicules d'occasion et les prestations d'atelier
      proposées par AVR Automobile.</p>

      <h2>Réservation et acompte</h2>
      <p>La réservation d'un véhicule s'effectue par le versement d'un acompte de 5% du prix TTC.
      Cet acompte est encaissé via Stripe et déduit du prix final. En cas d'annulation par
      l'acheteur, l'acompte peut être conservé conformément aux articles 1590 et suivants du
      Code civil.</p>

      <h2>Garantie</h2>
      <p>Les véhicules vendus bénéficient d'une garantie de 6 mois pièces et main d'œuvre, en plus
      de la garantie légale de conformité (2 ans) et de la garantie des vices cachés.</p>

      <h2>Livraison</h2>
      <p>La livraison s'effectue dans nos locaux après paiement intégral et signature des documents.</p>

      <h2>Atelier</h2>
      <p>Les prestations d'atelier font l'objet d'un devis préalable signé par le client. Tout
      complément d'intervention requiert un nouvel accord.</p>

      <h2>Rétractation</h2>
      <p>Le droit de rétractation ne s'applique pas aux ventes conclues en magasin, conformément
      à l'article L221-2 du Code de la consommation.</p>

      <h2>Médiation</h2>
      <p>En cas de litige, le client peut saisir le médiateur du CNPA : voir page <a href="/mediateur-cnpa">Médiateur CNPA</a>.</p>
    </LegalPage>
  );
}
