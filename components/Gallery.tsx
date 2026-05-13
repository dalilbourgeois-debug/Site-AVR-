"use client";

import { useState } from "react";

export default function Gallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  return (
    <div>
      <div
        className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
        onClick={() => setLightbox(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[active]} alt={alt} className="w-full h-full object-cover" />
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square overflow-hidden rounded border-2 ${
              i === active ? "border-brand-accent" : "border-transparent"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[active]} alt={alt} className="max-h-full max-w-full" />
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            aria-label="Fermer"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
