import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CartLine } from "@/lib/pricing";
import { CartButton } from "./CartButton";

const setOpen = vi.fn();
let lines: CartLine[] = [];
vi.mock("@/lib/cart", () => ({
  useCart: () => ({
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    setOpen,
  }),
}));

beforeEach(() => {
  lines = [];
  setOpen.mockClear();
});

describe("CartButton", () => {
  it("renders nothing for an empty cart", () => {
    const { container } = render(<CartButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows item count and food subtotal and opens the cart on tap", async () => {
    lines = [
      { itemId: "burger-smash", addonIds: [], qty: 2 }, // 518
      { itemId: "drink-cola-05", addonIds: [], qty: 1 }, // 49
    ];
    render(<CartButton />);
    const button = screen.getByRole("button", { name: /Кошик/ });
    expect(button).toHaveTextContent("3");
    expect(button).toHaveTextContent("567 грн");
    await userEvent.click(button);
    expect(setOpen).toHaveBeenCalledWith(true);
  });
});
