import { test as setup } from '@playwright/test';
import { env } from '@config/env.config';
import { DashboardPage } from '@pages/DashboardPage';
import { LoginPage } from '@pages/LoginPage';

setup('log in as admin and save the session', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.loginAsAdmin();
  await new DashboardPage(page).expectLoaded();
  await page.context().storageState({ path: env.authFile });
});
