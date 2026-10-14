"use client";

import { useEffect, useRef, useState } from "react";
import { ADDONS, findItem } from "@/data/menu";
import { useCart } from "@/lib/cart";
import { calcLine, MAX_QTY, type CartLine } from "@/lib/pricing";
import { CheckoutForm } from "./CheckoutForm";
import { Confirmation } from "./Confirmation";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

function describe(line: CartLine): { title: string; extra: string } {
  const item = findItem(line.itemId);
  const variant = item?.variants?.find((v) => v.id === line.variantId)?.label;
  const addons = line.addonIds
    .map((id) => ADDONS.find((a) => a.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  return {
    title: [item?.name, variant && `(${variant})`].filter(Boolean).join(" "),
    extra: addons ? `+ ${addons}` : "",
  };
}

export function CartDrawer() {
  const { lines, setQty, remove, open, setOpen } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);

  const close = () => {
    setOpen(false);
    setOrderId(null);
  };

  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOrderId(null);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.tabIndex >= 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // The opener (cart button) disappears once the cart is emptied; fall back to the menu.
      (opener?.isConnected ? opener : document.getElementById("menu"))?.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="drawer-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Кошик"
        className="drawer-panel relative flex h-dvh w-full max-w-md flex-col overflow-y-auto overscroll-contain border-l border-line bg-gradient-to-b from-[#432a1d] to-bg px-5 pt-5 shadow-[-30px_0_60px_-20px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-gold-gradient text-3xl">Ваше замовлення</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Закрити кошик"
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-xl text-gold hover:bg-card"
          >
            ×
          </button>
        </div>

        {orderId ? (
          <Confirmation orderId={orderId} onClose={close} />
        ) : lines.length === 0 ? (
          <p className="mt-10 text-center text-text/70">Кошик порожній. Оберіть щось смачне з меню.</p>
        ) : (
          <>
            <ul className="mt-5 divide-y divide-line">
              {lines.map((line, i) => {
                const { title, extra } = describe(line);
                return (
                  <li key={`${line.itemId}-${line.variantId}-${line.addonIds.join()}`} className="py-3">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-text">{title}</p>
                        {extra && <p className="text-sm text-text/60">{extra}</p>}
                      </div>
                      <p className="whitespace-nowrap text-gold">{calcLine(line)} грн</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Менше"
                        onClick={() => setQty(i, line.qty - 1)}
                        className="h-11 w-11 rounded-full border border-line hover:bg-card"
                      >
                        −
                      </button>
                      <span aria-live="polite" className="min-w-5 text-center">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Більше"
                        disabled={line.qty >= MAX_QTY}
                        onClick={() => setQty(i, line.qty + 1)}
                        className="h-11 w-11 rounded-full border border-line hover:bg-card disabled:opacity-40"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(i)}
                        className="ml-auto min-h-11 px-3 text-sm text-text/60 underline-offset-4 hover:text-gold hover:underline"
                      >
                        Прибрати
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-line pt-5">
              <CheckoutForm onSuccess={setOrderId} />
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
