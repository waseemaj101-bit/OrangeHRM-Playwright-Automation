import { expect, Locator, Page } from '@playwright/test';
import { routes } from '@config/routes';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly userDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.userDropdown = page.getByAltText('profile picture').first();
  }

  async open(): Promise<void> {
    await this.goto(routes.dashboard);
  }

  widget(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard\/index/);
    await this.expectHeading('Dashboard');
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
  }
}
