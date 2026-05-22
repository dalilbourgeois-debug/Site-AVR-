"use client";

import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import { useAuth } from "@/hooks/useAuth";
import { openAuthModal } from "@/lib/auth-modal";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select" | "files";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  /** Aide affichée sous le label (uniquement pour 'files' actuellement) */
  hint?: string;
  /** Pour 'files' : limite de fichiers / taille / types acceptés */
  maxFiles?: number;
  maxSizeMb?: number;
  accept?: string;
};

export default function SimpleForm({
  fields,
  endpoint,
  hidden = {},
  buttonLabel = "Envoyer",
  successMessage = "Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement.",
  gateOnSubmit = false,
  gateTitle = "Pour finaliser votre demande",
  gateReason = "Créez un compte pour suivre votre demande et retrouver la réponse du garage dans votre espace."
}: {
  fields: FieldDef[];
  endpoint: string;
  hidden?: Record<string, string>;
  buttonLabel?: string;
  successMessage?: string;
  /**
   * Si true, et si l'utilisateur n'est pas connecté au moment du submit :
   *  - on sauvegarde les valeurs en localStorage (≠ fichiers)
   *  - on ouvre le modal d'auth Google
   *  - après login, l'utilisateur revient sur la même page,
   *    le form se pré-remplit automatiquement avec ses valeurs
   */
  gateOnSubmit?: boolean;
  gateTitle?: string;
  gateReason?: string;
}) {
  const { isLoggedIn, loading: authLoading } = useAuth();

  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);

  const hasFiles = Object.values(files).some((arr) => arr.length > 0);
  const storageKey = `avr-form-restore:${endpoint}`;

  // Restauration des valeurs après retour de l'OAuth
  useEffect(() => {
    if (!gateOnSubmit) return;
    if (authLoading) return;
    if (!isLoggedIn) return;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { values: Record<string, string>; ts: number };
      // Validité : 30 minutes max
      if (Date.now() - parsed.ts > 30 * 60 * 1000) {
        window.localStorage.removeItem(storageKey);
        return;
      }
      setValues(parsed.values);
      setRestored(true);
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  }, [authLoading, isLoggedIn, gateOnSubmit, storageKey]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Gate au submit : si l'utilisateur n'est pas connecté, on sauve et on ouvre le modal
    if (gateOnSubmit && !isLoggedIn) {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ values, ts: Date.now() })
        );
      } catch {
        /* quota dépassé : ignore, on perdra juste les valeurs */
      }
      openAuthModal({
        reason: gateReason,
        redirectTo: window.location.pathname + window.location.search
      });
      return;
    }

    setStatus("loading");
    setError(null);
    try {
      let res: Response;
      if (hasFiles) {
        const fd = new FormData();
        for (const [k, v] of Object.entries(hidden)) fd.append(k, v);
        for (const [k, v] of Object.entries(values)) fd.append(k, v);
        for (const [k, arr] of Object.entries(files)) {
          arr.forEach((f) => fd.append(k, f, f.name));
        }
        res = await fetch(endpoint, { method: "POST", body: fd });
      } else {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...hidden, ...values })
        });
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur");
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setError((e as Error).message);
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-accent text-white flex items-center justify-center text-2xl">
          ✓
        </div>
        <p className="mt-4 text-gray-700">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-100 p-6 space-y-4">
      {restored && (
        <div className="bg-brand-accent/5 border-l-2 border-brand-accent p-3 text-sm text-gray-700">
          <strong>Bienvenue !</strong> Vos infos ont été conservées
          {fields.some((f) => f.type === "files") && (
            <> — réattachez vos fichiers ci-dessous si vous en aviez</>
          )}
          . Cliquez sur <strong>{buttonLabel}</strong> pour finaliser.
        </div>
      )}

      {fields.map((f) => {
        if (f.type === "files") {
          return (
            <FileUpload
              key={f.name}
              label={f.label}
              hint={f.hint}
              maxFiles={f.maxFiles ?? 6}
              maxSizeMb={f.maxSizeMb ?? 5}
              accept={f.accept ?? "image/*,application/pdf"}
              value={files[f.name] ?? []}
              onChange={(arr) => setFiles({ ...files, [f.name]: arr })}
            />
          );
        }
        return (
          <div key={f.name}>
            <label className="label">
              {f.label}
              {f.required && <span className="text-brand-accent"> *</span>}
            </label>
            {f.type === "textarea" ? (
              <textarea
                className="input min-h-[100px]"
                required={f.required}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              />
            ) : f.type === "select" ? (
              <select
                className="input"
                required={f.required}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              >
                <option value="">— Choisir —</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={f.type ?? "text"}
                className="input"
                required={f.required}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
              />
            )}
          </div>
        );
      })}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {gateOnSubmit && !isLoggedIn && (
        <div className="text-xs text-gray-500">
          {gateTitle} : un compte sera créé en 5 secondes avec Google au moment de l'envoi.
          Vos infos sont conservées.
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full inline-flex items-center justify-center px-8 py-3.5 bg-brand-accent text-white text-sm tracking-[0.2em] uppercase hover:brightness-110 transition disabled:opacity-50"
      >
        {status === "loading" ? "Envoi..." : buttonLabel}
      </button>
    </form>
  );
}
