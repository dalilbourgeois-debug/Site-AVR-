"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";

type Doc = {
  id: string;
  type: string;
  nom: string;
  storage_path: string;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

const TYPE_LABEL: Record<string, string> = {
  facture:        "Facture",
  devis:          "Devis",
  carte_grise:    "Carte grise",
  estimation:     "Estimation",
  recu_acompte:   "Reçu d'acompte",
  autre:          "Document"
};

const TYPE_ICON: Record<string, string> = {
  facture:      "🧾",
  devis:        "📋",
  carte_grise:  "🚗",
  estimation:   "💰",
  recu_acompte: "💳",
  autre:        "📄"
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
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

  async function download(doc: Doc) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("client-documents")
      .createSignedUrl(doc.storage_path, 60); // URL valide 60 secondes
    if (error || !data) {
      alert("Impossible de générer le lien de téléchargement.");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div>
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mon espace</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Mes documents</h1>
      <p className="mt-2 text-gray-600">
        Factures, devis et documents transmis par le garage.
      </p>

      {loading && <div className="mt-8 text-sm text-gray-500">Chargement...</div>}

      {!loading && items.length === 0 && (
        <div className="mt-8 bg-white border border-gray-100 p-10 text-center">
          <div className="text-5xl">📄</div>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Aucun document pour l'instant. Quand le garage vous transmettra une
            facture ou un devis, vous le retrouverez ici.
          </p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-8 bg-white border border-gray-100">
          {items.map((d, i) => (
            <div
              key={d.id}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-gray-100" : ""}`}
            >
              <div className="text-2xl shrink-0">{TYPE_ICON[d.type] ?? "📄"}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] tracking-widest uppercase text-brand-accent">
                  {TYPE_LABEL[d.type] ?? "Document"}
                </div>
                <div className="text-sm font-medium text-brand truncate">{d.nom}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Reçu le {formatDate(d.created_at)}
                  {d.size_bytes && ` · ${(d.size_bytes / 1024 / 1024).toFixed(1)} Mo`}
                </div>
              </div>
              <button
                onClick={() => download(d)}
                className="shrink-0 inline-flex items-center justify-center h-10 px-4 border border-gray-300 text-gray-700 text-xs tracking-[0.2em] uppercase hover:border-brand-accent hover:text-brand-accent transition"
              >
                Télécharger
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
