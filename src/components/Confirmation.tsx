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
      <svg
        viewBox="0 0 64 64"
        className="mx-auto h-20 w-20"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="28" className="check-ring" />
        <path d="M20 33l8 8 16-17" className="check-draw" />
      </svg>
      <h3 ref={headingRef} tabIndex={-1} className="text-gold-gradient mt-6 text-3xl outline-none">
        Дякуємо за замовлення!
      </h3>
      <Ornament className="mt-4" />
      <p className="mt-6 text-text/80">Номер вашого замовлення</p>
      <p className="mt-1 font-serif text-4xl tracking-widest text-gold">{orderId}</p>
      <p className="mx-auto mt-6 max-w-xs text-sm text-text/70">
        Ми вже отримали його й зателефонуємо, якщо потрібно щось уточнити. Оплата при отриманні.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="btn-ghost mt-8 min-h-12 rounded-full px-10"
      >
        Закрити
      </button>
    </div>
  );
}
