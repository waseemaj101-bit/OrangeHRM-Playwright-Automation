import { expect } from '@playwright/test';
import { routes } from '@config/routes';
import { BasePage } from './BasePage';

export interface AssignLeaveInput {
  employeeName: string;
  leaveType: string;
  from: Date;
  to: Date;
}

export class LeavePage extends BasePage {
  async openLeaveList(): Promise<void> {
    await this.goto(routes.leaveList);
  }

  async expectFilterVisible(label: string): Promise<void> {
    await expect(this.field(label)).toBeVisible();
  }

  /** Adds an entitlement for one employee and returns the leave type used. */
  async addEntitlement(employeeName: string, days: string): Promise<string> {
    await this.goto(routes.addEntitlement);
    await this.pickAutocomplete('Employee Name', employeeName);
    const leaveType = await this.selectOption('Leave Type');
    await this.fillField('Entitlement', days);
    await this.button('Save').click();
    await this.button('Confirm').click();
    await this.toast.expectMessage('Successfully Saved');
    return leaveType;
  }

  async assignLeave(input: AssignLeaveInput): Promise<void> {
    await this.goto(routes.assignLeave);
    await this.pickAutocomplete('Employee Name', input.employeeName);
    await this.selectOption('Leave Type', input.leaveType);
    await this.fillDate('From Date', input.from);
    await this.fillDate('To Date', input.to);
    await this.button('Assign').click();
    await this.toast.expectMessage('Successfully Saved');
  }
}
