import { test, expect } from "@playwright/test";

test("메인 페이지 진입", async ({ page }) => {
  await page.goto("/");

  await page.screenshot({
    path: "main-page.png",
    fullPage: true,
  });

  await expect(page).toHaveTitle(/SoFit/i);
});