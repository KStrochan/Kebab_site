import { ADDONS, findItem, type DeliveryZone } from "@/data/menu";

export type CartLine = {
  itemId: string;
  variantId?: string;
  addonIds: string[];
  qty: number;
};

export type Method = "delivery" | "pickup";

export const MAX_QTY = 20;
export const FREE_DELIVERY_FROM = 500;

export function calcLine(line: CartLine): number | null {
  if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > MAX_QTY) return null;
  const item = findItem(line.itemId);
  if (!item) return null;

  let unit: number;
  if (item.variants) {
    const variant = item.variants.find((v) => v.id === line.variantId);
    if (!variant) return null;
    unit = variant.price;
  } else {
    if (line.variantId !== undefined) return null;
    unit = item.price!;
  }

  for (const id of line.addonIds) {
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon || !addon.categories.includes(item.category)) return null;
    unit += addon.price;
  }
  return unit * line.qty;
}

export function calcOrder(
  lines: CartLine[],
  method: Method,
  zone?: DeliveryZone,
): { subtotal: number; delivery: number; total: number; deliveryNote?: string } | null {
  if (lines.length === 0) return null;
  let subtotal = 0;
  for (const line of lines) {
    const sum = calcLine(line);
    if (sum === null) return null;
    subtotal += sum;
  }

  if (method === "pickup") return { subtotal, delivery: 0, total: subtotal };
  if (!zone) return null;

  if (zone === "stryi") {
    const delivery = subtotal >= FREE_DELIVERY_FROM ? 0 : 100;
    return { subtotal, delivery, total: subtotal + delivery };
  }
  if (zone === "near") return { subtotal, delivery: 200, total: subtotal + 200 };
  return { subtotal, delivery: 250, total: subtotal + 250, deliveryNote: "від 250 грн" };
}
