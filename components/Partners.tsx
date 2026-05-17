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
    <section className="bg-white py-8 border-b">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <div className="text-center md:text-right">
              <div className="text-[10px] tracking-[0.4em] text-brand-accent uppercase">Partenaires</div>
              <div className="mt-1 font-serif text-lg md:text-xl text-brand">Ils nous font déjà confiance</div>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {PARTENAIRES.map((p, i) =>
                p.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={p.src}
                    alt={p.name}
                    className="h-10 md:h-12 w-auto object-contain transition-transform hover:scale-105"
                  />
                ) : (
                  <div key={i} className="opacity-90 hover:opacity-100 transition">
                    {p.render()}
                  </div>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
