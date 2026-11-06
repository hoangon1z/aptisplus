import { test, expect } from "@playwright/test";

test("ribbon lower curves and its viewport fit the hero at every target width", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1440, 1792, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/dashboard");
    await expect(page.locator(".coverage-ring")).toBeVisible();
    const bounds = await page
      .locator("[data-dashboard-hero]")
      .evaluate((el) => {
        const svg = el.querySelector("[data-ribbon-art]") as SVGSVGElement;
        const v = svg.viewBox.baseVal;
        const hero = el.getBoundingClientRect();
        const frame = svg.getBoundingClientRect();
        return {
          outside: [...svg.querySelectorAll(":scope>g")].some((g) => {
            const b = (g as SVGGraphicsElement).getBBox();
            return b.y < v.y || b.y + b.height > v.y + v.height;
          }),
          frameFits:
            frame.left >= hero.left &&
            frame.right <= hero.right + 1 &&
            frame.top >= hero.top &&
            frame.bottom <= hero.bottom + 1,
          preserve: svg.getAttribute("preserveAspectRatio"),
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
    expect(bounds.outside).toBe(false);
    expect(bounds.frameFits).toBe(true);
    expect(bounds.preserve).toBe("xMaxYMid slice");
    expect(bounds.overflow).toBe(false);
    await expect(
      page.getByRole("link", { name: "Bắt đầu luyện tập", exact: true }),
    ).toHaveAttribute("href", "/exam/listening");
  }
});
