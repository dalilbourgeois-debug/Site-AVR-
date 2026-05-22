"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatEur } from "@/lib/format";

type Estimation = {
  id: string;
  type: string;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  kilometrage: number | null;
  etat: string | null;
  description: string | null;
  prix_propose: number | null;
  reponse_admin: string | null;
  statut: string;
  created_at: string;
};

export default function EstimationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Estimation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("estimations")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setItems(data ?? []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div>
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mon espace</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Mes estimations</h1>
      <p className="mt-2 text-gray-600">
        Suivez vos demandes de reprise et les propositions du garage.
      </p>

      {loading && <div className="mt-8 text-sm text-gray-500">Chargement...</div>}

      {!loading && items.length === 0 && (
        <div className="mt-8 bg-white border border-gray-100 p-10 text-center">
          <div className="text-5xl">💰</div>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Aucune demande pour l'instant. Faites estimer votre véhicule gratuitement
            en quelques clics.
          </p>
          <Link
            href="/vendre-reprendre"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition"
          >
            Demander une estimation →
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-8 space-y-4">
          {items.map((it) => (
            <div key={it.id} className="bg-white border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-gray-500">
                    Demande du {formatDate(it.created_at)}
                  </div>
                  <div className="mt-1 font-serif text-lg text-brand">
                    {it.marque} {it.modele} {it.annee ? `(${it.annee})` : ""}
                  </div>
                  <div className="text-sm text-gray-600">
                    {it.kilometrage?.toLocaleString("fr-FR")} km · État : {it.etat ?? "—"}
                  </div>
                </div>
                <StatutBadge statut={it.statut} />
              </div>

              {it.statut === "propose" && it.prix_propose && (
                <div className="mt-4 bg-brand-accent/5 border-l-2 border-brand-accent p-4">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent">
                    Proposition du garage
                  </div>
                  <div className="mt-1 text-2xl font-serif text-brand">
                    {formatEur(Number(it.prix_propose))}
                  </div>
                  {it.reponse_admin && (
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      {it.reponse_admin}
                    </p>
                  )}
                </div>
              )}

              {it.description && (
                <details className="mt-3 text-sm">
                  <summary className="cursor-pointer text-gray-500 hover:text-brand-accent">
                    Votre description
                  </summary>
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{it.description}</p>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    en_attente: { label: "En attente", cls: "bg-amber-100 text-amber-800" },
    propose:    { label: "Proposition reçue", cls: "bg-green-100 text-green-800" },
    accepte:    { label: "Acceptée", cls: "bg-brand text-white" },
    refuse:     { label: "Refusée", cls: "bg-gray-200 text-gray-700" }
  };
  const c = cfg[statut] ?? cfg.en_attente;
  return (
    <span className={`inline-block text-[10px] tracking-widest uppercase px-2.5 py-1 ${c.cls}`}>
      {c.label}
    </span>
  );
}
