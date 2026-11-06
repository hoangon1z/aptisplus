import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
const out = "artifacts/shadcn-surfaces";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const checks = [];
const base = process.env.CAPTURE_URL || "http://localhost:3000";
for (const width of [1440, 768, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
    recordVideo: { dir: out, size: { width, height: 1000 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "dashboard",
    "practice",
    "results",
    "account",
    "admin",
    "login",
    "register",
  ]) {
    await page.goto(`${base}/${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${out}/${route}-${width}.png`,
      fullPage: true,
    });
    checks.push({
      route,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  }
  await page.goto(base + "/results");
  await page.evaluate(() =>
    localStorage.setItem(
      "aptis-attempts",
      JSON.stringify([
        {
          id: "qa-reading",
          skill: "reading",
          title: "Reading Practice Test — QA fixture",
          date: "2026-11-04T08:00:00Z",
          duration: 600,
          answers: { "1.0": "sunny" },
        },
        {
          id: "qa-writing",
          skill: "writing",
          title: "Writing Practice Test — QA fixture",
          date: "2026-11-04T09:00:00Z",
          duration: 1200,
          answers: { 2: "I enjoy learning English." },
        },
      ]),
    ),
  );
  await page.reload();
  await expect(page.locator('[data-slot="table-body"] [data-slot="table-row"]')).toHaveCount(2);
  await page.screenshot({ path: `${out}/results-data-${width}.png` });
  await page.goto(base + "/results/qa-reading");
  await expect(page.locator('.answer-review')).toContainText('sunny');
  await page.screenshot({
    path: `${out}/result-detail-${width}.png`,
    fullPage: true,
  });
  await page.goto(base + "/practice");
  await page.getByRole("tab", { name: "Reading", exact: true }).click();
  await expect(page.locator(".exam-card")).toHaveCount(1);
  await page.getByLabel("Tìm bộ đề", { exact: true }).fill("khongtimthay");
  await expect(
    page.getByText("Chưa tìm thấy bộ đề", { exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: `${out}/practice-empty-${width}.png` });
  await page.goto(base + "/dashboard");
  if (width === 1440) {
    await page.getByRole("button", { name: "Lưu trên thiết bị", exact: true }).focus();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await page.screenshot({ path: `${out}/local-data-tooltip-${width}.png` });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("tooltip")).toHaveCount(0);
  }
  if (width < 1000) {
    await page
      .getByRole("button", { name: "Mở điều hướng", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({ path: `${out}/navigation-sheet-${width}.png` });
    await page.keyboard.press("Escape");
  }
  await page
    .getByRole("button", { name: "Menu tài khoản", exact: true })
    .click();
  await page.screenshot({ path: `${out}/profile-menu-${width}.png` });
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Thêm lịch luyện tập", exact: true })
    .click();
  await page.getByRole("combobox", { name: "Kỹ năng", exact: true }).click();
  await page.getByRole("option", { name: "Reading", exact: true }).click();
  await page.getByLabel("Ngày luyện", { exact: true }).fill("2026-11-10");
  await page.screenshot({ path: `${out}/schedule-form-${width}.png` });
  await page.getByRole("button", { name: "Lưu lịch", exact: true }).click();
  await expect(page.locator(".practice-schedule")).toContainText(
    "Reading Practice 01",
  );
  checks.push({ width, errors });
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/outside-${width}.webm`);
}
await fs.writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
console.log(checks);
await browser.close();
