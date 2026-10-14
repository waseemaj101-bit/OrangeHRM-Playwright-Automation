import { expect, Locator, Page } from '@playwright/test';
import { api, routes } from '@config/routes';
import { CandidateData } from '@utils/dataFactory';
import { BasePage } from './BasePage';

export class RecruitmentPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
  }

  async openCandidates(): Promise<void> {
    await this.goto(routes.candidates);
  }

  async addCandidate(data: CandidateData): Promise<void> {
    await this.goto(routes.addCandidate);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.fillField('Email', data.email);
    await this.fillField('Contact Number', data.phone);
    await this.button('Save').click();
    await this.toast.expectMessage('Successfully Saved');
  }

  async searchCandidate(fullName: string): Promise<void> {
    await this.openCandidates();
    await this.pickAutocomplete('Candidate Name', fullName);
    await this.search(api.candidates);
  }

  async deleteCandidate(fullName: string): Promise<void> {
    await this.searchCandidate(fullName);
    await this.table.deleteRow(fullName);
    await this.toast.expectMessage('Successfully Deleted');
  }

  /** Clean-up helper: removes the candidate if it is still there. */
  async deleteCandidateIfExists(fullName: string): Promise<void> {
    await this.openCandidates();
    await this.fillField('Candidate Name', fullName);
    const option = this.page
      .getByRole('option')
      .filter({ hasText: fullName })
      .first();
    if (await option.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await option.click();
      await this.search(api.candidates);
      if (await this.table.hasRow(fullName)) {
        await this.table.deleteRow(fullName);
      }
    }
  }

  async expectCandidateListed(fullName: string): Promise<void> {
    await expect(this.table.rowWith(fullName).first()).toBeVisible();
  }

  async expectCandidateGone(fullName: string): Promise<void> {
    await expect(this.table.rowWith(fullName)).toHaveCount(0);
  }
}
