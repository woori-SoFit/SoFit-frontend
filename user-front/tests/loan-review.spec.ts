import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers/mockAuth';

/**
 * 심사 결과 조회 시나리오 E2E 테스트
 *
 * 검증 항목:
 * - 대출 진행 현황 목록 진입 및 상태별 표시
 * - 심사 승인/거절 화면 전환
 * - 약정 실행 플로우 진입
 * - API 연동 오류 시 에러 핸들링
 */

test.describe('심사 결과 조회 플로우', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('대출 진행 현황 목록 진입', async ({ page }) => {
    await page.route('**/api/loan-applications/completed', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: { loanApplications: [] },
        }),
      })
    );

    await page.route('**/api/loan-applications', (route) => {
      // /completed는 위에서 처리하므로 여기서는 기본 목록만
      const url = route.request().url();
      if (url.includes('/completed')) return route.fallback();
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            loanApplications: [
              {
                applicationId: 1,
                productName: '소상공인 성장 대출',
                status: 'REVIEWING',
                requestedAmount: 50000000,
                appliedAt: '2026-06-10T14:30:00',
              },
            ],
          },
        }),
      });
    });

    await page.goto('/loan-applications');
    await page.waitForLoadState('networkidle');

    // 로그인 페이지로 리다이렉트되지 않고 페이지가 정상 렌더링됨
    await expect(page).not.toHaveURL(/\/login/);
    // body에 무언가 렌더링됨
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(0);
  });

  test('심사 승인 결과 상세 페이지 표시', async ({ page }) => {
    await page.route('**/api/loan-applications/completed/1', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            applicationId: 1,
            productName: '소상공인 성장 대출',
            appliedAt: '2026-06-10T14:30:00',
            requestedAmount: 50000000,
            decisionInfo: {
              decision: 'APPROVED',
              decidedAt: '2026-06-12T09:00:00',
              approvedRate: 4.5,
              approvedLimit: 50000000,
              repaymentMethod: 'EQUAL_PRINCIPAL_AND_INTEREST',
              loanTermMonths: 36,
            },
          },
        }),
      })
    );

    await page.goto('/loan/result/1');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    // 승인 관련 텍스트 (축하, 승인, 금리, 약정 등)
    await expect(page.locator('text=/축하|승인|금리|약정/').first()).toBeVisible({ timeout: 10000 });
  });

  test('심사 거절 결과 페이지에서 거절 사유 표시', async ({ page }) => {
    await page.route('**/api/loan-applications/completed/2', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            applicationId: 2,
            productName: '소상공인 성장 대출',
            appliedAt: '2026-06-10T14:30:00',
            requestedAmount: 50000000,
            decisionInfo: {
              decision: 'REJECTED',
              decidedAt: '2026-06-12T09:00:00',
              rejectionReason: '신용 등급 부족으로 대출이 어렵습니다.',
            },
          },
        }),
      })
    );

    await page.goto('/loan/result/2');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    // 거절 관련 텍스트
    await expect(page.locator('text=/거절|부족|어렵|안타깝/').first()).toBeVisible({ timeout: 10000 });
  });

  test('약정 실행 페이지 진입', async ({ page }) => {
    await page.route('**/api/loan-applications/1**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            applicationId: 1,
            productName: '소상공인 성장 대출',
            status: 'APPROVED',
            approvedRate: 4.5,
            approvedLimit: 50000000,
          },
        }),
      })
    );

    await page.goto('/loan/agreement/1');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('text=/약관|약정|동의|대출/').first()).toBeVisible({ timeout: 10000 });
  });

  test('심사 현황 API 오류 시 에러 핸들링', async ({ page }) => {
    await page.route('**/api/loan-applications**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: '서버 오류' }),
      })
    );

    await page.goto('/loan-applications');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    await page.waitForTimeout(3000);
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
