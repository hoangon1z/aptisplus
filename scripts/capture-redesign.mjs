import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.E2E_BASE_URL || "http://localhost:3002";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const width of [1440, 768, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("dialog", (d) => d.accept());
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const [route, name] of [
      ["/", "landing"],
      ["/dashboard", "dashboard"],
      ["/practice", "practice"],
    ]) {
      await page.goto(base + route, { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll((images) =>
        Promise.all(
          images.map((image) => {
            image.loading = "eager";
            return image.decode();
          }),
        ),
      );
      await page.screenshot({
        path: ".impeccable/qa/redesign/" + name + "-" + width + ".png",
        fullPage: true,
      });
      results.push({
        route,
        width,
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        pageErrors: [...errors],
      });
    }
    await page.goto(base + "/exam/listening");
    await page.getByRole("button", { name: "Start Assessment" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("radio", { name: /B The time/ }).click();
    await page.screenshot({
      path: ".impeccable/qa/redesign/exam-" + width + ".png",
      fullPage: true,
    });
    results.push({
      route: "/exam/listening",
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      pageErrors: [...errors],
    });
    await page
      .getByRole("button", { name: "Thoát bài thi", exact: true })
      .click();
    await page.getByRole("link", { name: "Leave test", exact: true }).click();
    await page.waitForURL("**/practice");
    console.log("Captured", width);
    await context.close();
  }
  await fs.writeFile(
    ".impeccable/qa/redesign/browser-checks.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
} finally {
  await browser.close();
}
