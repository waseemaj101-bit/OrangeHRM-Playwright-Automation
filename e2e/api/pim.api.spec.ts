import { test, expect } from '@fixtures/test.fixture';
import { buildEmployee, buildUnknownId } from '@utils/dataFactory';

test.describe('API - PIM employees', () => {
  test('lists employees', { tag: '@smoke' }, async ({ employeeApi }) => {
    const res = await employeeApi.list(5);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.meta?.total).toBeGreaterThan(0);
    expect(res.data[0]).toHaveProperty('empNumber');
  });

  test('creates an employee and reads it back', async ({ employeeApi }) => {
    const input = buildEmployee();
    const created = await employeeApi.create(input);
    try {
      expect(created.empNumber).toBeGreaterThan(0);
      const details = await employeeApi.getPersonalDetails(created.empNumber);
      expect(details.firstName).toBe(input.firstName);
      expect(details.lastName).toBe(input.lastName);
      expect(details.employeeId).toBe(input.employeeId);
    } finally {
      await employeeApi.deleteIfExists(created.empNumber);
    }
  });

  test('rejects an employee without a name', async ({ employeeApi }) => {
    const res = await employeeApi.createRaw({ firstName: '', lastName: '', middleName: '' });
    expect([400, 422]).toContain(res.status());
  });

  test('finds an employee by id', async ({ employeeApi, employee }) => {
    const found = await employeeApi.search(employee.employeeId);
    expect(found.map((e) => e.empNumber)).toContain(employee.empNumber);
  });

  test('returns nothing for an unknown id', async ({ employeeApi }) => {
    expect(await employeeApi.search(buildUnknownId())).toHaveLength(0);
  });

  test('updates the last name', async ({ employeeApi, employee }) => {
    const { lastName } = buildEmployee();
    await employeeApi.updateLastName({ ...employee, empNumber: employee.empNumber! }, lastName);
    const details = await employeeApi.getPersonalDetails(employee.empNumber!);
    expect(details.lastName).toBe(lastName);
  });

  test('deletes an employee', async ({ employeeApi, employee }) => {
    await employeeApi.delete(employee.empNumber!);
    expect(await employeeApi.search(employee.employeeId)).toHaveLength(0);
  });
});
