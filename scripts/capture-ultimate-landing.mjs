import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const base = process.env.CAPTURE_URL || "http://localhost:3002";
const out = "artifacts/ultimate-landing";
await fs.mkdir(".impeccable/review", { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
const checks = [];
// Real-time wheel-equivalent scrolling: no timeline seeking or synthetic frames.
async function glide(page, to, ms = 1500) {
  await page.evaluate(
    ({ to, ms }) =>
      new Promise((resolve) => {
        const from = scrollY,
          start = performance.now();
        function step(t) {
          const x = Math.min(1, (t - start) / ms);
          const ease = x * x * (3 - 2 * x);
          scrollTo(0, from + (to - from) * ease);
          if (x < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      }),
    { to, ms },
  );
}
for (const width of process.env.CAPTURES_ONLY ? [] : [1440, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    recordVideo: { dir: out, size: { width, height: 900 } },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page.waitForTimeout(12500);
  await page.evaluate(
    () => (document.documentElement.style.scrollBehavior = "auto"),
  );
  await page.screenshot({ path: `${out}/hero-${width}.png` });
  const ids = [
    "journey",
    "skills",
    "exam-experience",
    "insights",
    "study-path",
    "stories",
    "why",
    "pricing",
    "faq",
    "how",
  ];
  for (const id of ids) {
    const loc = page.locator("#" + id);
    const top = await loc.evaluate(
      (e) => e.getBoundingClientRect().top + scrollY,
    );
    await glide(page, top, 1800);
    await page.waitForTimeout(900);
    if (id === "skills" && width === 1440) {
      for (const f of [0.1, 0.35, 0.6, 0.9]) {
        await glide(page, top + 3240 * f, 1200);
        await page.waitForTimeout(600);
        await page.screenshot({ path: `${out}/skill-${f}.png` });
      }
    }
    if (id === "skills" && width === 390) {
      for (const y of [500, 1000, 1500]) await glide(page, top + y, 1100);
    }
    if (id === "exam-experience") {
      await page.locator("#exam-experience input[type=radio]").nth(1).check();
      await page
        .getByRole("button", { name: "Đánh dấu câu mẫu", exact: true })
        .click();
    }
    if (id === "faq") {
      await page.locator("#faq summary").first().click();
    }
    await page.screenshot({ path: `${out}/${id}-${width}.png` });
    if (id === "how") {
      await glide(page, top + 250, 1600);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${out}/finale-resolved-${width}.png` });
    }
  }
  checks.push({
    width,
    errors,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    pinSpacers: await page.locator(".pin-spacer").count(),
  });
  const video = page.video();
  await context.close();
  await video.saveAs(`${out}/landing-${width}.webm`);
}
// Settled, complete content evidence, with reduced motion to avoid offscreen masks.
for (const width of [1440, 768, 390]) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base);
  await page.waitForTimeout(1000);
  for (const image of await page.locator('img[loading="lazy"]').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(img => img.decode().catch(() => {}));
  }
  await page.evaluate(() => {document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});
  checks.push({
    width,
    reduced: true,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    pinSpacers: await page.locator(".pin-spacer").count(),
  });
  const path = `.impeccable/review/${width === 1440 ? "desktop" : width === 390 ? "mobile" : "user-768"}.png`;
  await page.screenshot({ path, fullPage: true });
  await context.close();
}
await fs.writeFile(
  `${out}/browser-checks.json`,
  JSON.stringify(checks, null, 2),
);
await browser.close();
console.log(checks);
