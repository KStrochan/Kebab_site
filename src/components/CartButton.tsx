"use client";

import { useCart } from "@/lib/cart";
import { calcOrder } from "@/lib/pricing";

export function CartButton() {
  const { lines, count, setOpen } = useCart();
  if (count === 0) return null;
  const subtotal = calcOrder(lines, "pickup")?.subtotal ?? 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-bg-deep via-bg-deep/90 to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto mx-auto flex h-14 w-full max-w-md items-center justify-between rounded-full bg-gold px-6 font-semibold text-bg-deep shadow-lg shadow-black/50 transition active:brightness-90 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <span className="flex items-center gap-3">
          Кошик
          <span className="grid min-w-7 place-items-center rounded-full bg-bg-deep px-2 py-0.5 text-sm text-gold">
            {count}
          </span>
        </span>
        <span>{subtotal} грн</span>
      </button>
    </div>
  );
}
