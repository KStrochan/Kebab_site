import { describe, expect, it } from "vitest";
import { calcLine, calcOrder, type CartLine } from "./pricing";

const mixBacon: CartLine = {
  itemId: "shawarma-kebab-bro",
  variantId: "mix",
  addonIds: ["bacon"],
  qty: 2,
};
const smash = (qty = 1): CartLine => ({ itemId: "burger-smash", addonIds: [], qty });

describe("calcLine", () => {
  it("adds variant, addons and multiplies by qty", () => {
    expect(calcLine(mixBacon)).toBe((259 + 40) * 2);
  });
  it("rejects unknown item", () => {
    expect(calcLine({ itemId: "x", addonIds: [], qty: 1 })).toBeNull();
  });
  it("rejects a missing required variant", () => {
    expect(calcLine({ itemId: "shawarma-kebab-bro", addonIds: [], qty: 1 })).toBeNull();
  });
  it("rejects an unknown variant", () => {
    expect(
      calcLine({ itemId: "shawarma-kebab-bro", variantId: "pork", addonIds: [], qty: 1 }),
    ).toBeNull();
  });
  it("rejects an addon not allowed for the category", () => {
    expect(calcLine({ itemId: "drink-cola-05", addonIds: ["bacon"], qty: 1 })).toBeNull();
  });
  it("rejects qty 0 and 21", () => {
    expect(calcLine(smash(0))).toBeNull();
    expect(calcLine(smash(21))).toBeNull();
  });
  it("rejects non-integer qty", () => {
    expect(calcLine(smash(1.5))).toBeNull();
  });
});

describe("calcOrder", () => {
  it("has no delivery for pickup", () => {
    expect(calcOrder([smash()], "pickup")).toEqual({ subtotal: 259, delivery: 0, total: 259 });
  });
  it("charges 100 in Stryi at 499", () => {
    const lines: CartLine[] = [
      { itemId: "drink-rich-05", addonIds: [], qty: 9 }, // 450
      { itemId: "drink-cola-05", addonIds: [], qty: 1 }, // 49
    ];
    const r = calcOrder(lines, "delivery", "stryi")!;
    expect(r.subtotal).toBe(499);
    expect(r.delivery).toBe(100);
    expect(r.total).toBe(599);
  });
  it("is free in Stryi at exactly 500", () => {
    const lines: CartLine[] = [{ itemId: "drink-rich-05", addonIds: [], qty: 10 }];
    const r = calcOrder(lines, "delivery", "stryi")!;
    expect(r.subtotal).toBe(500);
    expect(r.delivery).toBe(0);
  });
  it("charges 200 for the near zone regardless of subtotal", () => {
    expect(calcOrder([smash(3)], "delivery", "near")!.delivery).toBe(200);
  });
  it("charges 250 with a note for the far zone", () => {
    const r = calcOrder([smash()], "delivery", "far")!;
    expect(r.delivery).toBe(250);
    expect(r.deliveryNote).toBe("від 250 грн");
  });
  it("returns null for delivery without a zone", () => {
    expect(calcOrder([smash()], "delivery")).toBeNull();
  });
  it("returns null for an empty cart or any invalid line", () => {
    expect(calcOrder([], "pickup")).toBeNull();
    expect(calcOrder([smash(), { itemId: "x", addonIds: [], qty: 1 }], "pickup")).toBeNull();
  });
});
