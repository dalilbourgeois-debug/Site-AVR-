import Reveal from "./Reveal";

/**
 * Section "Ils nous font déjà confiance".
 *
 * Pour basculer des placeholders typographiques vers les VRAIS logos :
 *  1. Déposez les fichiers dans public/images/  (ex : logo-axa.png, logo-direct-assurance.png)
 *  2. Dans le tableau PARTENAIRES ci-dessous, remplacez `kind: "text"` par `kind: "image"` et indiquez le `src`.
 */

type Partenaire =
  | { kind: "text"; name: string; render: () => React.ReactNode }
  | { kind: "image"; name: string; src: string };

const PARTENAIRES: Partenaire[] = [
  { kind: "image", name: "AXA",              src: "/images/logo%20axa.png" },
  { kind: "image", name: "Direct Assurance", src: "/images/logo%20direct%20assurance.png" }
];

export default function Partners() {
  return (
    <section className="bg-white py-16 border-b">
      <div className="container-x text-center">
        <Reveal>
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Partenaires</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
            Ils nous font déjà confiance
          </h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Garage agréé pour la prise en charge complète de vos sinistres :
            expertise, déclaration et réparations, gérées de A à Z.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {PARTENAIRES.map((p, i) =>
              p.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={p.src}
                  alt={p.name}
                  className="h-16 md:h-20 w-auto object-contain transition-transform hover:scale-105"
                />
              ) : (
                <div key={i} className="opacity-90 hover:opacity-100 transition">
                  {p.render()}
                </div>
              )
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
