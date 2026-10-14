import { expect, Page } from '@playwright/test';

export class Toast {
  constructor(private readonly page: Page) {}

  async expectMessage(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: true }).first()).toBeVisible();
  }
}
