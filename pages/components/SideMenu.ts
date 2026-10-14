import { Locator, Page } from '@playwright/test';

export class SideMenu {
  constructor(private readonly page: Page) {}

  item(name: string): Locator {
    // the side panel comes first in the DOM, so .first() is always the menu link
    return this.page.getByRole('link', { name, exact: true }).first();
  }

  async open(name: string): Promise<void> {
    await this.item(name).click();
  }
}
