"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";

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
  successMessage = "Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement."
}: {
  fields: FieldDef[];
  endpoint: string;
  hidden?: Record<string, string>;
  buttonLabel?: string;
  successMessage?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const hasFiles = Object.values(files).some((arr) => arr.length > 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      let res: Response;
      if (hasFiles) {
        // multipart/form-data : on envoie aussi les fichiers
        const fd = new FormData();
        for (const [k, v] of Object.entries(hidden)) fd.append(k, v);
        for (const [k, v] of Object.entries(values)) fd.append(k, v);
        for (const [k, arr] of Object.entries(files)) {
          arr.forEach((f) => fd.append(k, f, f.name));
        }
        res = await fetch(endpoint, { method: "POST", body: fd });
      } else {
        // JSON classique
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
