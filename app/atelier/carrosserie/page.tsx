import AtelierPageShell from "@/components/AtelierPageShell";

export const metadata = { title: "Carrosserie et peinture" };

export default function Page() {
  return (
    <AtelierPageShell
      surtitre="Atelier · Carrosserie"
      titre="Carrosserie"
      description="Choc, accrochage, rayure, grêle : remise en état complète de votre véhicule. Nous gérons l'ensemble du dossier avec votre assurance."
      badge="Agréé AXA · Direct Assurance — sinistre géré de A à Z"
      image="/images/image%20carrosserie.png"
      rdvHref="/atelier/carrosserie/rdv"
      prestations={[
        "Réparation tôlerie",
        "Redressage châssis (banc)",
        "Peinture cabine professionnelle",
        "Pare-chocs / éléments plastique",
        "Remplacement pare-brise",
        "Smart Repair (petites rayures, impacts)",
        "Polish / rénovation peinture",
        "Anti-corrosion et traitement sous caisse",
        "Déclaration de sinistre",
        "Organisation de l'expertise",
        "Véhicule de courtoisie sur demande",
        "Restitution nettoyée"
      ]}
    />
  );
}
