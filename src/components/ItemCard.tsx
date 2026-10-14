"use client";

import { useId, useState } from "react";
import { ADDONS, type MenuItem } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { calcLine } from "@/lib/pricing";

export function ItemCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const groupId = useId();
  const [variantId, setVariantId] = useState<string | undefined>(item.variants?.[0].id);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  const addons = ADDONS.filter((a) => a.categories.includes(item.category));
  const price = calcLine({ itemId: item.id, variantId, addonIds, qty: 1 });

  const toggleAddon = (id: string) =>
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onAdd = () => {
    add({ itemId: item.id, variantId, addonIds, qty: 1 });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="flex flex-col rounded-xl border border-line bg-card p-5">
      <h4 className="text-xl text-gold">{item.name}</h4>
      {item.description && (
        <p className="mt-2 text-sm leading-relaxed text-text/70">{item.description}</p>
      )}

      {item.variants && (
        <div role="radiogroup" aria-label="Варіант" className="mt-4 flex flex-wrap gap-2">
          {item.variants.map((v) => (
            <label
              key={v.id}
              className="flex min-h-11 cursor-pointer items-center rounded-full border border-line px-4 text-sm transition has-[:checked]:border-gold has-[:checked]:bg-gold has-[:checked]:text-bg-deep has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold"
            >
              <input
                type="radio"
                name={`${groupId}-variant`}
                value={v.id}
                checked={variantId === v.id}
                onChange={() => setVariantId(v.id)}
                className="sr-only"
              />
              {v.label} · {v.price}
            </label>
          ))}
        </div>
      )}

      {addons.length > 0 && (
        <details className="mt-4 text-sm">
          <summary className="flex min-h-11 cursor-pointer items-center text-base text-gold-dim hover:text-gold">
            Додатки
          </summary>
          <ul className="mt-1">
            {addons.map((a) => (
              <li key={a.id}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addonIds.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                    className="h-5 w-5 shrink-0 accent-[var(--gold)]"
                  />
                  <span className="flex-1">{a.label}</span>
                  <span className="text-text/70">+{a.price} грн</span>
                </label>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-2xl text-gold">
          <span data-testid="price">{price ?? ""}</span> грн
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="min-h-12 rounded-full bg-gold px-7 font-semibold text-bg-deep transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          {justAdded ? "Додано ✓" : "Додати"}
        </button>
      </div>
    </article>
  );
}
