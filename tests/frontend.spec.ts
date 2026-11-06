import { test, expect, type Page } from "@playwright/test";
import { speakingQuestions } from "../src/lib/exams";
test("dashboard uses submitted data and persists user-created schedules", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await expect(page.locator(".coverage-ring")).toContainText("0%");
  await page.getByRole("button", { name: "Thêm lịch luyện tập" }).click();
  await page.getByRole("combobox", { name: "Kỹ năng", exact: true }).click();
  await page.getByRole("option", { name: "Reading", exact: true }).click();
  await page.getByLabel("Ngày luyện", { exact: true }).fill("2026-11-10");
  await page.getByRole("button", { name: "Lưu lịch" }).click();
  await expect(page.locator(".practice-schedule")).toContainText(
    "Reading Practice 01",
  );
  await page.reload();
  await expect(page.locator(".practice-schedule")).toContainText(
    "Reading Practice 01",
  );
  await page.evaluate(() =>
    localStorage.setItem(
      "aptis-attempts",
      JSON.stringify([
        {
          id: "real-sample",
          skill: "reading",
          title: "Reading Test",
          date: "2026-11-04T08:00:00Z",
          answers: { "1.0": "sunny" },
          duration: 600,
        },
      ]),
    ),
  );
  await page.reload();
  await expect(page.locator(".coverage-ring")).toContainText("25%");
  await expect(page.locator(".dashboard-recent-list")).toContainText(
    "Reading Test",
  );
});
test("skill chapters remain readable with reduced motion and retain real destinations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("tab", { name: "Speaking", exact: true }).click();
  await expect(page.locator("#skill-scene-2")).toContainText(
    "Nói thật tự tin.",
  );
  await expect(page.locator("#skill-scene-2 a")).toHaveAttribute(
    "href",
    "/exam/speaking",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-skill-scene]")).toHaveCount(4);
});

test.use({
  permissions: ["microphone"],
  launchOptions: {
    args: [
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
    ],
  },
});
test.describe("speaking with simulated microphone input", () => {
  test("recovers visibly when prompt narration fails", async ({ page }) => {
    await page.addInitScript(() =>
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          speak: (u: SpeechSynthesisUtterance) =>
            setTimeout(
              () =>
                u.onerror?.call(u, {
                  error: "synthesis-failed",
                } as SpeechSynthesisErrorEvent),
              15,
            ),
          cancel: () => {},
        },
      }),
    );
    await page.goto("/exam/speaking");
    await page.getByRole("button", { name: "Bắt đầu thu thử" }).click();
    await page.getByRole("button", { name: "Dừng ghi âm thử" }).click();
    await page.getByRole("button", { name: /Mic đã ổn/ }).click();
    await page.getByRole("button", { name: "Start Assessment" }).click();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Thử lại câu này" }),
    ).toBeVisible();
    await expect(page.locator(".recording-panel [role=alert]")).toContainText(
      "Không thể đọc",
    );
  });
  test("checks mic, records ten answers, respects preparation and under-10s finish, persists audio", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          speak: (u: SpeechSynthesisUtterance) => {
            setTimeout(
              () =>
                u.onend?.call(
                  u,
                  new SpeechSynthesisEvent("end", { utterance: u }),
                ),
              15,
            );
          },
          cancel: () => {},
          pause: () => {},
          resume: () => {},
        },
      });
    });
    await page.goto("/exam/speaking");
    await page.getByRole("button", { name: "Bắt đầu thu thử" }).click();
    await page.getByRole("button", { name: "Dừng ghi âm thử" }).click();
    await expect(page.locator("audio")).toBeVisible();
    await page.getByRole("button", { name: /Mic đã ổn/ }).click();
    await page.getByRole("button", { name: "Start Assessment" }).click();
    let time = Date.now();
    await page.clock.setFixedTime(time);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    for (let i = 0; i < 10; i++) {
      await expect(page.locator(".speaking-task")).toContainText(
        i < 9
          ? speakingQuestions[Math.floor(i / 3)][i % 3]
          : "Tell me about a time when you were on your own.",
      );
      if (i === 9) {
        await expect(
          page.getByRole("heading", { name: "Preparation…" }),
        ).toBeVisible();
        await expect(
          page.getByRole("button", { name: "Finish Recording" }),
        ).toHaveCount(0);
        time += 60000;
        await page.clock.setFixedTime(time);
      }
      await expect(
        page.getByRole("heading", { name: "Recording…" }),
      ).toBeVisible();
      const duration = i < 3 ? 30 : i === 9 ? 120 : 45;
      time += (duration - 10) * 1000;
      await page.clock.setFixedTime(time);
      await expect(page.locator(".recording-circle")).toContainText("10s");
      await expect(
        page.getByRole("button", { name: "Finish Recording" }),
      ).toHaveCount(0);
      time += 1000;
      await page.clock.setFixedTime(time);
      await expect(
        page.getByRole("button", { name: "Finish Recording" }),
      ).toBeVisible();
      if (i === 0) {
        time += 9000;
        await page.clock.setFixedTime(time);
      } else
        await page.getByRole("button", { name: "Finish Recording" }).click();
    }
    await expect(
      page.getByRole("heading", { name: "Submit Test?" }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Submit test", exact: true })
      .click();
    await expect(
      page.getByText("Exam Submitted", { exact: true }),
    ).toBeVisible();
    const a = await page.evaluate(
      () => JSON.parse(localStorage.getItem("aptis-attempts") || "[]")[0],
    );
    expect(a.recordings).toBe(10);
    await page.getByRole("link", { name: /Xem lại bài làm/ }).click();
    await expect(page.locator("audio")).toHaveCount(10);
    await expect(page.locator("audio").first()).toHaveAttribute(
      "src",
      /^blob:/,
    );
  });
});
async function start(page: Page, skill: string) {
  await page.goto("/exam/" + skill);
  await page.getByRole("button", { name: "Start Assessment" }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
}
async function go(page: Page, n: number) {
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
  await page.getByRole("button", { name: "Close question list" }).click();
}
test("opening a question from initial Instructions initializes a timed attempt", async ({
  page,
}) => {
  await page.goto("/exam/reading");
  await page.getByRole("button", { name: "Start Assessment" }).click();
  await go(page, 3);
  await expect(
    page.getByRole("heading", { name: "Question 3 of 5" }),
  ).toBeVisible();
  await expect(page.locator(".exam-timer")).toContainText(/00:3[45]:/);
  const draft = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("aptis-draft-reading") || "{}"),
  );
  expect(draft.attemptId).toBeTruthy();
  expect(draft.deadline).toBeGreaterThan(Date.now());
});
test("reading saves dropdowns, supports ordering and review -> submit -> history", async ({
  page,
}) => {
  await start(page, "reading");
  await page.getByLabel("The weather", { exact: true }).selectOption("sunny");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".ordering-bank button").nth(2).click();
  await page.getByLabel("Position 1", { exact: true }).click();
  await expect(page.getByLabel("Position 1", { exact: true })).toContainText(
    "This road is busy",
  );
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    page.getByLabel("Position 1", { exact: true }),
  ).not.toContainText("This road is busy");
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(page.getByLabel("Position 1", { exact: true })).toContainText(
    "This road is busy",
  );
  await go(page, 5);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Question Review" }),
  ).toBeVisible();
  await expect(
    page.getByText("Not Attempted", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Review Questions", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Question 1 of 5" }),
  ).toBeVisible();
  await expect(page.getByLabel("The weather", { exact: true })).toHaveValue(
    "sunny",
  );
  await page.reload();
  await page.getByRole("button", { name: "Resume test" }).click();
  await expect(page.getByLabel("The weather", { exact: true })).toHaveValue(
    "sunny",
  );
  await go(page, 5);
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await page.getByRole("button", { name: "Submit test", exact: true }).click();
  await expect(page.getByText("Exam Submitted", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Xem lại bài làm/ }).click();
  await expect(
    page.getByRole("heading", { name: "Reading — Bài làm của bạn" }),
  ).toBeVisible();
  await expect(page.locator(".answer-review").first()).toContainText("sunny");
});
test("writing accepts excess words, preserves rich text between questions", async ({
  page,
}) => {
  await start(page, "writing");
  await page
    .getByLabel("What do you usually do in the morning?", { exact: true })
    .fill("I read books");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Answer 2", exact: true });
  await input.fill(Array(52).fill("travel").join(" "));
  await expect(page.locator(".word-counter")).toContainText("52 / 45");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Answer 2", exact: true }),
  ).toContainText("travel");
  await expect(page.locator(".word-counter")).toContainText("52 / 45");
});
test("listening playback limit persists after navigation; bookmark and accessibility", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speak: () => {},
        pause: () => {},
        resume: () => {},
        cancel: () => {},
        paused: true,
      },
      configurable: true,
    });
  });
  await start(page, "listening");
  await page.getByRole("radio", { name: /B The time/ }).click();
  const play = page.getByRole("button", { name: "Play/Stop", exact: true });
  await play.click();
  await play.click();
  await play.click();
  await play.click();
  await expect(play).toBeDisabled();
  await page.getByRole("button", { name: "Bookmark 1", exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(play).toBeDisabled();
  await expect(page.getByRole("radio", { name: /B The time/ })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page
    .getByRole("button", { name: "Accessibility", exact: true })
    .click();
  await page.getByLabel("Dark mode").check();
  await expect(page.locator(".exam-root")).toHaveClass(/exam-dark/);
  await page.getByRole("button", { name: "Increase magnification" }).click();
  await expect(page.getByText("110%", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close accessibility" }).click();
  await go(page, 14);
  await expect(page.locator(".speaker-selects select")).toHaveCount(4);
  await go(page, 15);
  await expect(page.locator(".opinion-selects select")).toHaveCount(4);
  await go(page, 16);
  await expect(page.getByRole("radiogroup")).toHaveCount(2);
});
test("expired resumed attempt auto-submits once with saved answers", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "aptis-draft-reading",
      JSON.stringify({
        answers: { "1.0": "sunny" },
        bookmarks: [],
        seen: [1],
        question: 1,
        deadline: Date.now() - 1000,
        started: Date.now() - 35000,
        attemptId: "expired-test",
      }),
    ),
  );
  await page.goto("/exam/reading");
  await page.getByRole("button", { name: "Resume test" }).click();
  await expect(page.getByText("Exam Submitted", { exact: true })).toBeVisible();
  const count = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("aptis-attempts") || "[]").filter(
        (a: { id: string }) => a.id === "expired-test",
      ).length,
  );
  expect(count).toBe(1);
});
test("admin draft CRUD and account profile survive reload", async ({
  page,
}) => {
  await page.goto("/admin");
  await page.getByRole("button", { name: "Tạo bản nháp", exact: true }).click();
  await page.getByLabel("Tên đề", { exact: true }).fill("Listening Test Draft");
  await page.getByRole("button", { name: /Lưu bản nháp/ }).click();
  await page.reload();
  await expect(
    page.getByText("Listening Test Draft", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("row")
    .filter({ hasText: "Listening Test Draft" })
    .getByRole("button", { name: "Xóa", exact: true })
    .click();
  await expect(
    page.getByText("Listening Test Draft", { exact: true }),
  ).toHaveCount(0);
  await page.goto("/account");
  await page.getByLabel("Họ và tên").fill("Minh Anh");
  await page.getByLabel("Email", { exact: true }).fill("minhanh@example.com");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await page.reload();
  await expect(page.getByLabel("Họ và tên")).toHaveValue("Minh Anh");
});
test("public and app pages do not overflow on mobile; Lucide icons rendered", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/",
    "/login",
    "/register",
    "/practice",
    "/dashboard",
    "/results",
    "/account",
    "/admin",
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    await expect(page.locator("svg.ui-icon:visible").first()).toBeVisible();
  }
  await start(page, "reading");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
