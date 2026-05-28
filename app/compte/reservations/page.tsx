"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatEur } from "@/lib/format";

type Reservation = {
  id: string;
  vehicule_slug: string;
  vehicule_label: string;
  prix_total: number;
  montant_acompte: number;
  statut: string;
  created_at: string;
};

export default function ReservationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("reservations")
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
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Mes réservations</h1>
      <p className="mt-2 text-gray-600">
        Retrouvez vos acomptes versés et l'état de vos réservations.
      </p>

      {loading && <div className="mt-8 text-sm text-gray-500">Chargement...</div>}

      {!loading && items.length === 0 && (
        <div className="mt-8 bg-white border border-gray-100 p-10 text-center">
          <Car size={48} strokeWidth={1.4} className="mx-auto text-brand-accent" aria-hidden="true" />
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Aucune réservation pour l'instant. Découvrez notre parc et réservez
            le véhicule qui vous plaît avec un acompte de 5%.
          </p>
          <Link
            href="/vehicules"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition"
          >
            Voir le parc →
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-8 space-y-4">
          {items.map((r) => (
            <div key={r.id} className="bg-white border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-gray-500">
                    Réservé le {formatDate(r.created_at)}
                  </div>
                  <div className="mt-1 font-serif text-lg text-brand">
                    {r.vehicule_label}
                  </div>
                </div>
                <StatutBadge statut={r.statut} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-gray-500">
                    Acompte versé
                  </div>
                  <div className="mt-1 text-xl font-serif text-brand">
                    {formatEur(Number(r.montant_acompte))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest uppercase text-gray-500">
                    Prix total
                  </div>
                  <div className="mt-1 text-xl font-serif text-gray-600">
                    {formatEur(Number(r.prix_total))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/vehicules/${r.vehicule_slug}`}
                  className="inline-flex items-center justify-center h-10 px-4 border border-gray-300 text-gray-700 text-xs tracking-[0.2em] uppercase hover:border-brand-accent hover:text-brand-accent transition"
                >
                  Voir le véhicule
                </Link>
                {r.statut === "paid" && (
                  <button
                    disabled
                    className="inline-flex items-center justify-center h-10 px-4 bg-brand text-white text-xs tracking-[0.2em] uppercase opacity-60"
                    title="Disponible quand le garage vous le transmet"
                  >
                    Télécharger le reçu (à venir)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    pending:   { label: "En attente de paiement", cls: "bg-amber-100 text-amber-800" },
    paid:      { label: "Payée", cls: "bg-green-100 text-green-800" },
    completed: { label: "Véhicule livré", cls: "bg-brand text-white" },
    cancelled: { label: "Annulée", cls: "bg-gray-200 text-gray-700" }
  };
  const c = cfg[statut] ?? cfg.pending;
  return (
    <span className={`inline-block text-[10px] tracking-widest uppercase px-2.5 py-1 ${c.cls}`}>
      {c.label}
    </span>
  );
}
