import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

type Entry = { isIntersecting: boolean; boundingClientRect?: { top: number } };
let callback: (entries: Entry[]) => void;
let disconnect: ReturnType<typeof vi.fn>;

beforeEach(() => {
  disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: Entry[]) => void) {
        callback = cb;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("Reveal", () => {
  it("starts hidden and shows once it intersects the viewport", () => {
    render(<Reveal>Контент</Reveal>);
    const el = screen.getByText("Контент");
    expect(el).toHaveAttribute("data-shown", "false");
    act(() => callback([{ isIntersecting: true }]));
    expect(el).toHaveAttribute("data-shown", "true");
  });

  it("ignores entries that are not intersecting", () => {
    render(<Reveal>Контент</Reveal>);
    act(() => callback([{ isIntersecting: false }]));
    expect(screen.getByText("Контент")).toHaveAttribute("data-shown", "false");
  });

  it("reveals content the user already scrolled past without ever seeing it", () => {
    render(<Reveal>Контент</Reveal>);
    act(() => callback([{ isIntersecting: false, boundingClientRect: { top: -900 } }]));
    expect(screen.getByText("Контент")).toHaveAttribute("data-shown", "true");
  });

  it("keeps content below the viewport hidden", () => {
    render(<Reveal>Контент</Reveal>);
    act(() => callback([{ isIntersecting: false, boundingClientRect: { top: 1400 } }]));
    expect(screen.getByText("Контент")).toHaveAttribute("data-shown", "false");
  });

  it("stays visible after leaving the viewport and stops observing", () => {
    render(<Reveal>Контент</Reveal>);
    act(() => callback([{ isIntersecting: true }]));
    act(() => callback([{ isIntersecting: false }]));
    expect(screen.getByText("Контент")).toHaveAttribute("data-shown", "true");
    expect(disconnect).toHaveBeenCalled();
  });

  it("applies the stagger delay", () => {
    render(<Reveal delay={120}>Контент</Reveal>);
    expect(screen.getByText("Контент")).toHaveStyle({ transitionDelay: "120ms" });
  });

  it("shows content right away when IntersectionObserver is unavailable", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Reveal>Контент</Reveal>);
    await act(async () => {});
    expect(screen.getByText("Контент")).toHaveAttribute("data-shown", "true");
  });
});
