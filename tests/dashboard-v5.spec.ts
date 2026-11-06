import { test, expect } from "@playwright/test";

test("dashboard distinguishes coverage, activity and streak; range uses actual dates", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date("2026-11-04T10:00:00+07:00"));
  await page.addInitScript(() => {
    localStorage.setItem("aptis-profile", JSON.stringify({ name: "Lan" }));
    localStorage.setItem(
      "aptis-attempts",
      JSON.stringify([
        {
          id: "today",
          skill: "reading",
          title: "Reading today",
          date: "2026-11-04T02:00:00Z",
          duration: 600,
          answers: {},
        },
        {
          id: "yesterday",
          skill: "listening",
          title: "Listening yesterday",
          date: "2026-11-03T02:00:00Z",
          duration: 900,
          answers: {},
        },
        {
          id: "older",
          skill: "writing",
          title: "Writing older",
          date: "2026-10-16T02:00:00Z",
          duration: 1200,
          answers: {},
        },
      ]),
    );
  });
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Lan");
  await expect(page.locator(".coverage-ring")).toContainText("75%");
  await expect(
    page.getByRole("img", { name: "2 bài nộp trong 7 ngày qua" }),
  ).toBeVisible();
  await expect(page.getByText("ngày liên tiếp", { exact: true }).locator("..")).toContainText("2");
  await page
    .getByRole("combobox", { name: "Khoảng thời gian hoạt động" })
    .click();
  await page.getByRole("option", { name: "30 ngày", exact: true }).click();
  await expect(
    page.getByRole("img", { name: "3 bài nộp trong 30 ngày qua" }),
  ).toBeVisible();
  await expect(page.locator("[data-dashboard-v5]")).not.toContainText("B1+");
  await expect(page.locator(".dashboard-recent-list a").first()).toContainText(
    "Reading today",
  );
  await expect(
    page.getByRole("link", { name: /Bắt đầu luyện tập/ }),
  ).toHaveAttribute("href", "/exam/speaking");
});

test("unfinished session stays resumable and the ribbon animates real SVG geometry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "aptis-draft-writing",
      JSON.stringify({
        question: 2,
        deadline: Date.now() + 600000,
        answers: {},
      }),
    ),
  );
  await page.goto("/dashboard");
  await expect(
    page.getByRole("link", { name: "Tiếp tục luyện tập", exact: true }),
  ).toHaveAttribute("href", "/exam/writing");
  const contour = page.locator("[data-ribbon-highlight]").first();
  const start = await contour.getAttribute("style");
  await page.waitForTimeout(2300);
  expect(await contour.getAttribute("style")).not.toBe(start);
  expect(await page.locator("[data-ribbon-contour]").count()).toBeGreaterThan(
    20,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("heading", { name: "Tiếp nối buổi luyện của bạn." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Chọn bài khác", exact: true }).click();
  await expect(page).toHaveURL(/\/practice$/);
});
