import { test, expect } from "@playwright/test";
test("opening can be skipped and refresh starts a fresh sequence", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-aim-opening]")).toBeVisible();
  await expect(page.locator("[data-landing-content]")).toHaveAttribute(
    "inert",
    "",
  );
  await expect(page.locator("[data-aim-level]")).toHaveCount(6);
  await expect(page.locator("[data-brand-part]")).toHaveCount(6);
  await expect(page.locator("[data-intro-trail]")).toHaveCount(6);
  await page.getByRole("button", { name: "Bỏ qua ↗" }).click();
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  await expect(page.locator("[data-landing-content]")).not.toHaveAttribute(
    "inert",
    "",
  );
  expect(
    await page.evaluate(() => document.documentElement.style.overflow),
  ).not.toBe("hidden");
  await expect(page.locator("[data-motion-hero]")).toHaveAttribute(
    "data-motion-state",
    "complete",
  );
  await page.reload();
  await expect(page.locator("[data-aim-opening]")).toBeVisible();
  await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
    "data-opening-state",
    "playing",
  );
  await page.keyboard.press("Escape");
});
test("Escape and reduced-motion preference dismiss the opening without trapping the page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-aim-opening]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  await page.reload();
  await expect(page.locator("[data-aim-opening]")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("replay reassembles the real logo, matches the header and restores navigation", async ({
  page,
}) => {
  test.setTimeout(45000);
  await page.goto("/");
  await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
    "data-opening-state",
    "complete",
    { timeout: 12000 },
  );
  expect(
    Number(
      await page
        .locator("[data-aim-opening]")
        .getAttribute("data-handoff-error"),
    ),
  ).toBeLessThan(1);
  await page.getByRole("button", { name: "Xem lại mở đầu" }).click();
  await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
    "data-opening-state",
    "playing",
  );
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Bỏ qua ↗" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Xem lại mở đầu" }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("complete intro restarts on three document loads, regardless of obsolete storage flags", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.addInitScript(() => {
    const scenes: string[] = [];
    Object.defineProperty(window, "__introScenes", { value: scenes });
    new MutationObserver(() => {
      const scene =
        document.querySelector<HTMLElement>("[data-aim-opening]")?.dataset
          .scene;
      if (scene && scenes.at(-1) !== scene) scenes.push(scene);
    }).observe(document, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-scene"],
    });
    sessionStorage.setItem("aptisplus-aim-opening-v2", "seen");
    localStorage.setItem("aptisplus-aim-opening-v2", "seen");
  });
  const origins: number[] = [];
  for (let run = 0; run < 3; run++) {
    if (run === 0) await page.goto("/");
    else await page.reload();
    origins.push(await page.evaluate(() => performance.timeOrigin));
    await expect(page.locator("[data-aim-opening]")).toBeVisible();
    await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
      "data-opening-state",
      "complete",
      { timeout: 12000 },
    );
    const scenes = await page.evaluate(
      () => Reflect.get(window, "__introScenes") as string[],
    );
    expect(scenes[0]).toBe("intro:start");
    expect(scenes).toEqual(
      expect.arrayContaining([
        "text:question",
        "levels:expand",
        "logo:assemble",
        "hero:reveal",
        "intro:complete",
      ]),
    );
    expect(
      Number(
        await page
          .locator("[data-aim-opening]")
          .getAttribute("data-handoff-error"),
      ),
    ).toBeLessThan(1);
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await expect(page.locator("[data-landing-content]")).not.toHaveAttribute(
      "inert",
      "",
    );
    expect(
      await page.evaluate(() => document.documentElement.style.overflow),
    ).not.toBe("hidden");
    await page.keyboard.press("Tab");
    await expect(page.locator("[data-intro-skip]")).not.toBeFocused();
  }
  expect(new Set(origins).size).toBe(3);
  expect(
    await page.evaluate(
      () =>
        (
          performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming
        ).type,
    ),
  ).toBe("reload");
});

test("client-side home navigation never autoplays, while explicit replay still resets the opening", async ({
  page,
}) => {
  await page.goto("/login");
  const documentOrigin = await page.evaluate(() => performance.timeOrigin);
  await page.getByRole("link", { name: "Về trang chủ" }).click();
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(
    documentOrigin,
  );
  await page.getByRole("button", { name: "Xem lại mở đầu" }).click();
  await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
    "data-scene",
    "intro:start",
  );
  await expect(page.locator("[data-brand-resolved]")).toBeHidden();
  await page.getByRole("button", { name: "Bỏ qua ↗" }).click();
  await page.getByRole("link", { name: "Đăng nhập", exact: true }).click();
  await page.getByRole("link", { name: "Về trang chủ" }).click();
  await expect(page.locator("[data-aim-opening]")).toBeHidden();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(
    documentOrigin,
  );
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Xem lại mở đầu" }).click();
    await expect(page.locator("[data-aim-opening]")).toHaveAttribute(
      "data-scene",
      "intro:start",
    );
    await page.keyboard.press("Escape");
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  }
});
