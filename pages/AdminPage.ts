import { expect } from '@playwright/test';
import { api, routes } from '@config/routes';
import { SystemUserData } from '@utils/dataFactory';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  async openUsers(): Promise<void> {
    await this.goto(routes.users);
  }

  async openAddUser(): Promise<void> {
    await this.goto(routes.addUser);
  }

  async saveForm(): Promise<void> {
    await this.button('Save').click();
  }

  async addUser(user: SystemUserData): Promise<void> {
    await this.openAddUser();
    await this.selectOption('User Role', user.role);
    await this.pickAutocomplete('Employee Name', user.employeeName);
    await this.selectOption('Status', user.status);
    await this.fillField('Username', user.username);
    await this.fillField('Password', user.password);
    await this.fillField('Confirm Password', user.password);
    await this.saveForm();
    await this.toast.expectMessage('Successfully Saved');
  }

  async searchUser(username: string): Promise<void> {
    await this.openUsers();
    await this.fillField('Username', username);
    await this.search(api.users);
  }

  async deleteUser(username: string): Promise<void> {
    await this.searchUser(username);
    await this.table.deleteRow(username);
    await this.toast.expectMessage('Successfully Deleted');
  }

  async deleteUserIfExists(username: string): Promise<void> {
    await this.searchUser(username);
    if (await this.table.hasRow(username)) {
      await this.table.deleteRow(username);
    }
  }

  async expectUserListed(username: string): Promise<void> {
    await expect(this.table.rowWith(username).first()).toBeVisible();
  }
}
