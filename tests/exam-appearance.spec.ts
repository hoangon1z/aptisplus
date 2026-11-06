import { test, expect } from "@playwright/test";
for (const skill of ["listening", "reading", "writing"]) {
  test(`${skill} keeps the reference exam shell separate from marketing styles`, async ({
    page,
  }) => {
    await page.goto(`/exam/${skill}`);
    await page.getByRole("button", { name: "Start Assessment" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.locator(".exam-root")).not.toHaveClass(/premium-exam/);
    await expect(page.locator(".exam-root")).toHaveCSS("--exam", "#23085a");
    await expect(page.locator(".exam-root")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator(".exam-navigator")).toHaveCount(0);
    await expect(page.locator(".premium-exam-topbar")).toHaveCount(0);
    await expect(page.locator(".exam-toolbar")).toHaveCSS("position", "fixed");
    await expect(page.locator(".exam-timer > span")).toBeVisible();
    await page
      .getByRole("button", { name: "Question list", exact: true })
      .click();
    await expect(page.locator(".question-list")).toBeVisible();
    const left = await page
      .locator(".question-list")
      .evaluate((e) => e.getBoundingClientRect().left);
    expect(left).toBeLessThan(20);
  });
}
