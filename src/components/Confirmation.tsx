"use client";

import { useEffect, useRef } from "react";
import { Ornament } from "./Ornament";

export function Confirmation({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form that held focus is gone after a successful order; move focus here so screen
  // readers announce the confirmation and the order number.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="py-10 text-center">
      <h3 ref={headingRef} tabIndex={-1} className="text-2xl text-gold outline-none">
        Дякуємо за замовлення!
      </h3>
      <Ornament className="mt-4" />
      <p className="mt-6 text-text/80">Номер вашого замовлення</p>
      <p className="mt-1 text-3xl tracking-widest text-gold">{orderId}</p>
      <p className="mx-auto mt-6 max-w-xs text-sm text-text/70">
        Ми вже отримали його й зателефонуємо, якщо потрібно щось уточнити. Оплата при отриманні.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 rounded-full border border-gold px-8 py-2.5 text-gold transition hover:bg-gold hover:text-bg-deep"
      >
        Закрити
      </button>
    </div>
  );
}
