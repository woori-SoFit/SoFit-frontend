import { type Page } from '@playwright/test';

/**
 * 인증된 사용자 상태를 Mock하는 헬퍼
 * /api/users/me API를 Mock하여 로그인된 상태로 만듦
 */
export async function mockAuthenticatedUser(page: Page) {
  await page.route('**/api/users/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        isSuccess: true,
        code: 'USER2001',
        message: '성공입니다.',
        result: {
          userId: 1,
          loginId: 'testuser1',
          name: '김소핏',
          phone: '010-1234-5678',
          role: 'USER',
          businessNumber: '123-45-67890',
          bizDataConnected: true,
        },
      }),
    })
  );
}
