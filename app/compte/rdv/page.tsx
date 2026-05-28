"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wrench, Paintbrush, ClipboardCheck, type LucideIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";

type RDV = {
  id: string;
  section: string;
  prestation: string;
  description: string | null;
  jour: string | null;
  heure: string | null;
  immatriculation: string | null;
  statut: string;
  created_at: string;
};

const SECTION_LABEL: Record<string, { label: string; Icon: LucideIcon }> = {
  mecanique:            { label: "Mécanique", Icon: Wrench },
  carrosserie:          { label: "Carrosserie", Icon: Paintbrush },
  "controle-technique": { label: "Contrôle technique", Icon: ClipboardCheck }
};

export default function RdvPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<RDV[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("rdv_atelier")
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
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Mes rendez-vous</h1>
      <p className="mt-2 text-gray-600">
        Vos rendez-vous mécanique, carrosserie et contrôle technique.
      </p>

      {loading && <div className="mt-8 text-sm text-gray-500">Chargement...</div>}

      {!loading && items.length === 0 && (
        <div className="mt-8 bg-white border border-gray-100 p-10 text-center">
          <Wrench size={48} strokeWidth={1.4} className="mx-auto text-brand-accent" aria-hidden="true" />
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Aucun rendez-vous pour l'instant. Prenez RDV en quelques clics pour
            une intervention sur votre véhicule.
          </p>
          <Link
            href="/atelier"
            className="mt-6 inline-flex items-center justify-center h-11 px-6 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition"
          >
            Découvrir l'atelier →
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-8 space-y-4">
          {items.map((r) => {
            const sec = SECTION_LABEL[r.section] ?? { label: r.section, Icon: Wrench };
            return (
              <div key={r.id} className="bg-white border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs tracking-[0.3em] uppercase text-brand-accent">
                      <sec.Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                      <span>{sec.label}</span>
                    </div>
                    <div className="mt-1 font-serif text-lg text-brand">{r.prestation}</div>
                    {r.immatriculation && (
                      <div className="text-sm text-gray-600">
                        Immat : {r.immatriculation}
                      </div>
                    )}
                  </div>
                  <StatutBadge statut={r.statut} />
                </div>

                <div className="mt-4 flex items-center gap-6 text-sm border-t border-gray-100 pt-4">
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-gray-500">Jour</div>
                    <div className="mt-1 text-brand font-medium">
                      {r.jour ? formatDate(r.jour) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-widest uppercase text-gray-500">Heure</div>
                    <div className="mt-1 text-brand font-medium">{r.heure ?? "—"}</div>
                  </div>
                </div>

                {r.description && (
                  <details className="mt-3 text-sm">
                    <summary className="cursor-pointer text-gray-500 hover:text-brand-accent">
                      Votre description
                    </summary>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{r.description}</p>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatutBadge({ statut }: { statut: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    pending:   { label: "En attente de confirmation", cls: "bg-amber-100 text-amber-800" },
    confirmed: { label: "Confirmé", cls: "bg-green-100 text-green-800" },
    completed: { label: "Terminé", cls: "bg-brand text-white" },
    cancelled: { label: "Annulé", cls: "bg-gray-200 text-gray-700" }
  };
  const c = cfg[statut] ?? cfg.pending;
  return (
    <span className={`inline-block text-[10px] tracking-widest uppercase px-2.5 py-1 ${c.cls}`}>
      {c.label}
    </span>
  );
}
