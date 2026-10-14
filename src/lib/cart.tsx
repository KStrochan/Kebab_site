"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { MAX_QTY, calcLine, type CartLine } from "./pricing";

const STORAGE_KEY = "kb-cart";

type CartContextValue = {
  lines: CartLine[];
  add: (line: CartLine) => void;
  setQty: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const keyOf = (l: CartLine) =>
  `${l.itemId}|${l.variantId ?? ""}|${[...l.addonIds].sort().join(",")}`;

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        Array.isArray((l as CartLine).addonIds) &&
        calcLine(l as CartLine) !== null,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Read after mount: localStorage does not exist on the server, so reading earlier would mismatch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable: cart still works in memory
    }
  }, [lines, loaded]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => keyOf(l) === keyOf(line));
      if (i === -1) return [...prev, { ...line, qty: Math.min(line.qty, MAX_QTY) }];
      return prev.map((l, idx) =>
        idx === i ? { ...l, qty: Math.min(l.qty + line.qty, MAX_QTY) } : l,
      );
    });
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setLines((prev) =>
      qty < 1
        ? prev.filter((_, i) => i !== index)
        : prev.map((l, i) => (i === index ? { ...l, qty: Math.min(qty, MAX_QTY) } : l)),
    );
  }, []);

  const remove = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      add,
      setQty,
      remove,
      clear,
      count: lines.reduce((n, l) => n + l.qty, 0),
      open,
      setOpen,
    }),
    [lines, add, setQty, remove, clear, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
