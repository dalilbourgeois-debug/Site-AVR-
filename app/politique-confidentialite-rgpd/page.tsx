import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Politique de confidentialité (RGPD)" };

export default function Page() {
  return (
    <LegalPage title="Politique de confidentialité (RGPD)">
      <p>AVR Automobile collecte et traite des données personnelles dans le respect du
      Règlement général sur la protection des données (RGPD, UE 2016/679) et de la loi
      Informatique et Libertés.</p>

      <h2>Responsable du traitement</h2>
      <p>AVR Automobile — 27 rue des Maraîchers, 44220 Couëron — contact@avr-automobile.fr</p>

      <h2>Données collectées</h2>
      <ul>
        <li>Nom, prénom, email, téléphone, adresse</li>
        <li>Coordonnées et caractéristiques de votre véhicule (pour reprise / RDV atelier)</li>
        <li>Données de paiement traitées exclusivement par Stripe</li>
      </ul>

      <h2>Finalités</h2>
      <ul>
        <li>Gestion des demandes de contact, RDV, essai, reprise</li>
        <li>Gestion des ventes et acomptes</li>
        <li>Suivi atelier et facturation</li>
        <li>Statistiques de navigation (anonymisées)</li>
      </ul>

      <h2>Durée de conservation</h2>
      <ul>
        <li>Données client : 3 ans à compter du dernier contact (prospects), 10 ans pour les factures</li>
        <li>Logs techniques : 12 mois</li>
      </ul>

      <h2>Vos droits</h2>
      <p>Vous pouvez accéder, rectifier, supprimer vos données ou demander leur portabilité en
      écrivant à contact@avr-automobile.fr. Vous pouvez également déposer une réclamation
      auprès de la CNIL (www.cnil.fr).</p>

      <h2>Cookies</h2>
      <p>Voir la page <a href="/cookies">Cookies</a>.</p>
    </LegalPage>
  );
}
