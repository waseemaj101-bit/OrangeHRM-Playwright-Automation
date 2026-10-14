import { Locator, Page } from '@playwright/test';

/** Wraps the records table used on every OrangeHRM list page. */
export class DataTable {
  readonly rows: Locator;
  readonly noRecords: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.getByRole('row');
    this.noRecords = page.getByText('No Records Found').first();
  }

  rowWith(text: string | RegExp): Locator {
    return this.rows.filter({ hasText: text });
  }

  /** Waits until the table shows the row or "No Records Found", then reports which. */
  async hasRow(text: string | RegExp): Promise<boolean> {
    await this.rowWith(text).first().or(this.noRecords).waitFor();
    return (await this.rowWith(text).count()) > 0;
  }

  // The row action icons have no text or aria-label, so the icon class is the only handle.
  async editRow(text: string | RegExp): Promise<void> {
    await this.rowWith(text)
      .first()
      .getByRole('button')
      .filter({ has: this.page.locator('.bi-pencil-fill') })
      .click();
  }

  async deleteRow(text: string | RegExp): Promise<void> {
    await this.rowWith(text)
      .first()
      .getByRole('button')
      .filter({ has: this.page.locator('.bi-trash') })
      .click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
  }
}
