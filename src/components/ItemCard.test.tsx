import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findItem } from "@/data/menu";
import { ItemCard } from "./ItemCard";

const add = vi.fn();
vi.mock("@/lib/cart", () => ({ useCart: () => ({ add }) }));

beforeEach(() => add.mockClear());

const card = (id: string) => render(<ItemCard item={findItem(id)!} />);

describe("ItemCard", () => {
  it("shows meat variants and the first variant price", () => {
    card("shawarma-classic");
    expect(screen.getByRole("radio", { name: /Курка/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Мікс/ })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Яловичина/ })).toBeInTheDocument();
    expect(screen.getByTestId("price")).toHaveTextContent("149");
  });

  it("updates the price when another variant is chosen", async () => {
    card("shawarma-kebab-bro");
    await userEvent.click(screen.getByRole("radio", { name: /Яловичина/ }));
    expect(screen.getByTestId("price")).toHaveTextContent("309");
  });

  it("adds the addon price", async () => {
    card("shawarma-classic");
    await userEvent.click(screen.getByLabelText(/Бекон/));
    expect(screen.getByTestId("price")).toHaveTextContent("189");
  });

  it("adds the right cart line on click", async () => {
    card("shawarma-classic");
    await userEvent.click(screen.getByRole("radio", { name: /Мікс/ }));
    await userEvent.click(screen.getByLabelText(/Бекон/));
    await userEvent.click(screen.getByRole("button", { name: /Додати/ }));
    expect(add).toHaveBeenCalledWith({
      itemId: "shawarma-classic",
      variantId: "mix",
      addonIds: ["bacon"],
      qty: 1,
    });
  });

  it("offers no addons for drinks and no variants for single price items", () => {
    card("drink-cola-05");
    expect(screen.queryByText("Додатки")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByTestId("price")).toHaveTextContent("49");
  });

  it("adds a single price item without a variant", async () => {
    card("burger-smash");
    await userEvent.click(screen.getByRole("button", { name: /Додати/ }));
    expect(add).toHaveBeenCalledWith({
      itemId: "burger-smash",
      variantId: undefined,
      addonIds: [],
      qty: 1,
    });
  });
});
