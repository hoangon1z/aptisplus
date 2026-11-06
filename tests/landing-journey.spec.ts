import { test, expect } from "@playwright/test";
test("reference exam preview keeps pointer controls usable on the landing", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Bỏ qua ↗" }).click();
  await page.locator("#exam-experience").evaluate((e) => {
    document.documentElement.style.scrollBehavior = "auto";
    scrollTo(0, e.getBoundingClientRect().top + scrollY);
  });
  await page.waitForTimeout(1100);
  const mark = page.getByRole("button", {
    name: "Đánh dấu câu mẫu",
    exact: true,
  });
  await mark.click();
  await expect(mark).toHaveAttribute("aria-pressed", "true");
  await page.locator("#exam-experience").getByRole("radio").first().check();
});
test("sample exam preserves answers, bookmarks and two-play budget across navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", {
      value: { speak() {}, cancel() {} },
    });
  });
  await page.goto("/");
  const sample = page.locator("#exam-experience");
  await sample.getByRole("radio").nth(1).check();
  await sample
    .getByRole("button", { name: "Đánh dấu câu mẫu", exact: true })
    .click();
  await sample.getByRole("button", { name: "Nghe câu mẫu" }).click();
  await sample.getByRole("button", { name: "Dừng âm thanh" }).click();
  await sample.getByRole("button", { name: "Nghe câu mẫu" }).click();
  await sample.getByRole("button", { name: "Dừng âm thanh" }).click();
  await expect(
    sample.getByRole("button", { name: "Nghe câu mẫu" }),
  ).toBeDisabled();
  await sample.getByRole("button", { name: "Câu tiếp" }).click();
  await expect(
    sample.getByRole("button", { name: "Nghe câu mẫu" }),
  ).toBeEnabled();
  await sample.getByRole("radio").first().check();
  await sample.getByRole("button", { name: "Câu trước" }).click();
  await expect(sample.getByRole("radio").nth(1)).toBeChecked();
  await expect(
    sample.getByRole("button", { name: "Đánh dấu câu mẫu", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(sample).toContainText("Đã chọn đáp án: 2/2");
  await expect(
    sample.getByRole("button", { name: "Nghe câu mẫu" }),
  ).toBeDisabled();
});
test("public data is honest, FAQ works by keyboard, insights use actual local attempts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "aptis-attempts",
      JSON.stringify([
        {
          id: "fixture",
          skill: "reading",
          title: "Reading",
          date: "2026-11-04",
          duration: 600,
          answers: {},
        },
      ]),
    ),
  );
  await page.goto("/");
  await expect(page.locator("#insights")).toContainText("10");
  await expect(page.locator("#insights")).toContainText("Reading");
  await expect(page.locator("#stories")).toContainText(
    "Chưa có câu chuyện học viên được xác minh",
  );
  await expect(page.locator("#pricing")).toContainText("Chưa công bố");
  await expect(page.locator("#pricing a")).toHaveCount(1);
  const faq = page.locator("#faq");
  await faq
    .getByRole("tab", { name: "Bài làm & dữ liệu", exact: true })
    .click();
  await expect(faq.locator('[data-slot="accordion-item"]')).toHaveCount(2);
  await faq.locator('[data-slot="accordion-trigger"]').first().focus();
  await page.keyboard.press("Enter");
  await expect(
    faq.locator('[data-slot="accordion-trigger"]').first(),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(faq).toContainText("IndexedDB");
  await page.getByRole("button", { name: "Đổi giao diện minh họa" }).click();
  await expect(
    page.getByRole("button", { name: "Đổi giao diện minh họa" }),
  ).toHaveAttribute("aria-pressed", "true");
});
