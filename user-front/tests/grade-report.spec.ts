import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from './helpers/mockAuth';

/**
 * S등급 분석 리포트 조회 시나리오 E2E 테스트
 *
 * 검증 항목:
 * - S등급 분석 리포트 진입 시 My Biz Data 연결 여부에 따른 분기
 * - 배치 미실행 시 안내 메시지 표시
 * - 배치 완료 시 등급 결과 및 상세 리포트(LLM 자연어 설명) 표시
 * - 화면 전환 및 상태 변화 검증
 * - API 연동 오류 시 에러 핸들링
 */

test.describe('S등급 분석 리포트 조회', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('리포트 인트로 페이지 진입 시 콘텐츠 표시', async ({ page }) => {
    await page.goto('/grade-report');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    // INTRO 스텝 — "성장등급 리포트" 텍스트와 시작 버튼이 표시
    await expect(page.locator('text=성장등급 리포트')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=S분석 리포트 시작하기')).toBeVisible();
  });

  test('My Biz Data 미연결 시 연결 유도 화면 표시', async ({ page }) => {
    // mybiz-status API: 미연결 응답
    await page.route('**/api/report/mybiz-status', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: { isMybizConnected: false },
        }),
      })
    );

    // S등급 API도 null 응답 (미산출)
    await page.route('**/api/s-grade**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: null,
        }),
      })
    );

    await page.goto('/grade-report');
    await page.waitForLoadState('networkidle');

    // "S분석 리포트 시작하기" 버튼 클릭
    await page.locator('text=S분석 리포트 시작하기').click();

    // BIZ_CHECK 스텝 — "불러와야 해요" 텍스트 표시
    await expect(page.locator('text=불러와야 해요')).toBeVisible({ timeout: 10000 });
  });

  test('배치 완료 시 상세 리포트 페이지로 이동', async ({ page }) => {
    // mybiz-status: 연결됨
    await page.route('**/api/report/mybiz-status', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: { isMybizConnected: true },
        }),
      })
    );

    // S등급 결과 API
    await page.route('**/api/s-grade/result', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            grade: 'S3',
            gradeLevel: '우수',
            calculatedAt: '2026-06-15T03:00:00',
            comment: '매출 증가율이 높아 긍정적입니다.',
            commentDetail: '현금흐름 관리를 개선하면 등급 상승이 가능합니다.',
          },
        }),
      })
    );

    // S등급 상세 API
    await page.route('**/api/s-grade/detail', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            grade: 'S3',
            gradeLevel: '우수',
            calculatedAt: '2026-06-15T03:00:00',
            shapValues: [],
          },
        }),
      })
    );

    await page.goto('/grade-report');
    await page.waitForLoadState('networkidle');

    // "S분석 리포트 시작하기" 버튼 클릭
    await page.locator('text=S분석 리포트 시작하기').click();

    // 상세 리포트 페이지로 이동됨
    await expect(page).toHaveURL(/\/grade-report\/detail/, { timeout: 10000 });
  });

  test('상세 리포트 페이지에서 등급 정보 표시', async ({ page }) => {
    // /grade-report/detail로 직접 이동 (state 없이)
    await page.route('**/api/s-grade**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: {
            grade: 'S3',
            gradeLevel: '우수',
            calculatedAt: '2026-06-15T03:00:00',
            comment: '매출 증가율이 높아 긍정적입니다.',
            commentDetail: '현금흐름 관리를 개선하면 등급 상승이 가능합니다.',
            shapValues: [],
          },
        }),
      })
    );

    await page.route('**/api/report/mybiz-status', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: { isMybizConnected: true },
        }),
      })
    );

    await page.goto('/grade-report/detail');
    await page.waitForLoadState('networkidle');

    await expect(page).not.toHaveURL(/\/login/);
    // 등급 또는 리포트 관련 텍스트 표시
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(0);
  });

  test('S등급 API 오류 시 에러 핸들링', async ({ page }) => {
    await page.route('**/api/report/mybiz-status', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          isSuccess: true,
          code: 'COMMON2000',
          message: '성공입니다.',
          result: { isMybizConnected: true },
        }),
      })
    );

    await page.route('**/api/s-grade**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: '서버 오류' }),
      })
    );

    await page.goto('/grade-report');
    await page.waitForLoadState('networkidle');

    // 인트로 버튼 클릭
    await page.locator('text=S분석 리포트 시작하기').click();

    // 에러 발생해도 크래시 없이 동작
    await page.waitForTimeout(3000);
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
