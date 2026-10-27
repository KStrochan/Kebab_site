import { expect, test } from "@playwright/test";

test("home page renders without errors or horizontal scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    // Failed network loads (e.g. remote images offline) are not code errors.
    if (msg.type() === "error" && !msg.text().startsWith("Failed to load resource"))
      errors.push(msg.text());
  });

  const response = await page.goto("/");
  expect(response?.status()).toBeLessThan(400);
  await expect(page.locator("h1").first()).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(1);
  expect(errors, "console or page errors").toEqual([]);
});

test("internal links from the home page respond", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.$$eval("a[href]", (links) =>
    links
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h.startsWith("/") && !h.startsWith("//")),
  );
  const unique = [...new Set(hrefs.map((h) => h.split("#")[0] || "/"))];
  for (const href of unique) {
    const res = await request.get(href);
    expect(res.status(), `${href} returned ${res.status()}`).toBeLessThan(400);
  }
});
