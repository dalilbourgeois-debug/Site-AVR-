import AtelierPageShell from "@/components/AtelierPageShell";

export const metadata = { title: "Mécanique automobile à Couëron" };

export default function Page() {
  return (
    <AtelierPageShell
      surtitre="Atelier · Mécanique"
      titre="Mécanique"
      description="Toutes les opérations d'entretien et de réparation, sur toutes marques. Devis clair avant intervention, factures détaillées, pièces neuves d'origine ou équivalentes."
      badge="Agréé AXA · Direct Assurance"
      image="https://picsum.photos/seed/meca-hero/1920/800"
      rdvHref="/atelier/rdv?service=vidange"
      prestations={[
        "Révision constructeur",
        "Vidange + filtres",
        "Freinage (plaquettes, disques, étriers)",
        "Embrayage",
        "Distribution",
        "Pneumatiques",
        "Géométrie / parallélisme",
        "Diagnostic électronique",
        "Climatisation (recharge, désinfection)",
        "Échappement, FAP, AdBlue",
        "Démarreur, alternateur, batterie",
        "Préparation contrôle technique"
      ]}
    />
  );
}
