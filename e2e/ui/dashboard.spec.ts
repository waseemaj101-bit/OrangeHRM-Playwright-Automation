import { test, expect } from '@fixtures/test.fixture';
import dashboardData from '@data/dashboard.data.json';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.open();
  });

  test('loads the dashboard', { tag: '@smoke' }, async ({ dashboardPage }) => {
    await dashboardPage.expectLoaded();
  });

  for (const title of dashboardData.widgets) {
    test(`shows the "${title}" widget`, async ({ dashboardPage }) => {
      await expect(dashboardPage.widget(title)).toBeVisible();
    });
  }

  for (const menu of dashboardData.menus) {
    test(`opens ${menu.name} from the side menu`, async ({ dashboardPage, page }) => {
      await dashboardPage.menu.open(menu.name);
      await expect(page).toHaveURL(new RegExp(menu.path));
    });
  }
});
