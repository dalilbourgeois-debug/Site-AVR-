"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { showToast } from "@/lib/toast";

export default function ParametresPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    adresse: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quand le profil est chargé, on pré-remplit
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

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from("profiles")
        .update({
          prenom: form.prenom || null,
          nom: form.nom || null,
          telephone: form.telephone || null,
          adresse: form.adresse || null
        })
        .eq("id", user.id);
      if (err) throw err;
      await refreshProfile();
      showToast("Vos informations ont été enregistrées");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="text-xs tracking-[0.4em] text-brand-accent uppercase">Mon espace</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-serif text-brand">Mes informations</h1>
      <p className="mt-2 text-gray-600">
        Modifiez vos coordonnées personnelles. Elles ne seront visibles que par AVR.
      </p>

      <form onSubmit={save} className="mt-8 bg-white border border-gray-100 p-6 space-y-4">
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
            L'email est défini par votre compte Google, il ne peut pas être modifié ici.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Prénom</label>
            <input
              type="text"
              className="input"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Nom</label>
            <input
              type="text"
              className="input"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label">Téléphone</label>
          <input
            type="tel"
            className="input"
            value={form.telephone}
            onChange={(e) => setForm({ ...form, telephone: e.target.value })}
            placeholder="06 12 34 56 78"
          />
        </div>

        <div>
          <label className="label">Adresse</label>
          <textarea
            className="input min-h-[80px]"
            value={form.adresse}
            onChange={(e) => setForm({ ...form, adresse: e.target.value })}
            placeholder="N° rue, code postal, ville"
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
          className="inline-flex items-center justify-center h-12 px-8 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
