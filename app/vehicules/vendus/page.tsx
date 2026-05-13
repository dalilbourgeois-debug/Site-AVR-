import { getVendus } from "@/lib/data";
import { formatDate, formatEur, formatKm } from "@/lib/format";
import Link from "next/link";

export const metadata = {
  title: "Véhicules vendus récemment",
  description: "Découvrez les véhicules récemment vendus par AVR Automobile."
};

export default function VendusPage() {
  const liste = getVendus();
  return (
    <div className="container-x py-10">
      <h1 className="text-3xl font-bold text-brand">Vendus récemment</h1>
      <p className="mt-2 text-gray-600 max-w-2xl">
        Une sélection des véhicules récemment vendus par AVR Automobile. Vous cherchez un véhicule similaire ?
        Contactez-nous, nous pouvons probablement en retrouver un.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {liste.map((v) => (
          <div key={v.id} className="card relative">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.photos[0]} alt="" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-brand text-white px-4 py-2 rounded font-semibold tracking-wider">VENDU</div>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 uppercase">{v.marque}</div>
              <div className="font-semibold text-brand">{v.modele}</div>
              <div className="text-sm text-gray-600 line-clamp-1">{v.version}</div>
              <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-gray-600">
                <span>{v.annee}</span>
                <span>·</span>
                <span>{formatKm(v.kilometrage)}</span>
                <span>·</span>
                <span>{v.energie}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-lg font-bold text-gray-400 line-through">{formatEur(v.prixTtc)}</div>
                {v.dateSortie && (
                  <div className="text-xs text-gray-500">Vendu le {formatDate(v.dateSortie)}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/vehicules" className="btn-primary">Voir les véhicules disponibles</Link>
      </div>
    </div>
  );
}
