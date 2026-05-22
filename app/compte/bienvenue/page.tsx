"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

/**
 * Page d'onboarding affichée après la 1ʳᵉ connexion Google
 * (ou tant que le profil n'est pas complet).
 */
export default function BienvenuePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading, isLoggedIn, refreshProfile } = useAuth();

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    adresse: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quand on récupère le profil (avec ce que Google a pu pré-remplir), on remplit le form
  useEffect(() => {
    if (profile) {
      setForm({
        prenom: profile.prenom ?? "",
        nom: profile.nom ?? "",
        telephone: profile.telephone ?? "",
        adresse: profile.adresse ?? ""
      });
    }
  }, [profile]);

  // Si pas connecté, rediriger vers la home (la modal d'auth s'affichera côté nav si besoin)
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/");
    }
  }, [loading, isLoggedIn, router]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Validation côté client
    if (!form.prenom.trim() || !form.nom.trim() || !form.telephone.trim() || !form.adresse.trim()) {
      setError("Tous les champs sont obligatoires.");
      return;
    }
    if (form.telephone.replace(/\D/g, "").length < 9) {
      setError("Le numéro de téléphone semble incomplet.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .update({
          prenom: form.prenom.trim(),
          nom: form.nom.trim(),
          telephone: form.telephone.trim(),
          adresse: form.adresse.trim()
        })
        .eq("id", user.id);
      if (err) throw err;

      // CRITIQUE : recharger le profil en mémoire AVANT de naviguer.
      // Sinon le layout voit encore l'ancien profil (incomplet) et redirige
      // de nouveau vers /compte/bienvenue → boucle infinie.
      await refreshProfile();

      showToast("Bienvenue chez AVR !");
      const next = searchParams.get("next") ?? "/compte";
      router.push(next);
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  if (loading || !isLoggedIn) {
    return (
      <div className="container-x py-16 text-sm text-gray-500 text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="container-x py-12 max-w-2xl">
      <div className="text-center mb-8">
        <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Bienvenue chez AVR</div>
        <h1 className="mt-3 text-3xl md:text-4xl font-serif text-brand">
          Quelques infos pour finir l'inscription
        </h1>
        <p className="mt-4 text-gray-600 max-w-lg mx-auto">
          Ces informations nous permettent de vous accompagner pour vos rendez-vous,
          vos estimations et vos réservations. Vous pourrez les modifier à tout moment
          depuis votre espace.
        </p>
      </div>

      <form onSubmit={save} className="bg-white border border-gray-100 p-6 md:p-8 space-y-5">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input bg-gray-50"
            value={user?.email ?? ""}
            disabled
            readOnly
          />
          <div className="text-xs text-gray-500 mt-1">
            Issu de votre compte Google, ne peut pas être modifié.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              Prénom <span className="text-brand-accent">*</span>
            </label>
            <input
              type="text"
              className="input"
              required
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>
          <div>
            <label className="label">
              Nom <span className="text-brand-accent">*</span>
            </label>
            <input
              type="text"
              className="input"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">
            Téléphone <span className="text-brand-accent">*</span>
          </label>
          <input
            type="tel"
            className="input"
            required
            placeholder="06 12 34 56 78"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
          />
          <div className="text-xs text-gray-500 mt-1">
            Pour vous joindre rapidement pour vos rendez-vous, estimations et confirmations.
          </div>
        </div>

        <div>
          <label className="label">
            Adresse <span className="text-brand-accent">*</span>
          </label>
          <textarea
            className="input min-h-[80px]"
            required
            placeholder="N° et rue, code postal, ville"
            value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center h-12 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Confirmer et accéder à mon espace →"}
        </button>

        <p className="text-[11px] text-gray-500 text-center leading-relaxed">
          Vos informations sont stockées de façon sécurisée et utilisées uniquement par AVR.
          Voir notre{" "}
          <a href="/politique-confidentialite-rgpd" className="underline hover:text-brand-accent">
            politique de confidentialité
          </a>.
        </p>
      </form>
    </div>
  );
}
