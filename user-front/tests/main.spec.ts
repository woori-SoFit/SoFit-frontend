import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers/mockAuth';

test('메인 페이지 진입', async ({ page }) => {
  await mockAuthenticatedUser(page);

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveTitle(/SoFit/i);
});
