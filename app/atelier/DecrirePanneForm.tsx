"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DecrirePanneForm() {
  const router = useRouter();
  const [desc, setDesc] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      service: "autre",
      desc: desc.trim()
    });
    router.push(`/atelier/mecanique/rdv?${params.toString()}`);
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <textarea
        className="input min-h-[110px]"
        placeholder="Ex : depuis 2 jours, un bruit de cliquetis au démarrage côté avant droit, surtout à froid…"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <div className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <button
          type="submit"
          disabled={!desc.trim()}
          className="inline-flex items-center justify-center h-11 px-6 bg-brand text-white text-xs tracking-[0.2em] uppercase hover:bg-brand-light transition disabled:opacity-40"
        >
          Demander un diagnostic →
        </button>
        <span className="text-xs text-gray-500">
          On lit votre description, on vous propose un créneau adapté.
        </span>
      </div>
    </form>
  );
}
