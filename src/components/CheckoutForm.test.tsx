import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CartLine } from "@/lib/pricing";
import { CheckoutForm } from "./CheckoutForm";

const clear = vi.fn();
let lines: CartLine[] = [];
vi.mock("@/lib/cart", () => ({ useCart: () => ({ lines, clear }) }));

const smash: CartLine = { itemId: "burger-smash", addonIds: [], qty: 1 };
const onSuccess = vi.fn();
const fetchMock = vi.fn();

beforeEach(() => {
  lines = [smash];
  clear.mockClear();
  onSuccess.mockClear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const fillContacts = async (name = "Іван", phone = "0730888087") => {
  await userEvent.type(screen.getByLabelText(/Ім.я/), name);
  await userEvent.type(screen.getByLabelText(/Телефон/), phone);
};
const submit = () => userEvent.click(screen.getByRole("button", { name: /Надіслати замовлення/ }));

describe("CheckoutForm", () => {
  it("shows errors and does not send for an empty name and bad phone", async () => {
    render(<CheckoutForm onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
    await userEvent.type(screen.getByLabelText(/Телефон/), "123");
    await submit();
    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(2);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requires an address for delivery", async () => {
    render(<CheckoutForm onSuccess={onSuccess} />);
    await fillContacts();
    await submit();
    expect(screen.getByText(/Вкажіть адресу/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends lines without any sums, then clears the cart and reports the order id", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ orderId: "KB-ABCDE" }) });
    render(<CheckoutForm onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
    await fillContacts();
    await submit();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith("KB-ABCDE"));
    expect(clear).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/order");
    const body = JSON.parse(init.body);
    expect(body.lines).toEqual([smash]);
    expect(body.method).toBe("pickup");
    expect(body).not.toHaveProperty("total");
    expect(body).not.toHaveProperty("price");
  });

  it("shows the venue phone and keeps the cart when the server fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 502, json: async () => ({}) });
    render(<CheckoutForm onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
    await fillContacts();
    await submit();
    expect(await screen.findByText(/0 \(73\) 088 80 87/)).toBeInTheDocument();
    expect(clear).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it.each([400, 429])(
    "shows the server message, not the call-us text, for a %s response",
    async (status) => {
      fetchMock.mockResolvedValue({
        ok: false,
        status,
        json: async () => ({ error: "Забагато спроб. Спробуйте за хвилину." }),
      });
      render(<CheckoutForm onSuccess={onSuccess} />);
      await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
      await fillContacts();
      await submit();
      expect(await screen.findByText(/Забагато спроб/)).toBeInTheDocument();
      expect(screen.queryByText(/Зателефонуйте/)).not.toBeInTheDocument();
      expect(clear).not.toHaveBeenCalled();
    },
  );

  it("limits free text fields to the lengths the server accepts", () => {
    render(<CheckoutForm onSuccess={onSuccess} />);
    expect(screen.getByLabelText(/Ім.я/)).toHaveAttribute("maxlength", "60");
    expect(screen.getByLabelText(/Адреса/)).toHaveAttribute("maxlength", "200");
    expect(screen.getByLabelText(/Коментар/)).toHaveAttribute("maxlength", "500");
  });

  it("shows the venue phone when the network request throws", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));
    render(<CheckoutForm onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
    await fillContacts();
    await submit();
    expect(await screen.findByText(/0 \(73\) 088 80 87/)).toBeInTheDocument();
    expect(clear).not.toHaveBeenCalled();
  });

  it("does not send a second request while the first is in flight", async () => {
    let resolve!: (v: unknown) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<CheckoutForm onSuccess={onSuccess} />);
    await userEvent.click(screen.getByRole("radio", { name: "Самовивіз" }));
    await fillContacts();
    const button = screen.getByRole("button", { name: /Надіслати замовлення/ });
    await userEvent.click(button);
    await userEvent.click(button);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(button).toBeDisabled();
    resolve({ ok: true, json: async () => ({ orderId: "KB-ABCDE" }) });
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  it("disables submit for an empty cart", () => {
    lines = [];
    render(<CheckoutForm onSuccess={onSuccess} />);
    expect(screen.getByRole("button", { name: /Надіслати замовлення/ })).toBeDisabled();
  });

  it("shows 100 grn delivery for Stryi under 500", () => {
    render(<CheckoutForm onSuccess={onSuccess} />);
    expect(screen.getByTestId("delivery")).toHaveTextContent("100");
    expect(screen.getByTestId("total")).toHaveTextContent("359");
  });
});
