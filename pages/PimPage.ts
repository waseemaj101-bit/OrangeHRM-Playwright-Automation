import { expect, Locator, Page } from '@playwright/test';
import { api, routes } from '@config/routes';
import { EmployeeData } from '@utils/dataFactory';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
  }

  async openList(): Promise<void> {
    await this.goto(routes.pimList);
  }

  async openAddEmployee(): Promise<void> {
    await this.goto(routes.addEmployee);
  }

  async saveForm(): Promise<void> {
    await this.button('Save').first().click();
  }

  /** Adds an employee through the UI using the dynamic data (including employee id). */
  async addEmployee(data: EmployeeData): Promise<void> {
    await this.openAddEmployee();
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);

    const idInput = this.field('Employee Id').locator('input');
    await idInput.fill(data.employeeId);
    await expect(idInput).toHaveValue(data.employeeId);

    await this.saveForm();
    await this.toast.expectMessage('Successfully Saved');
    await expect(this.page).toHaveURL(/viewPersonalDetails/);
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.openList();
    await this.fillField('Employee Id', employeeId);
    await this.search(api.employees);
  }

  async updateLastName(employeeId: string, newLastName: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    await this.table.editRow(employeeId);
    await expect(this.page).toHaveURL(/viewPersonalDetails/);
    await expect(this.lastNameInput).not.toHaveValue(''); // wait for form data to load
    await this.lastNameInput.fill(newLastName);
    await this.saveForm();
    await this.toast.expectMessage('Successfully Updated');
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    await this.table.deleteRow(employeeId);
    await this.toast.expectMessage('Successfully Deleted');
  }

  /** Clean-up helper: removes the employee if it is still there. */
  async deleteEmployeeIfExists(employeeId: string): Promise<void> {
    await this.searchByEmployeeId(employeeId);
    if (await this.table.hasRow(employeeId)) {
      await this.table.deleteRow(employeeId);
    }
  }

  async expectEmployeeListed(employeeId: string): Promise<void> {
    await expect(this.table.rowWith(employeeId)).toHaveCount(1);
  }

  async expectNoRecords(): Promise<void> {
    await expect(this.table.noRecords).toBeVisible();
  }
}
