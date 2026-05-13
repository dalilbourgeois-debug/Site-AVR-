import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Cookies" };

export default function Page() {
  return (
    <LegalPage title="Gestion des cookies">
      <p>Ce site utilise des cookies pour assurer son fonctionnement et mesurer son audience.</p>
      <h2>Cookies strictement nécessaires</h2>
      <p>Indispensables au fonctionnement (session, panier de réservation). Pas de consentement requis.</p>
      <h2>Cookies de mesure d'audience</h2>
      <p>Statistiques anonymisées. Vous pouvez les refuser via le bandeau de consentement
      affiché lors de votre première visite.</p>
      <h2>Cookies tiers</h2>
      <p>Stripe (paiement), Google Maps (cartographie). Activés uniquement si vous y consentez.</p>
      <h2>Modifier vos choix</h2>
      <p>Vous pouvez à tout moment modifier vos préférences en cliquant sur "Gérer mes cookies"
      en bas de page (à venir).</p>
    </LegalPage>
  );
}
