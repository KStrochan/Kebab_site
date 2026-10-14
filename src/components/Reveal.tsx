"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// Fades and lifts content in the first time it scrolls into view. Styles live in globals.css (.reveal).
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setShown(true));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Also reveal content that is already above the viewport: a jump (menu chip, anchor,
        // restored scroll) can skip it, and it must not be blank when the user scrolls back up.
        if (entries.some((e) => e.isIntersecting || (e.boundingClientRect?.top ?? 0) < 0)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
