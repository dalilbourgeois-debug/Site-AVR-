"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

export default function ComptePage() {
  const { user, profile } = useAuth();
  const [counts, setCounts] = useState({
    favoris: 0,
    estimations: 0,
    reservations: 0,
    rdv: 0,
    documents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      // Récupère les comptes en parallèle pour les 5 tables
      const [fav, est, res, rdv, doc] = await Promise.all([
        supabase.from("favoris").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("estimations").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("reservations").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("rdv_atelier").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("documents").select("*", { count: "exact", head: true }).eq("user_id", user!.id)
      ]);

      if (cancelled) return;
      setCounts({
        favoris: fav.count ?? 0,
        estimations: est.count ?? 0,
        reservations: res.count ?? 0,
        rdv: rdv.count ?? 0,
        documents: doc.count ?? 0
      });
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  const prenom = profile?.prenom ?? "";

  return (
    <div>
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mon espace</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">
        Bonjour{prenom ? `, ${prenom}` : ""} 👋
      </h1>
      <p className="mt-2 text-gray-600">
        Bienvenue dans votre espace client AVR. Voici un aperçu de votre activité.
      </p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="Favoris" value={counts.favoris} href="/compte/favoris" loading={loading} />
        <Stat label="Estimations" value={counts.estimations} href="/compte/estimations" loading={loading} />
        <Stat label="Réservations" value={counts.reservations} href="/compte/reservations" loading={loading} />
        <Stat label="Rendez-vous" value={counts.rdv} href="/compte/rdv" loading={loading} />
        <Stat label="Documents" value={counts.documents} href="/compte/documents" loading={loading} />
      </div>

      {!loading && counts.favoris === 0 && counts.estimations === 0 && (
        <div className="mt-12 bg-white border border-gray-100 p-6">
          <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Pour commencer</div>
          <h2 className="mt-2 font-serif text-xl text-brand">Votre espace est prêt</h2>
          <p className="mt-2 text-sm text-gray-600">
            Parcourez le parc, ajoutez vos coups de cœur en favoris, ou demandez une estimation
            pour votre véhicule actuel.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/vehicules"
              className="inline-flex items-center justify-center h-10 px-5 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition"
            >
              Voir le parc →
            </Link>
            <Link
              href="/vendre-reprendre"
              className="inline-flex items-center justify-center h-10 px-5 border border-brand text-brand text-xs tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition"
            >
              Estimer mon véhicule
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  loading
}: {
  label: string;
  value: number;
  href: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="block bg-white border border-gray-100 p-4 hover:border-brand-accent transition-colors"
    >
      <div className="text-[10px] tracking-[0.3em] uppercase text-gray-500">{label}</div>
      <div className="mt-1 text-3xl font-serif text-brand tabular-nums">
        {loading ? "—" : value}
      </div>
    </Link>
  );
}
