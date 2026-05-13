"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type FileUploadProps = {
  /** Liste actuelle des fichiers (contrôlée par le parent) */
  value: File[];
  onChange: (files: File[]) => void;

  /** Nombre maximum de fichiers (défaut 6) */
  maxFiles?: number;
  /** Taille max d'UN fichier en Mo (défaut 5) */
  maxSizeMb?: number;
  /** Types MIME acceptés (défaut : images + PDF) */
  accept?: string;
  label?: string;
  hint?: string;
};

export default function FileUpload({
  value,
  onChange,
  maxFiles = 6,
  maxSizeMb = 5,
  accept = "image/*,application/pdf",
  label = "Pièces jointes",
  hint = "Photos du véhicule, carte grise, factures d'entretien…"
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  // Génère les URLs d'aperçu pour les images
  useEffect(() => {
    const map: Record<string, string> = {};
    value.forEach((f) => {
      if (f.type.startsWith("image/")) {
        map[fileKey(f)] = URL.createObjectURL(f);
      }
    });
    setPreviews(map);
    return () => Object.values(map).forEach(URL.revokeObjectURL);
  }, [value]);

  function fileKey(f: File) {
    return `${f.name}-${f.size}-${f.lastModified}`;
  }

  function addFiles(list: FileList | File[] | null) {
    if (!list) return;
    const incoming = Array.from(list);
    let next = [...value];
    const errors: string[] = [];

    for (const f of incoming) {
      if (next.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} fichiers.`);
        break;
      }
      if (f.size > maxSizeMb * 1024 * 1024) {
        errors.push(`${f.name} dépasse ${maxSizeMb} Mo et n'a pas été ajouté.`);
        continue;
      }
      // pas de doublon
      if (next.some((g) => fileKey(g) === fileKey(f))) continue;
      next.push(f);
    }

    onChange(next);
    setError(errors.length ? errors.join(" ") : null);
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
    setError(null);
  }

  const total = useMemo(
    () => value.reduce((acc, f) => acc + f.size, 0),
    [value]
  );
  const totalMb = (total / 1024 / 1024).toFixed(1);

  return (
    <div>
      <label className="label">{label}</label>
      {hint && <div className="text-xs text-gray-500 mb-2">{hint}</div>}

      {/* Zone de drag & drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? "border-brand-accent bg-brand-accent/5"
            : "border-gray-300 hover:border-brand-accent"
        }`}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500">
          <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
          <path d="M4 20h16" />
        </svg>
        <div className="text-sm text-center">
          <strong className="text-brand">Cliquez pour ajouter</strong> ou glissez-déposez vos fichiers ici
        </div>
        <div className="text-xs text-gray-500">
          {accept.includes("image") && "Images"}{accept.includes("pdf") && " · PDF"} —
          max {maxFiles} fichiers · {maxSizeMb} Mo / fichier
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            // reset pour pouvoir re-sélectionner le même fichier après suppression
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </div>

      {/* Aperçus */}
      {value.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
            <span>{value.length} / {maxFiles} fichier{value.length > 1 ? "s" : ""} · {totalMb} Mo</span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="tracking-widest uppercase text-gray-500 hover:text-brand-accent"
            >
              Tout retirer
            </button>
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {value.map((f, i) => {
              const isImg = f.type.startsWith("image/");
              return (
                <li key={fileKey(f)} className="relative border border-gray-200 bg-white overflow-hidden group">
                  {isImg ? (
                    <div className="aspect-square bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previews[fileKey(f)]} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                      <div className="text-3xl">📄</div>
                      <div className="text-[10px] tracking-widest uppercase mt-2">PDF</div>
                    </div>
                  )}
                  <div className="p-2 text-xs">
                    <div className="truncate text-gray-700" title={f.name}>{f.name}</div>
                    <div className="text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} Mo</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Retirer"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-brand-accent transition"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
