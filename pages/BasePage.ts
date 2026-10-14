import { expect, Locator, Page } from '@playwright/test';
import { escapeRegExp, formatDate } from '@utils/helpers';
import { DataTable } from './components/DataTable';
import { SideMenu } from './components/SideMenu';
import { Toast } from './components/Toast';

/**
 * Shared behaviour for every page object: navigation, loaders and
 * helpers for the OrangeHRM form controls (inputs, dropdowns,
 * autocompletes, dates).
 */
export abstract class BasePage {
  readonly menu: SideMenu;
  readonly toast: Toast;
  readonly table: DataTable;
  readonly heading: Locator;
  readonly fieldErrors: Locator;
  private readonly spinner: Locator;

  constructor(protected readonly page: Page) {
    this.menu = new SideMenu(page);
    this.toast = new Toast(page);
    this.table = new DataTable(page);
    this.heading = page.getByRole('heading', { level: 6 }).first();
    this.fieldErrors = page.getByText('Required', { exact: true });
    this.spinner = page.locator('.oxd-loading-spinner'); // loaders have no role or text
  }

  // ---------- navigation ----------
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForLoader();
  }

  async waitForLoader(): Promise<void> {
    await this.spinner.first().waitFor({ state: 'hidden' });
  }

  async expectHeading(text: string): Promise<void> {
    await expect(this.heading).toContainText(text);
  }

  async expectRequiredError(): Promise<void> {
    await expect(this.fieldErrors.first()).toHaveText('Required');
  }

  async expectRequiredErrors(count: number): Promise<void> {
    await expect(this.fieldErrors).toHaveCount(count);
    await expect(this.fieldErrors.first()).toHaveText('Required');
  }

  // ---------- buttons ----------
  protected button(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  /** Clicks Search and waits for the list API to answer. */
  protected async search(apiPart: string): Promise<void> {
    const response = this.page.waitForResponse(
      (res) => res.url().includes(apiPart) && res.request().method() === 'GET',
    );
    await this.button('Search').click();
    await response;
    await this.waitForLoader();
  }

  // ---------- form helpers ----------
  /** The form group (label + control) that has the given label text. */
  protected field(label: string): Locator {
    return this.page.locator('.oxd-input-group').filter({
      has: this.page.getByText(label, { exact: true }),
    });
  }

  protected async fillField(label: string, value: string): Promise<void> {
    await this.field(label).locator('input, textarea').fill(value);
  }

  /** Picks a dropdown option. With no option given it picks the first real one. */
  protected async selectOption(label: string, option?: string): Promise<string> {
    await this.field(label).locator('.oxd-select-text').click();
    const options = this.page.getByRole('option');
    const target = option
      ? options.filter({ hasText: new RegExp(`^\\s*${escapeRegExp(option)}\\s*$`) })
      : options.filter({ hasNotText: '-- Select --' });
    const chosen = target.first();
    const text = (await chosen.innerText()).trim();
    await chosen.click();
    return text;
  }

  /** Types in an autocomplete field and clicks the matching suggestion. */
  protected async pickAutocomplete(label: string, text: string): Promise<void> {
    await this.field(label).locator('input').fill(text);
    await this.page.getByRole('option').filter({ hasText: text }).first().click();
  }

  /** Fills a date using the format shown in the input's placeholder. */
  protected async fillDate(label: string, date: Date): Promise<void> {
    const input = this.field(label).locator('input');
    const pattern = (await input.getAttribute('placeholder')) ?? 'yyyy-dd-mm';
    await input.fill(formatDate(date, pattern));
    await this.heading.click(); // close the calendar popup
  }
}
