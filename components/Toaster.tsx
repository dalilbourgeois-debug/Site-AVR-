"use client";

import { useEffect, useState } from "react";
import { subscribeToasts, type Toast } from "@/lib/toast";

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => subscribeToasts(setToasts), []);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`toast-item flex items-center gap-3 px-5 py-3 shadow-2xl text-sm font-medium text-white ${
            t.kind === "success"
              ? "bg-brand"
              : t.kind === "error"
              ? "bg-red-700"
              : "bg-gray-900"
          }`}
        >
          <span aria-hidden="true" className="text-brand-accent">
            {t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "ℹ"}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
