import { describe, expect, it } from "vitest";
import { ADDONS, MENU, findItem } from "./menu";

describe("menu catalog", () => {
  it("has unique item ids", () => {
    const ids = MENU.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every item exactly one of price or variants", () => {
    for (const item of MENU) {
      const hasPrice = item.price !== undefined;
      const hasVariants = item.variants !== undefined && item.variants.length > 0;
      expect(hasPrice !== hasVariants).toBe(true);
    }
  });

  it("prices Kebab Bro shawarma by meat", () => {
    const item = findItem("shawarma-kebab-bro");
    expect(item?.variants?.map((v) => [v.id, v.price])).toEqual([
      ["chicken", 219],
      ["mix", 259],
      ["beef", 309],
    ]);
  });

  it("prices smash burger at 259", () => {
    expect(findItem("burger-smash")?.price).toBe(259);
  });

  it("has no zero or negative prices and addons with categories", () => {
    for (const item of MENU) {
      const prices = item.variants ? item.variants.map((v) => v.price) : [item.price!];
      for (const p of prices) expect(p).toBeGreaterThan(0);
    }
    for (const a of ADDONS) {
      expect(a.price).toBeGreaterThan(0);
      expect(a.categories.length).toBeGreaterThan(0);
    }
  });

  it("returns undefined for an unknown id", () => {
    expect(findItem("nope")).toBeUndefined();
  });
});
