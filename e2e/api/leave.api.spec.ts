import { test, expect } from '@fixtures/test.fixture';

test.describe('API - Leave', () => {
  test('lists leave types', { tag: '@smoke' }, async ({ leaveApi }) => {
    const res = await leaveApi.listLeaveTypes();
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('name');
  });

  test('lists leave periods', async ({ leaveApi }) => {
    const res = await leaveApi.listLeavePeriods();
    expect(res).toHaveProperty('data');
  });
});
