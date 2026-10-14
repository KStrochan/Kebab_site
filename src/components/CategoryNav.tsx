"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/data/menu";

export function CategoryNav() {
  const [active, setActive] = useState<CategoryId | null>(null);
  const chips = useRef<Partial<Record<CategoryId, HTMLAnchorElement | null>>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Keep the last category that crossed the reading line; leaving a section changes nothing.
        const entering = entries.filter((e) => e.isIntersecting).pop();
        if (entering) setActive(entering.target.id.replace("cat-", "") as CategoryId);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const c of CATEGORIES) {
      const el = document.getElementById(`cat-${c.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (active) {
      chips.current[active]?.scrollIntoView?.({ inline: "center", block: "nearest" });
    }
  }, [active]);

  return (
    <nav
      aria-label="Категорії меню"
      className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none]"
    >
      {CATEGORIES.map((c) => (
        <a
          key={c.id}
          ref={(el) => {
            chips.current[c.id] = el;
          }}
          href={`#cat-${c.id}`}
          aria-current={active === c.id ? "true" : undefined}
          className="flex min-h-11 items-center whitespace-nowrap rounded-full border border-line px-5 text-text transition hover:border-gold hover:text-gold aria-[current=true]:border-gold aria-[current=true]:bg-gold aria-[current=true]:text-bg-deep focus-visible:outline-2 focus-visible:outline-gold"
        >
          {c.title}
        </a>
      ))}
    </nav>
  );
}
