import { test, expect } from '@fixtures/test.fixture';
import { env } from '@config/env.config';

test.describe('API - authentication', () => {
  test('rejects requests without a session', async ({ playwright }) => {
    const anonymous = await playwright.request.newContext({
      baseURL: env.baseURL,
      maxRedirects: 0,
    });
    const res = await anonymous.get('/web/index.php/api/v2/pim/employees');
    expect(res.ok()).toBeFalsy();
    expect([301, 302, 401, 403]).toContain(res.status());
    await anonymous.dispose();
  });

  test('accepts requests with the saved admin session', { tag: '@smoke' }, async ({ employeeApi }) => {
    const res = await employeeApi.list(1);
    expect(Array.isArray(res.data)).toBeTruthy();
  });
});
