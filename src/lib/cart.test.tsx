import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "./cart";
import type { CartLine } from "./pricing";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;
const smash: CartLine = { itemId: "burger-smash", addonIds: [], qty: 1 };
const mix: CartLine = { itemId: "shawarma-classic", variantId: "mix", addonIds: [], qty: 1 };
const beef: CartLine = { itemId: "shawarma-classic", variantId: "beef", addonIds: [], qty: 1 };

beforeEach(() => localStorage.clear());

describe("useCart", () => {
  it("merges identical lines and adds quantities", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(smash));
    act(() => result.current.add(smash));
    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0].qty).toBe(2);
    expect(result.current.count).toBe(2);
  });

  it("keeps different variants as separate lines", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(mix));
    act(() => result.current.add(beef));
    expect(result.current.lines).toHaveLength(2);
  });

  it("treats addon order as irrelevant when merging", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add({ ...mix, addonIds: ["bacon", "egg"] }));
    act(() => result.current.add({ ...mix, addonIds: ["egg", "bacon"] }));
    expect(result.current.lines).toHaveLength(1);
  });

  it("removes a line when qty is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(smash));
    act(() => result.current.setQty(0, 0));
    expect(result.current.lines).toHaveLength(0);
  });

  it("caps quantity at 20", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add({ ...smash, qty: 15 }));
    act(() => result.current.add({ ...smash, qty: 15 }));
    expect(result.current.lines[0].qty).toBe(20);
    act(() => result.current.setQty(0, 99));
    expect(result.current.lines[0].qty).toBe(20);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(smash));
    act(() => result.current.clear());
    expect(result.current.lines).toEqual([]);
  });

  it("starts empty when stored json is corrupt", () => {
    localStorage.setItem("kb-cart", "{bad json");
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lines).toEqual([]);
  });

  it("drops stored lines whose item no longer exists", () => {
    localStorage.setItem(
      "kb-cart",
      JSON.stringify([{ itemId: "gone", addonIds: [], qty: 1 }, smash]),
    );
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lines).toEqual([smash]);
  });

  it("persists lines to localStorage", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(smash));
    expect(localStorage.getItem("kb-cart")).toContain("burger-smash");
  });

  it("tracks the drawer open state", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
  });
});
