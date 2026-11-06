import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
const out = "artifacts/four-exams-restored";
await fs.mkdir(out, { recursive: true });
const base = process.env.CAPTURE_URL || "http://localhost:3000";
const browser = await chromium.launch({
  channel: "chrome",
  args: [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const checks = [];
async function question(page, n) {
  await page
    .getByRole("button", { name: "Question list", exact: true })
    .click();
  await page
    .locator(".question-list-item")
    .filter({
      has: page.locator("strong", {
        hasText: new RegExp("^" + String(n).padStart(2, "0") + "$"),
      }),
    })
    .click();
  await page
    .getByRole("button", { name: "Close question list", exact: true })
    .click();
}
for (const width of [1920, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 950 },
    permissions: ["microphone"],
    recordVideo: { dir: out, size: { width, height: 950 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const skill of ["listening", "reading", "writing"]) {
    await page.goto(base + "/exam/" + skill);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/${skill}-intro-${width}.png` });
    await page.getByRole("button", { name: "Start Assessment" }).click();
    await page.screenshot({
      path: `${out}/${skill}-instructions-${width}.png`,
    });
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.screenshot({ path: `${out}/${skill}-q1-${width}.png` });
    await expect(page.locator(".exam-navigator")).toHaveCount(0);
    await expect(page.locator(".premium-exam-topbar")).toHaveCount(0);
    await expect(page.locator(".exam-root")).toHaveCSS("--exam", "#23085a");
    await expect(page.locator(".exam-toolbar")).toHaveCSS("position", "fixed");
    const nums =
      skill === "listening"
        ? [14, 15, 16]
        : skill === "reading"
          ? [2, 3, 4, 5]
          : [2, 3, 4];
    for (const n of nums) {
      await question(page, n);
      await page.screenshot({ path: `${out}/${skill}-q${n}-${width}.png` });
    }
    await page
      .getByRole("button", { name: "Question list", exact: true })
      .click();
    await page.screenshot({ path: `${out}/${skill}-list-${width}.png` });
    await page
      .getByRole("button", { name: "Close question list", exact: true })
      .click();
    checks.push({
      skill,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  }
  // Simulated microphone and narration, solely for exercising all speaking states.
  await page.addInitScript(() => {
    const now = Date.now.bind(Date);
    window.offset = 0;
    Date.now = () => now() + window.offset;
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak(u) {
          queueMicrotask(() => u.onend?.(new Event("end")));
        },
        cancel() {},
      },
    });
  });
  await page.goto(base + "/exam/speaking");
  await page.screenshot({ path: `${out}/speaking-mic-${width}.png` });
  await page
    .getByRole("button", { name: "Bắt đầu thu thử", exact: true })
    .click();
  await page.waitForTimeout(500);
  await page
    .getByRole("button", { name: "Dừng ghi âm thử", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Mic đã ổn, tiếp tục", exact: true })
    .click();
  await page.getByRole("button", { name: "Start Assessment" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  for (let i = 0; i < 10; i++) {
    if (i === 9) {
      await expect(page.locator(".recording-panel h3")).toHaveText(
        "Preparation…",
      );
      await page.screenshot({
        path: `${out}/speaking-preparation-${width}.png`,
      });
      await page.evaluate(() => (window.offset += 61000));
    }
    await expect(page.locator(".recording-panel h3")).toHaveText("Recording…");
    await page.waitForTimeout(250);
    if ([0, 3, 6, 9].includes(i))
      await page.screenshot({
        path: `${out}/speaking-part${i === 0 ? 1 : i === 3 ? 2 : i === 6 ? 3 : 4}-${width}.png`,
      });
    if (i < 9) {
      await page.evaluate(() => (window.offset += 130000));
      await page.waitForTimeout(500);
    }
  }
  checks.push({
    skill: "speaking",
    width,
    errors,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/four-exams-${width}.webm`);
}
await fs.writeFile(`${out}/checks.json`, JSON.stringify(checks, null, 2));
await browser.close();
console.log(checks);
