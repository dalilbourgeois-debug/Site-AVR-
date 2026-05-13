import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Bloctel — opposition au démarchage téléphonique" };

export default function Page() {
  return (
    <LegalPage title="Bloctel — démarchage téléphonique">
      <p>Conformément à l'article L.223-1 du Code de la consommation, tout consommateur peut
      s'inscrire gratuitement sur la liste d'opposition au démarchage téléphonique Bloctel,
      afin de ne plus être démarché par des professionnels avec lesquels il n'a pas de relation
      contractuelle en cours.</p>
      <h2>Comment s'inscrire</h2>
      <p>L'inscription se fait directement sur le site officiel :{" "}
        <a href="https://www.bloctel.gouv.fr" target="_blank" rel="noreferrer">www.bloctel.gouv.fr</a>.
      </p>
      <h2>Engagement AVR Automobile</h2>
      <p>AVR Automobile s'engage à respecter la liste Bloctel et à ne pas contacter
      téléphoniquement les consommateurs inscrits, sauf relation contractuelle en cours.</p>
    </LegalPage>
  );
}
