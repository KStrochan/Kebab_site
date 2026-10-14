import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryNav } from "./CategoryNav";

type Entry = Pick<IntersectionObserverEntry, "target" | "isIntersecting">;
let callback: (entries: Entry[]) => void;

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: (entries: Entry[]) => void) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
  for (const id of ["shawarma", "hotdogs", "burgers", "snacks", "drinks"]) {
    const el = document.createElement("div");
    el.id = `cat-${id}`;
    document.body.appendChild(el);
  }
});
afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("CategoryNav", () => {
  it("links every category", () => {
    render(<CategoryNav />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
  });

  it("marks the category whose section enters the viewport as current", () => {
    render(<CategoryNav />);
    act(() =>
      callback([{ target: document.getElementById("cat-burgers")!, isIntersecting: true }]),
    );
    expect(screen.getByRole("link", { name: "Бургери" })).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("link", { name: "Шаурма" })).not.toHaveAttribute("aria-current");
  });

  it("keeps the previous category when a section leaves the viewport", () => {
    render(<CategoryNav />);
    act(() =>
      callback([{ target: document.getElementById("cat-burgers")!, isIntersecting: true }]),
    );
    act(() =>
      callback([{ target: document.getElementById("cat-burgers")!, isIntersecting: false }]),
    );
    expect(screen.getByRole("link", { name: "Бургери" })).toHaveAttribute("aria-current", "true");
  });
});
