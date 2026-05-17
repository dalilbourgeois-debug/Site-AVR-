import Link from "next/link";

const legal = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/politique-confidentialite-rgpd", label: "Politique de confidentialité (RGPD)" },
  { href: "/cookies", label: "Cookies" },
  { href: "/mediateur-cnpa", label: "Médiateur CNPA" },
  { href: "/bloctel", label: "Bloctel" }
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-200 mt-12">
      <div className="container-x py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-white">AVR Automobile</div>
          <p className="mt-3 text-sm text-gray-400">
            Garage multimarque depuis plusieurs années. Vente, mécanique, carrosserie, contrôle technique.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Coordonnées</div>
          <ul className="mt-3 text-sm space-y-1 text-gray-400">
            <li>27 rue des Maraîchers</li>
            <li>44220 Couëron</li>
            <li>02 40 86 21 02</li>
            <li>Bus ligne 93</li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Le site</div>
          <ul className="mt-3 text-sm space-y-1">
            <li><Link href="/vehicules" className="hover:text-white text-gray-400">Nos véhicules</Link></li>
            <li><Link href="/atelier" className="hover:text-white text-gray-400">Atelier</Link></li>
            <li><Link href="/vendre-reprendre" className="hover:text-white text-gray-400">Vendre / Reprendre</Link></li>
            <li><Link href="/contact" className="hover:text-white text-gray-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Informations légales</div>
          <ul className="mt-3 text-sm space-y-1">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white text-gray-400">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-4 text-xs text-gray-400 flex flex-col sm:flex-row gap-2 sm:justify-between">
          <div>© {new Date().getFullYear()} AVR Automobile. Tous droits réservés.</div>
          <div>Conçu pour la vente et l'entretien automobile à Couëron.</div>
        </div>
      </div>
    </footer>
  );
}
