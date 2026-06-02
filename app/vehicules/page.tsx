import Filters from "@/components/Filters";
import VehiculeCard from "@/components/VehiculeCard";
import Reveal from "@/components/Reveal";
import { getVehicules } from "@/lib/data";

export const metadata = { title: "Nos véhicules d'occasion" };

type SP = Record<string, string | string[] | undefined>;

export default async function VehiculesListPage({
  searchParams
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const tous = await getVehicules();

  const marques = [...new Set(tous.map((v) => v.marque))].sort();
  const energies = [...new Set(tous.map((v) => v.energie))].sort();

  const prixMin = num(sp.prixMin);
  const prixMax = num(sp.prixMax);
  const kmMax = num(sp.kmMax);
  const energie = arr(sp.energie);
  const marque = arr(sp.marque);
  const boite = str(sp.boite);
  const tri = str(sp.tri);

  let liste = tous.filter((v) => {
    if (prixMin && v.prixTtc < prixMin) return false;
    if (prixMax && v.prixTtc > prixMax) return false;
    if (kmMax && v.kilometrage > kmMax) return false;
    if (energie.length && !energie.includes(v.energie)) return false;
    if (marque.length && !marque.includes(v.marque)) return false;
    if (boite && v.boite !== boite) return false;
    return true;
  });

  if (tri === "prix-asc") liste.sort((a, b) => a.prixTtc - b.prixTtc);
  else if (tri === "prix-desc") liste.sort((a, b) => b.prixTtc - a.prixTtc);
  else if (tri === "km-asc") liste.sort((a, b) => a.kilometrage - b.kilometrage);
  else liste.sort((a, b) => b.dateArrivee.localeCompare(a.dateArrivee));

  return (
    <>
      <div className="container-x py-10">
        <Reveal>
          <div className="mb-8">
            <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Notre parc</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
              Véhicules d'occasion
            </h1>
            <p className="mt-2 text-gray-600">
              {liste.length} véhicule{liste.length > 1 ? "s" : ""} disponible{liste.length > 1 ? "s" : ""} —
              garantie 6 mois incluse, expertise mécanique avant livraison.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          <Filters marques={marques} energies={energies} />
          <div>
            {liste.length === 0 ? (
              <div className="bg-white border border-gray-100 p-12 text-center text-gray-500">
                Aucun véhicule ne correspond à vos critères.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {liste.map((v, i) => (
                  <Reveal key={v.id} delay={(i % 6) * 80}>
                    <VehiculeCard v={v} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function num(x: string | string[] | undefined) {
  const s = Array.isArray(x) ? x[0] : x;
  const n = s ? Number(s) : NaN;
  return isFinite(n) ? n : undefined;
}
function str(x: string | string[] | undefined) {
  return Array.isArray(x) ? x[0] : x;
}
function arr(x: string | string[] | undefined): string[] {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}
