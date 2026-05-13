"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export type FilterValues = {
  prixMin?: number;
  prixMax?: number;
  kmMax?: number;
  energie?: string[];
  marque?: string[];
  boite?: string;
  tri?: string;
};

export default function Filters({
  marques,
  energies
}: {
  marques: string[];
  energies: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [v, setV] = useState<FilterValues>({});

  useEffect(() => {
    setV({
      prixMin: numOrU(params.get("prixMin")),
      prixMax: numOrU(params.get("prixMax")),
      kmMax: numOrU(params.get("kmMax")),
      energie: params.getAll("energie"),
      marque: params.getAll("marque"),
      boite: params.get("boite") ?? undefined,
      tri: params.get("tri") ?? undefined
    });
  }, [params]);

  function apply(next: FilterValues) {
    const sp = new URLSearchParams();
    if (next.prixMin) sp.set("prixMin", String(next.prixMin));
    if (next.prixMax) sp.set("prixMax", String(next.prixMax));
    if (next.kmMax) sp.set("kmMax", String(next.kmMax));
    next.energie?.forEach((e) => sp.append("energie", e));
    next.marque?.forEach((m) => sp.append("marque", m));
    if (next.boite) sp.set("boite", next.boite);
    if (next.tri) sp.set("tri", next.tri);
    router.push(`/vehicules?${sp.toString()}`);
  }

  function reset() {
    setV({});
    router.push("/vehicules");
  }

  function toggleArr(arr: string[] | undefined, val: string) {
    const set = new Set(arr ?? []);
    if (set.has(val)) set.delete(val);
    else set.add(val);
    return [...set];
  }

  return (
    <>
      <div className="lg:hidden">
        <button onClick={() => setOpen(true)} className="btn-outline w-full">
          Filtrer
        </button>
      </div>
      <aside
        className={`${open ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} lg:block lg:static lg:p-0 lg:bg-transparent`}
      >
        <div className="lg:sticky lg:top-20 space-y-5">
          <div className="flex items-center justify-between lg:hidden">
            <div className="font-semibold text-brand">Filtres</div>
            <button onClick={() => setOpen(false)} aria-label="Fermer">✕</button>
          </div>

          <div>
            <div className="label">Tri</div>
            <select
              className="input"
              value={v.tri ?? ""}
              onChange={(e) => setV({ ...v, tri: e.target.value || undefined })}
            >
              <option value="">Date d'arrivée</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="km-asc">Km croissant</option>
            </select>
          </div>

          <div>
            <div className="label">Prix (€)</div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="input"
                value={v.prixMin ?? ""}
                onChange={(e) => setV({ ...v, prixMin: numOrU(e.target.value) })}
              />
              <input
                type="number"
                placeholder="Max"
                className="input"
                value={v.prixMax ?? ""}
                onChange={(e) => setV({ ...v, prixMax: numOrU(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <div className="label">Kilométrage max</div>
            <input
              type="number"
              placeholder="ex : 100000"
              className="input"
              value={v.kmMax ?? ""}
              onChange={(e) => setV({ ...v, kmMax: numOrU(e.target.value) })}
            />
          </div>

          <div>
            <div className="label">Énergie</div>
            <div className="space-y-1">
              {energies.map((e) => (
                <label key={e} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={v.energie?.includes(e) ?? false}
                    onChange={() => setV({ ...v, energie: toggleArr(v.energie, e) })}
                  />
                  {e}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="label">Marque</div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {marques.map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={v.marque?.includes(m) ?? false}
                    onChange={() => setV({ ...v, marque: toggleArr(v.marque, m) })}
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="label">Boîte</div>
            <select
              className="input"
              value={v.boite ?? ""}
              onChange={(e) => setV({ ...v, boite: e.target.value || undefined })}
            >
              <option value="">Toutes</option>
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={() => apply(v)} className="btn-primary flex-1">Appliquer</button>
            <button onClick={reset} className="btn-outline">Réinit.</button>
          </div>
        </div>
      </aside>
    </>
  );
}

function numOrU(s: string | null | undefined) {
  if (!s) return undefined;
  const n = Number(s);
  return isFinite(n) ? n : undefined;
}
