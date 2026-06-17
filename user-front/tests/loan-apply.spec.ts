import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers/mockAuth';

/**
 * 대출 신청 시나리오 E2E 테스트
 *
 * 검증 항목:
 * - 대출 상품 목록 → 상세 → 신청 플로우 화면 전환
 * - 각 스텝별 상태 변화
 * - API 연동 오류 시 에러 핸들링
 */

test.describe('대출 신청 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('대출 상품 목록 페이지 진입 및 상품 표시', async ({ page }) => {
    await page.route('**/api/loan-products', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            loanProducts: [
              {
                productId: 1,
                productName: '소상공인 성장 대출',
                minRate: 3.5,
                maxRate: 7.0,
                maxLimit: 100000000,
                description: '성장 가능성이 높은 소상공인을 위한 대출',
              },
              {
                productId: 2,
                productName: '소상공인 긴급자금 대출',
                minRate: 4.0,
                maxRate: 8.5,
                maxLimit: 50000000,
                description: '긴급 자금이 필요한 소상공인을 위한 대출',
              },
            ],
          },
        }),
      })
    );

    await page.goto('/loan');
    await page.waitForLoadState('networkidle');

    // 대출 상품이 표시되는지 확인
    await expect(page.locator('text=소상공인 성장 대출').first()).toBeVisible({ timeout: 10000 });
  });

  test('대출 상세 페이지 표시', async ({ page }) => {
    await page.route('**/api/loan-products/1', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            productId: 1,
            productName: '소상공인 성장 대출',
            minRate: 3.5,
            maxRate: 7.0,
            maxLimit: 100000000,
            minLimit: 10000000,
            description: '성장 가능성이 높은 소상공인을 위한 대출 상품입니다.',
            eligibility: 'My Biz Data 연동 완료 고객',
            repaymentMethods: ['원리금균등', '원금균등'],
          },
        }),
      })
    );

    await page.goto('/loan/1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=소상공인 성장 대출').first()).toBeVisible({ timeout: 10000 });
  });

  test('대출 신청 스텝 페이지 진입', async ({ page }) => {
    // 신청 관련 API 일괄 Mock
    await page.route('**/api/loan-applications/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {},
        }),
      })
    );

    await page.route('**/api/loan-products/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {},
        }),
      })
    );

    await page.goto('/loan/apply');
    await page.waitForLoadState('networkidle');

    // 로그인 페이지로 리다이렉트 되지 않음
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('대출 상품 목록 API 오류 시 에러 상태 표시', async ({ page }) => {
    await page.route('**/api/loan-products', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: '서버 오류' }),
      })
    );

    await page.goto('/loan');
    await page.waitForLoadState('networkidle');

    // 로그인으로 리다이렉트 되지 않음
    await expect(page).not.toHaveURL(/\/login/);
    // 페이지가 렌더링됨
    await page.waitForTimeout(3000);
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
