import { describe, expect, it } from "vitest";
import { allow } from "./rate-limit";

describe("allow", () => {
  it("allows 5 requests per minute per ip, then blocks, then recovers", () => {
    const t0 = 1_000_000;
    for (let i = 0; i < 5; i++) expect(allow("1.1.1.1", t0 + i)).toBe(true);
    expect(allow("1.1.1.1", t0 + 10)).toBe(false);
    expect(allow("2.2.2.2", t0 + 10)).toBe(true);
    expect(allow("1.1.1.1", t0 + 61_000)).toBe(true);
  });
});
