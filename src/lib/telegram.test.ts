import { describe, expect, it, vi } from "vitest";
import { calcOrder, type CartLine } from "./pricing";
import { escapeHtml, formatOrderMessage, sendTelegram } from "./telegram";
import type { OrderInput } from "./order-schema";

const lines: CartLine[] = [
  { itemId: "shawarma-kebab-bro", variantId: "mix", addonIds: ["bacon"], qty: 2 },
];
const order: OrderInput = {
  name: "Іван",
  phone: "0730888087",
  method: "delivery",
  zone: "stryi",
  address: "вул. Шевченка 1",
  comment: "Дзвоніть у двері",
  lines,
};

describe("escapeHtml", () => {
  it("escapes &, < and >", () => {
    expect(escapeHtml("<b>&")).toBe("&lt;b&gt;&amp;");
  });
});

describe("formatOrderMessage", () => {
  const totals = calcOrder(lines, "delivery", "stryi")!;
  it("includes id, contacts, lines, delivery and total", () => {
    const text = formatOrderMessage(order, "KB-ABCDE", totals);
    expect(text).toContain("KB-ABCDE");
    expect(text).toContain("0730888087");
    expect(text).toContain("вул. Шевченка 1");
    expect(text).toContain("Кебаб Бро");
    expect(text).toContain("Мікс");
    expect(text).toContain("Бекон");
    expect(text).toContain("×2");
    expect(text).toContain("Дзвоніть у двері");
    expect(text).toContain(`${totals.total} грн`);
  });
  it("escapes user supplied html", () => {
    const text = formatOrderMessage({ ...order, name: "<script>x</script>" }, "KB-ABCDE", totals);
    expect(text).not.toContain("<script>");
    expect(text).toContain("&lt;script&gt;");
  });
  it("labels pickup", () => {
    const pickup: OrderInput = { ...order, method: "pickup", zone: undefined, address: undefined };
    const t = calcOrder(lines, "pickup")!;
    expect(formatOrderMessage(pickup, "KB-ABCDE", t)).toContain("Самовивіз");
  });
});

describe("sendTelegram", () => {
  const env = { token: "TKN", chatId: "42" };
  it("posts to the bot api with chat_id, text and HTML parse mode", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    await sendTelegram("hi", env, f as unknown as typeof fetch);
    expect(f).toHaveBeenCalledTimes(1);
    const [url, init] = f.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/botTKN/sendMessage");
    expect(JSON.parse(init.body)).toEqual({ chat_id: "42", text: "hi", parse_mode: "HTML" });
  });
  it("throws on a non-ok http status", async () => {
    const f = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    await expect(sendTelegram("hi", env, f as unknown as typeof fetch)).rejects.toThrow();
  });
  it("throws when telegram answers ok:false", async () => {
    const f = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: false }) });
    await expect(sendTelegram("hi", env, f as unknown as typeof fetch)).rejects.toThrow();
  });
  it("throws without a token", async () => {
    const f = vi.fn();
    await expect(
      sendTelegram("hi", { chatId: "42" }, f as unknown as typeof fetch),
    ).rejects.toThrow();
    expect(f).not.toHaveBeenCalled();
  });
});
