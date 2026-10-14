import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "@/data/menu";
import { CategoryIcon } from "./CategoryIcon";

describe("CategoryIcon", () => {
  it.each(CATEGORIES.map((c) => c.id))("renders a decorative svg for %s", (id) => {
    const { container } = render(<CategoryIcon id={id} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg!.querySelectorAll("path,circle,rect,ellipse,line").length).toBeGreaterThan(1);
  });
});
