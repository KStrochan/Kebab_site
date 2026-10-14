import { describe, expect, it } from "vitest";
import { normalizePhone, orderSchema } from "./order-schema";

const base = {
  name: "Іван",
  phone: "0730888087",
  method: "pickup",
  lines: [{ itemId: "burger-smash", addonIds: [], qty: 1 }],
};

describe("normalizePhone", () => {
  it.each(["+380 73 088-80-87", "0730888087", "(073) 088 80 87", "380730888087"])(
    "normalizes %s",
    (raw) => expect(normalizePhone(raw)).toBe("0730888087"),
  );
  it.each(["123", "abc", "", "+1 202 555 0100"])("rejects %s", (raw) =>
    expect(normalizePhone(raw)).toBeNull(),
  );
});

describe("orderSchema", () => {
  it("accepts a valid pickup order and normalizes the phone", () => {
    const r = orderSchema.safeParse({ ...base, phone: "+380 73 088-80-87" });
    expect(r.success).toBe(true);
    expect(r.success && r.data.phone).toBe("0730888087");
  });
  it("rejects a short name", () => {
    expect(orderSchema.safeParse({ ...base, name: "І" }).success).toBe(false);
  });
  it("rejects a bad phone", () => {
    expect(orderSchema.safeParse({ ...base, phone: "12345" }).success).toBe(false);
  });
  it("requires zone and address for delivery", () => {
    expect(orderSchema.safeParse({ ...base, method: "delivery" }).success).toBe(false);
    expect(
      orderSchema.safeParse({ ...base, method: "delivery", zone: "stryi", address: "ab" }).success,
    ).toBe(false);
    expect(
      orderSchema.safeParse({
        ...base,
        method: "delivery",
        zone: "stryi",
        address: "вул. Шевченка 1",
      }).success,
    ).toBe(true);
  });
  it("rejects empty and oversized carts", () => {
    expect(orderSchema.safeParse({ ...base, lines: [] }).success).toBe(false);
    const many = Array.from({ length: 31 }, () => base.lines[0]);
    expect(orderSchema.safeParse({ ...base, lines: many }).success).toBe(false);
  });
  it("passes the honeypot field through for the route to inspect", () => {
    const r = orderSchema.safeParse({ ...base, website: "http://spam" });
    expect(r.success && r.data.website).toBe("http://spam");
  });
  it("strips unknown fields such as client totals", () => {
    const r = orderSchema.safeParse({ ...base, total: 1, price: 1 });
    expect(r.success && "total" in r.data).toBe(false);
  });
});
