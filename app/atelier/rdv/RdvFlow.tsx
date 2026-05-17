"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Step = 1 | 2 | 3;
export type SectionId = "mecanique" | "carrosserie" | "controle-technique";

type Service = { id: string; label: string; icon: string; desc: string };

type SectionConfig = {
  id: SectionId;
  label: string;
  shortLabel: string;
  icon: string;
  services: Service[];
};

const CONFIG: Record<SectionId, SectionConfig> = {
  mecanique: {
    id: "mecanique",
    label: "Atelier mécanique",
    shortLabel: "Mécanique",
    icon: "🔧",
    services: [
      { id: "revision", label: "Révision / Vidange", icon: "🛢️", desc: "Vidange + filtres" },
      { id: "freins", label: "Freins", icon: "🛞", desc: "Plaquettes, disques" },
      { id: "distribution", label: "Distribution", icon: "⚙️", desc: "Kit de distribution" },
      { id: "echappement", label: "Échappement", icon: "💨", desc: "Silencieux, FAP, AdBlue" },
      { id: "suspension", label: "Suspension", icon: "🛠️", desc: "Amortisseurs, géométrie" },
      { id: "climatisation", label: "Climatisation", icon: "❄️", desc: "Recharge, désinfection" },
      { id: "batterie", label: "Batterie", icon: "🔋", desc: "Test, remplacement" },
      { id: "pneus", label: "Pneus", icon: "🚗", desc: "Montage, équilibrage" },
      { id: "vitrage", label: "Pare-brise / Vitrage", icon: "🪟", desc: "Remplacement, impact" },
      { id: "diagnostic", label: "Diagnostic", icon: "📊", desc: "Électronique, pannes" },
      { id: "autre", label: "Autre", icon: "💬", desc: "Je décris mon besoin" }
    ]
  },
  carrosserie: {
    id: "carrosserie",
    label: "Atelier carrosserie",
    shortLabel: "Carrosserie",
    icon: "🎨",
    services: [
      { id: "sinistre", label: "Sinistre", icon: "🚨", desc: "Agréé AXA · Direct Assurance" },
      { id: "peinture", label: "Peinture", icon: "🖌️", desc: "Totale ou partielle" },
      { id: "redressage", label: "Redressage / Tôlerie", icon: "🔨", desc: "Banc châssis" },
      { id: "smart-repair", label: "Smart Repair", icon: "✨", desc: "Petites rayures, impacts" },
      { id: "plastique", label: "Pare-chocs / Plastique", icon: "🚙", desc: "Remplacement, peinture" },
      { id: "polish", label: "Polish", icon: "💎", desc: "Rénovation peinture" },
      { id: "autre", label: "Autre", icon: "💬", desc: "Je décris mon besoin" }
    ]
  },
  "controle-technique": {
    id: "controle-technique",
    label: "Contrôle technique",
    shortLabel: "CT",
    icon: "📋",
    services: [
      { id: "ct-periodique", label: "Contrôle périodique", icon: "📋", desc: "Tous les 2 ans" },
      { id: "contre-visite", label: "Contre-visite", icon: "🔄", desc: "Après réparation" },
      { id: "autre", label: "Autre", icon: "💬", desc: "Je décris mon besoin" }
    ]
  }
};

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const JOURS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven"];

type DaySlot = {
  date: Date;
  iso: string;
  label: string;
  dayShort: string;
  dayNum: number;
  monthShort: string;
  times: string[];
  isToday: boolean;
};

export default function RdvFlow({
  section,
  servicePreset
}: {
  section: SectionId;
  servicePreset?: string;
}) {
  const cfg = CONFIG[section];
  const searchParams = useSearchParams();

  // Pré-remplissage via URL (ex : depuis la page atelier "Décrivez votre panne")
  const initService = servicePreset ?? searchParams.get("service") ?? "";
  const initDesc = searchParams.get("desc") ?? "";

  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState<string>(initService);
  const [autreTexte, setAutreTexte] = useState(initDesc);
  const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [contact, setContact] = useState({ nom: "", email: "", telephone: "", immat: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Chaque section a SON propre planning (ici on simule différentes indispos pour rendre visible le côté indépendant)
  const days = useMemo(() => generateDays(14, section), [section]);
  const selectedDay = days.find((d) => d.iso === selectedDayIso) ?? null;

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDayIso]);

  const selectedService = cfg.services.find((s) => s.id === service);

  async function submit() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/atelier/rdv", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          section: cfg.id,
          service,
          autreTexte: service === "autre" ? autreTexte : "",
          slot: selectedDay && selectedTime ? { day: selectedDay.label, time: selectedTime } : null,
          contact
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setError((e as Error).message);
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border border-gray-100 p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-accent text-white flex items-center justify-center text-3xl">
          ✓
        </div>
        <h2 className="mt-4 text-2xl font-serif text-brand">Rendez-vous demandé</h2>
        <p className="mt-2 text-gray-700">
          <strong>{cfg.label}</strong> · {selectedService?.label}
        </p>
        <p className="mt-1 text-gray-700">
          Pour le <strong>{selectedDay?.label}</strong> à <strong>{selectedTime}</strong>.
        </p>
        <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
          Vous allez recevoir un email et un SMS de confirmation, puis un rappel la veille.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Steps step={step} />

      {/* ÉTAPE 1 — Prestation */}
      {step === 1 && (
        <div className="bg-white border border-gray-100 p-6 md:p-8 mt-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" aria-hidden="true">{cfg.icon}</span>
            <h2 className="font-serif text-xl text-brand">Quelle prestation ?</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">Calendrier dédié à l'atelier <strong>{cfg.shortLabel.toLowerCase()}</strong>.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cfg.services.map((s) => {
              const isSelected = service === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s.id)}
                  className={`p-4 text-left transition-all border-2 ${
                    isSelected
                      ? "border-brand-accent bg-brand-accent/5"
                      : "border-gray-200 hover:border-brand"
                  }`}
                >
                  <div className="text-2xl">{s.icon}</div>
                  <div className="mt-2 font-serif text-base text-brand">{s.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.desc}</div>
                </button>
              );
            })}
          </div>
          {service === "autre" && (
            <div className="mt-6">
              <label className="label">Décrivez votre besoin</label>
              <textarea
                className="input min-h-[100px]"
                value={autreTexte}
                onChange={(e) => setAutreTexte(e.target.value)}
                placeholder="Ex : bruit suspect côté roue avant droite, à diagnostiquer."
              />
            </div>
          )}

          {section === "carrosserie" && service === "sinistre" && (
            <div className="mt-6 bg-brand-accent/5 border-l-2 border-brand-accent p-4 text-sm text-gray-700">
              <strong>Vous êtes assuré AXA ou Direct Assurance ?</strong> Nous sommes agréés —
              nous gérons l'expertise, la déclaration et les réparations de A à Z.
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition disabled:opacity-40"
              disabled={!service || (service === "autre" && !autreTexte.trim())}
              onClick={() => setStep(2)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 — Calendrier */}
      {step === 2 && (
        <div className="bg-white border border-gray-100 p-6 md:p-8 mt-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl" aria-hidden="true">{cfg.icon}</span>
            <h2 className="font-serif text-xl text-brand">Choisissez votre créneau</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Créneaux du planning <strong>{cfg.shortLabel.toLowerCase()}</strong>, lundi → vendredi, 9h–12h / 14h–18h.
          </p>

          <div className="text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
            {humanRangeLabel(days)}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2">
            {days.map((d) => {
              const isSelected = d.iso === selectedDayIso;
              const isClosed = d.times.length === 0;
              return (
                <button
                  key={d.iso}
                  type="button"
                  disabled={isClosed}
                  onClick={() => setSelectedDayIso(d.iso)}
                  className={`p-3 text-center border-2 transition-all ${
                    isSelected
                      ? "border-brand-accent bg-brand-accent text-white"
                      : isClosed
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 hover:border-brand"
                  }`}
                >
                  <div className={`text-[10px] tracking-widest uppercase ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                    {d.dayShort}
                  </div>
                  <div className={`text-2xl font-serif mt-1 ${isSelected ? "text-white" : "text-brand"}`}>
                    {d.dayNum}
                  </div>
                  <div className={`text-[10px] tracking-widest uppercase ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                    {d.monthShort}
                  </div>
                  {!isClosed && (
                    <div className={`text-[9px] tracking-wider mt-1 ${isSelected ? "text-white/90" : "text-brand-accent"}`}>
                      {d.times.length} dispo
                    </div>
                  )}
                  {isClosed && (
                    <div className="text-[9px] tracking-wider mt-1 text-gray-300">complet</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {!selectedDay && (
              <div className="text-center text-sm text-gray-500 py-8 border-2 border-dashed border-gray-200">
                Sélectionnez un jour pour voir les créneaux disponibles.
              </div>
            )}
            {selectedDay && (
              <>
                <div className="text-xs tracking-[0.3em] uppercase text-brand-accent mb-3">
                  Créneaux du {selectedDay.label}
                </div>
                {selectedDay.times.length === 0 ? (
                  <div className="text-sm text-gray-500">Complet ce jour.</div>
                ) : (
                  <div className="space-y-4">
                    <SlotGroup
                      title="Matin"
                      times={selectedDay.times.filter((t) => t < "12:00")}
                      selected={selectedTime}
                      onSelect={setSelectedTime}
                    />
                    <SlotGroup
                      title="Après-midi"
                      times={selectedDay.times.filter((t) => t >= "12:00")}
                      selected={selectedTime}
                      onSelect={setSelectedTime}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-between">
            <button
              className="inline-flex items-center justify-center px-6 py-3 border border-brand text-brand text-sm tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition"
              onClick={() => setStep(1)}
            >
              ← Retour
            </button>
            <button
              className="inline-flex items-center justify-center px-8 py-3 bg-brand text-white text-sm tracking-[0.2em] uppercase hover:bg-brand-light transition disabled:opacity-40"
              disabled={!selectedTime}
              onClick={() => setStep(3)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — Coordonnées */}
      {step === 3 && (
        <div className="bg-white border border-gray-100 p-6 md:p-8 mt-8">
          <h2 className="font-serif text-xl text-brand mb-1">Vos coordonnées</h2>
          <p className="text-sm text-gray-500 mb-6">
            Vous allez recevoir une confirmation par email et SMS, puis un rappel la veille.
          </p>

          <div className="bg-gray-50 border-l-2 border-brand-accent p-4 mb-6 text-sm">
            <div className="text-[10px] tracking-[0.3em] uppercase text-brand-accent mb-1">
              {cfg.label}
            </div>
            <div className="font-medium text-brand">{selectedService?.label}</div>
            <div className="text-gray-600 mt-1">
              {selectedDay?.label} · {selectedTime}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom complet" value={contact.nom} onChange={(v) => setContact({ ...contact, nom: v })} required />
            <Field label="Téléphone" type="tel" value={contact.telephone} onChange={(v) => setContact({ ...contact, telephone: v })} required />
            <Field label="Email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
            <Field label="Immatriculation" value={contact.immat} onChange={(v) => setContact({ ...contact, immat: v })} placeholder="AB-123-CD" />
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

          <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-between">
            <button
              className="inline-flex items-center justify-center px-6 py-3 border border-brand text-brand text-sm tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition"
              onClick={() => setStep(2)}
            >
              ← Retour
            </button>
            <button
              className="inline-flex items-center justify-center px-8 py-3 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition disabled:opacity-40"
              disabled={!contact.nom || !contact.email || !contact.telephone || status === "loading"}
              onClick={submit}
            >
              {status === "loading" ? "Envoi..." : "Confirmer →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SlotGroup({
  title, times, selected, onSelect
}: {
  title: string; times: string[]; selected: string | null; onSelect: (t: string) => void;
}) {
  if (times.length === 0) return null;
  return (
    <div>
      <div className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">{title}</div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {times.map((t) => {
          const isSel = selected === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onSelect(t)}
              className={`py-2.5 text-sm font-medium border transition ${
                isSel
                  ? "bg-brand text-white border-brand"
                  : "border-gray-200 hover:border-brand-accent hover:text-brand-accent"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Steps({ step }: { step: Step }) {
  const labels = ["Prestation", "Créneau", "Coordonnées"];
  return (
    <ol className="flex items-center gap-3 text-sm">
      {labels.map((l, i) => {
        const n = (i + 1) as Step;
        const active = step === n;
        const done = step > n;
        return (
          <li key={l} className="flex items-center gap-3 flex-1">
            <div
              className={`w-9 h-9 flex items-center justify-center text-sm font-bold transition-colors ${
                done ? "bg-brand text-white" : active ? "bg-brand-accent text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {done ? "✓" : n}
            </div>
            <span className={`hidden sm:inline tracking-[0.2em] uppercase text-xs ${active ? "font-semibold text-brand" : "text-gray-400"}`}>
              {l}
            </span>
            {i < labels.length - 1 && <div className={`flex-1 h-px ${done ? "bg-brand" : "bg-gray-200"}`} />}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-brand-accent"> *</span>}</label>
      <input className="input" value={value} type={type} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

/**
 * Génère N jours à venir (lundi → vendredi, sans samedi/dimanche).
 * Pour rendre les calendriers visuellement DIFFÉRENTS entre les ateliers,
 * on enlève quelques créneaux de manière déterministe selon la section.
 */
function generateDays(nb: number, section: SectionId): DaySlot[] {
  const out: DaySlot[] = [];
  const todayMs = new Date();
  todayMs.setHours(0, 0, 0, 0);
  let i = 1;
  while (out.length < nb && i < 30) {
    const d = new Date(todayMs.getTime() + i * 86400000);
    const dayIdx = d.getDay();
    if (dayIdx === 0 || dayIdx === 6) { i++; continue; } // week-end fermé

    // Plage 9h-12h / 14h-18h, créneaux d'une heure
    let times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

    // Indispos simulées par section pour montrer que les calendriers sont distincts
    const seed = sectionSeed(section) + i;
    times = times.filter((_, idx) => (seed * (idx + 1)) % 7 !== 0);

    out.push({
      date: d,
      iso: d.toISOString().slice(0, 10),
      label: new Intl.DateTimeFormat("fr-FR", {
        weekday: "long", day: "numeric", month: "long"
      }).format(d),
      dayShort: JOURS_SHORT[(dayIdx + 6) % 7] ?? "",
      dayNum: d.getDate(),
      monthShort: MOIS[d.getMonth()].slice(0, 4),
      times,
      isToday: false
    });
    i++;
  }
  return out;
}

function sectionSeed(s: SectionId): number {
  if (s === "mecanique") return 3;
  if (s === "carrosserie") return 5;
  return 7;
}

function humanRangeLabel(days: DaySlot[]): string {
  if (days.length === 0) return "";
  const first = days[0].date;
  const last = days[days.length - 1].date;
  return first.getMonth() === last.getMonth()
    ? `${MOIS[first.getMonth()]} ${first.getFullYear()}`
    : `${MOIS[first.getMonth()]} – ${MOIS[last.getMonth()]} ${last.getFullYear()}`;
}
