import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

let ipCounter = 0;
const post = (body: unknown, ip = `10.0.0.${++ipCounter}`) =>
  POST(
    new Request("http://localhost/api/order", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const valid = {
  name: "Іван",
  phone: "0730888087",
  method: "pickup",
  lines: [{ itemId: "burger-smash", addonIds: [], qty: 2 }],
};

let tg: ReturnType<typeof vi.fn>;
beforeEach(() => {
  process.env.TELEGRAM_BOT_TOKEN = "TKN";
  process.env.TELEGRAM_CHAT_ID = "42";
  tg = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", tg);
});
afterEach(() => vi.unstubAllGlobals());

const sentText = () => JSON.parse(tg.mock.calls[0][1].body).text as string;

describe("POST /api/order", () => {
  it("accepts a valid order, notifies telegram once and returns an id", async () => {
    const res = await post(valid);
    expect(res.status).toBe(200);
    expect((await res.json()).orderId).toMatch(/^KB-[A-Z0-9]{5}$/);
    expect(tg).toHaveBeenCalledTimes(1);
    expect(sentText()).toContain("518 грн");
  });

  it("ignores client supplied totals and prices", async () => {
    const res = await post({ ...valid, total: 1, price: 1, subtotal: 1 });
    expect(res.status).toBe(200);
    expect(sentText()).toContain("518 грн");
    expect(sentText()).not.toContain("Разом: 1 грн");
  });

  it("rejects an unknown item without calling telegram", async () => {
    const res = await post({ ...valid, lines: [{ itemId: "nope", addonIds: [], qty: 1 }] });
    expect(res.status).toBe(400);
    expect(tg).not.toHaveBeenCalled();
  });

  it("rejects qty 21", async () => {
    const res = await post({ ...valid, lines: [{ itemId: "burger-smash", addonIds: [], qty: 21 }] });
    expect(res.status).toBe(400);
  });

  it("silently accepts a filled honeypot without calling telegram", async () => {
    const res = await post({ ...valid, website: "http://spam.example" });
    expect(res.status).toBe(200);
    expect(tg).not.toHaveBeenCalled();
  });

  it("returns 502 when telegram fails", async () => {
    tg.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    const res = await post(valid);
    expect(res.status).toBe(502);
  });

  it("returns 429 on the sixth request from one ip", async () => {
    const ip = "9.9.9.9";
    for (let i = 0; i < 5; i++) expect((await post(valid, ip)).status).toBe(200);
    expect((await post(valid, ip)).status).toBe(429);
  });

  it("returns 400 for a non json body", async () => {
    expect((await post("not json")).status).toBe(400);
  });

  it("escapes html in user text sent to telegram", async () => {
    await post({ ...valid, name: "<b>Хакер</b>" });
    expect(sentText()).not.toContain("<b>Хакер</b>");
  });
});
