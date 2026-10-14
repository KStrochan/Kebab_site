import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CartLine } from "@/lib/pricing";
import { Confirmation } from "./Confirmation";
import { CartDrawer } from "./CartDrawer";

const smash: CartLine = { itemId: "burger-smash", addonIds: [], qty: 1 };
const setOpen = vi.fn();
vi.mock("@/lib/cart", () => ({
  useCart: () => ({
    lines: [smash],
    setQty: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
    open: true,
    setOpen,
  }),
}));

beforeEach(() => setOpen.mockClear());

describe("CartDrawer focus management", () => {
  it("moves focus into the dialog when it opens", () => {
    render(<CartDrawer />);
    expect(screen.getByRole("button", { name: "Закрити кошик" })).toHaveFocus();
  });

  it("wraps Tab from the last control back to the first", async () => {
    render(<CartDrawer />);
    const submit = screen.getByRole("button", { name: /Надіслати замовлення/ });
    submit.focus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Закрити кошик" })).toHaveFocus();
  });

  it("wraps Shift+Tab from the first control to the last", async () => {
    render(<CartDrawer />);
    await userEvent.tab({ shift: true });
    expect(screen.getByRole("button", { name: /Надіслати замовлення/ })).toHaveFocus();
  });

  it("returns focus to the opener when the drawer unmounts", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();
    const { unmount } = render(<CartDrawer />);
    unmount();
    expect(opener).toHaveFocus();
    opener.remove();
  });
});

describe("Confirmation", () => {
  it("takes focus so the order number is announced", () => {
    render(<Confirmation orderId="KB-ABCDE" onClose={() => {}} />);
    expect(screen.getByRole("heading", { name: /Дякуємо/ })).toHaveFocus();
  });
});
