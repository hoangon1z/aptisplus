import { test, expect } from "@playwright/test";
test("desktop storyboard is scrubbed, reversible and cleaned on resize", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("[data-motion-hero]")).toHaveAttribute(
    "data-motion-state",
    "complete",
    { timeout: 12000 },
  );
  await expect(page.locator(".hero-line")).toHaveCount(3);
  const story = page.locator("[data-motion-story]");
  const top = await story.evaluate(
    (e) => e.parentElement!.getBoundingClientRect().top + scrollY,
  );
  for (const [fraction, chapter] of [
    [0.1, "0"],
    [0.35, "1"],
    [0.6, "2"],
    [0.9, "3"],
    [0.35, "1"],
  ]) {
    await page.evaluate(
      (y) => {
        document.documentElement.style.scrollBehavior = "auto";
        scrollTo(0, y);
      },
      top + 900 * 3.6 * Number(fraction),
    );
    await expect(story).toHaveAttribute("data-chapter", String(chapter));
    await expect(
      page.locator("[data-skill-scene]").nth(Number(chapter)),
    ).toHaveCSS("opacity", "1");
  }
  await page.locator("#skill-tab-1").focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#skill-tab-2")).toBeFocused();
  await expect(story).toHaveAttribute("data-chapter", "2");
  for (const width of [768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("[data-skill-scene][inert]")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("without JavaScript all narrative content and real links remain readable", async ({
  browser,
}) => {
  const c = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const p = await c.newPage();
  await p.goto(process.env.E2E_BASE_URL || "http://localhost:3000");
  await expect(p.locator("h1")).toBeVisible();
  for (const scene of await p.locator("[data-skill-scene]").all()) {
    await expect(scene).toBeVisible();
    await expect(scene).toHaveCSS("opacity", "1");
  }
  await expect(p.locator("[data-final-preview]")).toBeVisible();
  await expect(p.locator("[data-final-cta] a").first()).toHaveAttribute(
    "href",
    "/practice",
  );
  await c.close();
});
