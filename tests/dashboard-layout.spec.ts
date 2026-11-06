import { test, expect } from "@playwright/test";

test("dashboard container and chart remain bounded across six viewport widths", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1024, 1440, 1792, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/dashboard");
    await expect(page.locator(".coverage-ring")).toBeVisible();
    await expect(
      page.getByRole("img", { name: "0 bài nộp trong 7 ngày qua" }),
    ).toHaveCSS("height", "140px");
    const bounds = await page.locator("[data-dashboard-v5]").boundingBox();
    expect(bounds).not.toBeNull();
    if (width >= 1792) expect(bounds!.width).toBe(1600);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    if (width >= 768) {
      const side = page.getByRole("complementary");
      await expect(side).toHaveCSS("width", "60px");
      await expect(side.locator("a > span[aria-hidden]")).toHaveCount(0);
      await side.hover();
      await expect(side).toHaveCSS("width", "300px");
      await expect(
        side.getByRole("link", { name: "Luyện tập", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("img", { name: "0 bài nộp trong 7 ngày qua" }),
      ).toHaveCSS("height", "140px");
    }
  }
});

test("sidebar tooltip and full labels work without collapsed text fragments", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard");
  const side = page.getByRole("complementary");
  const link = side.getByRole("link", { name: "Luyện tập", exact: true });
  await link.hover();
  await expect(page.getByRole("tooltip")).toHaveText("Luyện tập");
  await expect(side).toHaveCSS("width", "300px");
  await page.mouse.move(1200, 750);
  await expect(side).toHaveCSS("width", "60px");
  await expect(side.locator("a > span[aria-hidden]")).toHaveCount(0);
  await expect(link).toHaveAccessibleName("Luyện tập");
});
