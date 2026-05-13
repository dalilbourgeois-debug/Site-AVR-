import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Médiateur CNPA" };

export default function Page() {
  return (
    <LegalPage title="Médiateur du CNPA">
      <p>Conformément à l'article L.612-1 du Code de la consommation, le client peut recourir
      gratuitement au médiateur du Conseil national des professions de l'automobile (CNPA) en
      cas de litige non résolu avec AVR Automobile.</p>
      <h2>Coordonnées</h2>
      <p>
        Médiateur du CNPA<br />
        50 rue Rouget de Lisle<br />
        92158 Suresnes Cedex<br />
        Site : <a href="https://mediateur.cnpa.fr" target="_blank" rel="noreferrer">mediateur.cnpa.fr</a>
      </p>
      <h2>Conditions de saisine</h2>
      <ul>
        <li>Tentative préalable de résolution amiable directe avec AVR (par écrit)</li>
        <li>Saisine dans un délai d'un an à compter de la réclamation</li>
        <li>Litige n'ayant pas déjà été examiné par un autre médiateur ou un tribunal</li>
      </ul>
    </LegalPage>
  );
}
