import { test } from '@fixtures/test.fixture';
import { env } from '@config/env.config';
import loginData from '@data/login.data.json';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('logs in with valid credentials', { tag: '@smoke' }, async ({ loginPage, dashboardPage }) => {
    await loginPage.login(env.admin.username, env.admin.password);
    await dashboardPage.expectLoaded();
  });

  for (const invalid of loginData.invalidLogins) {
    test(`rejects ${invalid.name}`, async ({ loginPage }) => {
      await loginPage.login(invalid.username, invalid.password);
      await loginPage.expectError(loginData.invalidMessage);
    });
  }

  test('shows required errors when both fields are empty', async ({ loginPage }) => {
    await loginPage.submit();
    await loginPage.expectRequiredErrors(2);
  });

  test('opens the forgot password page', async ({ loginPage }) => {
    await loginPage.openForgotPassword();
    await loginPage.expectOnResetPage();
  });

  test('logs out and returns to the login page', async ({ loginPage, dashboardPage }) => {
    await loginPage.loginAsAdmin();
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await loginPage.expectOnLoginPage();
  });
});
