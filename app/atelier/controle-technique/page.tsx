import AtelierPageShell from "@/components/AtelierPageShell";

export const metadata = { title: "Contrôle technique" };

export default function Page() {
  return (
    <AtelierPageShell
      surtitre="Atelier · Contrôle technique"
      titre="Contrôle technique"
      description="Contrôle technique périodique et contre-visite, dans un atelier agréé. Rendez-vous rapide, résultat en moins d'une heure."
      image="https://picsum.photos/seed/ct-hero/1920/800"
      rdvHref="/atelier/controle-technique/rdv"
      prestations={[
        "Contrôle périodique (4ᵉ année puis tous les 2 ans)",
        "Contre-visite",
        "133 points contrôlés",
        "Rapport remis en main propre",
        "Préparation aux corrections",
        "Diagnostic électronique préventif"
      ]}
    />
  );
}
