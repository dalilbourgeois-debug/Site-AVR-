"use client";

import { useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/toast";

export default function ShareButton({
  title,
  text,
  url,
  variant = "primary"
}: {
  title: string;
  text?: string;
  /** URL absolue ; si omise, on prend window.location.href */
  url?: string;
  /** "primary" = bouton plein rouge · "ghost" = icône seule (pour les cards) */
  variant?: "primary" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [useNative, setUseNative] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // On utilise le partage natif UNIQUEMENT sur les appareils tactiles (mobile / tablette).
  // Sur ordinateur, on force le popover maison : c'est plus fiable
  // (le menu de partage Windows est aléatoire selon les versions/réglages).
  useEffect(() => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return;
    const hasShare = !!navigator.share;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setUseNative(hasShare && isTouch);
  }, []);

  // Ferme le popover si on clique en dehors
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  function getUrl() {
    return url ?? (typeof window !== "undefined" ? window.location.href : "");
  }

  async function handleClick() {
    const shareUrl = getUrl();
    if (useNative) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (e) {
        // L'utilisateur a annulé → on ne fait rien
        if ((e as Error).name === "AbortError") return;
        // Autre erreur (perm refusée, OS qui n'a pas géré) → on bascule sur le popover
      }
    }
    setOpen((v) => !v);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      showToast("Lien copié dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* navigateur ancien : ignore */
    }
  }

  // URLs des canaux de partage (fallback desktop)
  const u = encodeURIComponent(getUrl());
  const t = encodeURIComponent(`${title}${text ? " — " + text : ""}`);
  const channels = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, icon: "💬" },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${t}%0A%0A${u}`, icon: "✉️" },
    { label: "SMS", href: `sms:?body=${t}%20${u}`, icon: "📱" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: "📘" }
  ];

  // Bouton "ghost" = icône seule (pour les cards)
  if (variant === "ghost") {
    return (
      <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label="Partager"
          onClick={handleClick}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-brand-accent hover:text-white transition-colors backdrop-blur"
          title="Partager"
        >
          <ShareIcon />
        </button>
        {open && <SharePopover channels={channels} onCopy={copy} copied={copied} />}
      </div>
    );
  }

  // Bouton "primary" = bouton plein avec libellé
  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-brand text-brand text-xs tracking-[0.2em] uppercase hover:bg-brand hover:text-white transition"
      >
        <ShareIcon />
        Partager
      </button>
      {open && <SharePopover channels={channels} onCopy={copy} copied={copied} />}
    </div>
  );
}

function SharePopover({
  channels,
  onCopy,
  copied
}: {
  channels: { label: string; href: string; icon: string }[];
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="absolute z-30 top-full mt-2 right-0 w-64 bg-white border border-gray-100 shadow-xl">
      <div className="px-4 py-3 border-b border-gray-100 text-[10px] tracking-[0.3em] uppercase text-gray-400">
        Partager
      </div>
      <ul>
        {channels.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              target={c.label === "SMS" || c.label === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-brand-accent transition-colors"
            >
              <span className="text-lg">{c.icon}</span>
              <span>{c.label}</span>
            </a>
          </li>
        ))}
        <li className="border-t border-gray-100">
          <button
            type="button"
            onClick={onCopy}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 hover:text-brand-accent transition-colors"
          >
            <span className="text-lg">🔗</span>
            <span>{copied ? "Lien copié !" : "Copier le lien"}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
