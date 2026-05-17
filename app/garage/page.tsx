export const metadata = { title: "Le garage AVR Automobile" };

export default function GaragePage() {
  return (
    <>
      <section className="bg-brand text-white">
        <div className="container-x py-16">
          <h1 className="text-4xl md:text-5xl font-bold">Le garage AVR</h1>
          <p className="mt-4 max-w-2xl text-gray-200 text-lg">
            Un garage indépendant, multimarque, au cœur de Couëron. Vente, atelier, carrosserie,
            contrôle technique : on s'occupe de tout, du conseil à la livraison.
          </p>
        </div>
      </section>

      <section className="container-x py-12 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10">
        <div>
          <h2 className="text-2xl font-bold text-brand">Notre histoire</h2>
          <p className="mt-4 text-gray-700 text-sm leading-relaxed">
            AVR Automobile est né de la passion de l'auto et du goût du travail bien fait.
            Depuis nos premières années à Couëron, nous accompagnons des centaines de clients
            chaque année : choix d'un véhicule d'occasion, entretien régulier, sinistre,
            contrôle technique. Notre force : être à la fois vendeur et atelier, donc capables
            de garantir ce que nous vendons.
          </p>
          <h3 className="mt-6 text-lg font-semibold text-brand">L'équipe</h3>
          <p className="mt-2 text-gray-700 text-sm">
            Une dizaine de personnes au quotidien : commerciaux, mécaniciens, carrossiers,
            contrôleur technique.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/equipe/1200/800"
          alt="L'équipe AVR"
          className="rounded-lg shadow-md w-full h-auto"
        />
      </section>

      <section className="bg-gray-50 py-12">
        <div className="container-x grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-brand">Nous trouver</h2>
            <ul className="mt-4 text-sm space-y-2 text-gray-700">
              <li><strong>Adresse :</strong> 27 rue des Maraîchers, 44220 Couëron</li>
              <li><strong>Téléphone :</strong> 02 40 86 21 02</li>
              <li><strong>Horaires :</strong> Lun–Ven 9h–12h / 14h–18h · fermé le week-end</li>
              <li><strong>Transports :</strong> Bus ligne 93</li>
            </ul>
          </div>
          <div className="rounded-lg overflow-hidden border bg-white aspect-[4/3]">
            <iframe
              title="Carte AVR Automobile"
              src="https://www.google.com/maps?q=27+rue+des+Maraichers+44220+Coueron&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <h2 className="text-2xl font-bold text-brand">Avis clients</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Marie L.", text: "Conseil au top, ils ont pris le temps de m'expliquer." },
            { name: "Patrick V.", text: "Voiture impeccable, prix juste, garantie tenue." },
            { name: "Karim B.", text: "Atelier réactif quand j'ai eu un souci, problème réglé le jour même." }
          ].map((r) => (
            <div key={r.name} className="card p-6">
              <div className="text-brand-accent">★★★★★</div>
              <p className="mt-3 text-sm text-gray-700">"{r.text}"</p>
              <div className="mt-3 text-xs text-gray-500">— {r.name}, Google Reviews</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
