import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
});
afterEach(() => vi.useRealTimers());

describe("Hero", () => {
  it("shows the open status on Monday noon (Kyiv)", async () => {
    vi.setSystemTime(new Date(Date.UTC(2027, 0, 4, 10, 0))); // Mon 12:00 Kyiv
    render(<Hero />);
    expect(await screen.findByText("Відкрито до 22:00")).toBeInTheDocument();
  });

  it("shows closed on Monday 22:30 (Kyiv)", async () => {
    vi.setSystemTime(new Date(Date.UTC(2027, 0, 4, 20, 30)));
    render(<Hero />);
    expect(await screen.findByText(/Зачинено/)).toBeInTheDocument();
  });

  it("links the order button to the menu", () => {
    vi.setSystemTime(new Date(Date.UTC(2027, 0, 4, 10, 0)));
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Замовити" })).toHaveAttribute("href", "#menu");
  });

  it("shows the slogan", () => {
    render(<Hero />);
    expect(screen.getByText("#Кебабтвогоміста")).toBeInTheDocument();
  });
});
