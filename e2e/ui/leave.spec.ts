import { test } from '@fixtures/test.fixture';
import leaveData from '@data/leave.data.json';
import { workingDayThisYear } from '@utils/helpers';

test.describe('Leave', () => {
  test('opens the leave list with all filters', { tag: '@smoke' }, async ({ leavePage }) => {
    await leavePage.openLeaveList();
    await leavePage.expectHeading('Leave');
    for (const label of leaveData.filters) {
      await leavePage.expectFilterVisible(label);
    }
  });

  test('adds an entitlement and assigns leave to an employee', async ({ leavePage, employee }) => {
    const leaveType = await leavePage.addEntitlement(employee.fullName, leaveData.entitlementDays);
    const day = workingDayThisYear();
    await leavePage.assignLeave({
      employeeName: employee.fullName,
      leaveType,
      from: day,
      to: day,
    });
  });
});
