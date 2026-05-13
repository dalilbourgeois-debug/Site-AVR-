import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>AVR Automobile — 27 rue des Maraîchers, 44220 Couëron — Tél : 02 40 86 21 02 — Email : contact@avr-automobile.fr</p>
      <p>SIRET : [à compléter] · RCS : [à compléter] · TVA : [à compléter]</p>
      <p>Directeur de la publication : [Nom du gérant]</p>

      <h2>Hébergeur</h2>
      <p>[OVH SAS, 2 rue Kellermann, 59100 Roubaix — à confirmer]</p>

      <h2>Propriété intellectuelle</h2>
      <p>L'ensemble des éléments présents sur ce site (textes, images, logos) est protégé. Toute reproduction sans autorisation est interdite.</p>

      <h2>Crédits photos</h2>
      <p>Photographies des véhicules : AVR Automobile. Photographies d'illustration : licences libres.</p>
    </LegalPage>
  );
}
