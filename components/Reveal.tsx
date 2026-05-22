"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "left" | "right" | "fade" | "zoom";

export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  as: Tag = "div",
  className = ""
}: {
  children: React.ReactNode;
  variant?: Variant;
  /** Délai en ms avant l'animation (utile pour des cascades) */
  delay?: number;
  /** Balise HTML utilisée (div par défaut) */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Si déjà visible au chargement (au-dessus du fold), on déclenche tout de suite
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect(); // animation jouée une seule fois
            break;
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref as React.RefObject<HTMLElement>}
      data-variant={variant === "up" ? undefined : variant}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
