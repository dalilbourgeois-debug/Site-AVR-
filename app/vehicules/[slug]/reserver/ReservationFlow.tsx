"use client";

import { useState } from "react";
import { formatEur } from "@/lib/format";

type Step = 1 | 2 | 3;

export default function ReservationFlow({
  slug,
  prix,
  acompte,
  titre,
  photo
}: {
  slug: string;
  prix: number;
  acompte: number;
  titre: string;
  photo: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function paiement() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug, ...form })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      if (data.url) window.location.href = data.url;
      else throw new Error("URL de paiement manquante");
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <Steps step={step} />

      {step === 1 && (
        <div className="card p-6 mt-6">
          <div className="flex gap-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" className="w-32 h-24 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold text-brand">{titre}</div>
              <div className="text-sm text-gray-600">Prix TTC : {formatEur(prix)}</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Montant de l'acompte (5%)</span>
              <span className="text-xl font-bold text-brand">{formatEur(acompte)}</span>
            </div>
          </div>
          <button className="btn-primary mt-6 w-full" onClick={() => setStep(2)}>
            Continuer
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card p-6 mt-6 space-y-4">
          <h2 className="font-semibold text-brand">Vos coordonnées</h2>
          <Field label="Nom complet" value={form.nom} onChange={(v) => setForm({ ...form, nom: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Téléphone" type="tel" value={form.telephone} onChange={(v) => setForm({ ...form, telephone: v })} />
          <Field label="Adresse" value={form.adresse} onChange={(v) => setForm({ ...form, adresse: v })} />
          <div className="flex gap-2 pt-2">
            <button className="btn-outline" onClick={() => setStep(1)}>Retour</button>
            <button
              className="btn-primary flex-1"
              disabled={!form.nom || !form.email || !form.telephone}
              onClick={() => setStep(3)}
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card p-6 mt-6">
          <h2 className="font-semibold text-brand">Paiement de l'acompte</h2>
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <div><strong>Véhicule :</strong> {titre}</div>
            <div><strong>Acompte :</strong> {formatEur(acompte)}</div>
            <div><strong>Client :</strong> {form.nom} — {form.email}</div>
          </div>
          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
          <button className="btn-primary mt-6 w-full" onClick={paiement} disabled={loading}>
            {loading ? "Redirection..." : "Payer via Stripe"}
          </button>
          <button className="text-sm text-gray-500 mt-3 w-full text-center hover:underline" onClick={() => setStep(2)}>
            Modifier mes coordonnées
          </button>
        </div>
      )}
    </div>
  );
}

function Steps({ step }: { step: Step }) {
  const labels = ["Véhicule", "Coordonnées", "Paiement"];
  return (
    <ol className="flex items-center gap-2 text-sm">
      {labels.map((l, i) => {
        const n = (i + 1) as Step;
        const active = step === n;
        const done = step > n;
        return (
          <li key={l} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                done ? "bg-brand text-white" : active ? "bg-brand-accent text-brand" : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : n}
            </div>
            <span className={active ? "font-semibold text-brand" : "text-gray-500"}>{l}</span>
            {i < labels.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
