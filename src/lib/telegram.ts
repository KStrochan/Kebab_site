import { ADDONS, ZONES, findItem } from "@/data/menu";
import type { OrderInput } from "./order-schema";
import { calcLine, type calcOrder } from "./pricing";

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

type Totals = NonNullable<ReturnType<typeof calcOrder>>;

export function formatOrderMessage(o: OrderInput, orderId: string, totals: Totals): string {
  const out: string[] = [];
  out.push(`🧾 <b>Нове замовлення ${escapeHtml(orderId)}</b>`);
  out.push(`👤 ${escapeHtml(o.name)}`);
  out.push(`📞 ${escapeHtml(o.phone)}`);
  if (o.method === "delivery") {
    const zone = o.zone ? ZONES[o.zone].label : "";
    out.push(`🚚 Доставка: ${escapeHtml(zone)}, ${escapeHtml(o.address ?? "")}`);
  } else {
    out.push(`🏪 Самовивіз${o.time ? `, час: ${escapeHtml(o.time)}` : ""}`);
  }
  if (o.comment) out.push(`💬 ${escapeHtml(o.comment)}`);
  out.push("");
  for (const line of o.lines) {
    const item = findItem(line.itemId);
    const variant = item?.variants?.find((v) => v.id === line.variantId)?.label;
    const addons = line.addonIds
      .map((id) => ADDONS.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");
    const title = [item?.name, variant && `(${variant})`].filter(Boolean).join(" ");
    const extra = addons ? ` + ${addons}` : "";
    out.push(
      `• ${escapeHtml(title)}${escapeHtml(extra)} ×${line.qty} — ${calcLine(line)} грн`,
    );
  }
  out.push("");
  out.push(`Страви: ${totals.subtotal} грн`);
  if (o.method === "delivery") {
    out.push(
      `Доставка: ${totals.delivery} грн${totals.deliveryNote ? ` (${totals.deliveryNote})` : ""}`,
    );
  }
  out.push(`<b>Разом: ${totals.total} грн</b>`);
  out.push("Оплата при отриманні");
  return out.join("\n");
}

export async function sendTelegram(
  text: string,
  env: { token?: string; chatId?: string } = {
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  if (!env.token || !env.chatId) throw new Error("Telegram is not configured");
  const res = await fetchImpl(`https://api.telegram.org/bot${env.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: env.chatId, text, parse_mode: "HTML" }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
  if (!res.ok || !data.ok) throw new Error(`Telegram request failed (${res.status})`);
}
