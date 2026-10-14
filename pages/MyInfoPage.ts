import { expect, Locator } from '@playwright/test';
import { routes } from '@config/routes';
import { escapeRegExp } from '@utils/helpers';
import { AddressData } from '@utils/dataFactory';
import { BasePage } from './BasePage';

export class MyInfoPage extends BasePage {
  private tab(name: string): Locator {
    return this.page
      .getByRole('link', { name, exact: true })
      .or(
        this.page
          .locator('.orangehrm-tabs-item') // fallback: tabs are plain anchors in some builds
          .filter({ hasText: new RegExp(`^${escapeRegExp(name)}$`) }),
      )
      .first();
  }

  async open(): Promise<void> {
    await this.goto(routes.myInfo);
    await expect(this.page).toHaveURL(/viewPersonalDetails/);
  }

  async openTab(name: string, urlPart: string): Promise<void> {
    await this.tab(name).click();
    await expect(this.page).toHaveURL(new RegExp(urlPart));
  }

  async updateAddress(address: AddressData): Promise<void> {
    await this.openTab('Contact Details', 'contactDetails');
    await this.fillField('Street 1', address.street);
    await this.fillField('City', address.city);
    await this.button('Save').first().click();
    await this.toast.expectMessage('Successfully Updated');
  }

  async expectAddress(address: AddressData): Promise<void> {
    await this.page.reload();
    await expect(this.field('Street 1').locator('input')).toHaveValue(address.street);
    await expect(this.field('City').locator('input')).toHaveValue(address.city);
  }
}
