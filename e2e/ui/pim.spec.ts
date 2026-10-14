import { test } from '@fixtures/test.fixture';
import { buildEmployee, buildUnknownId } from '@utils/dataFactory';

test.describe('PIM - employees', () => {
  test('adds a new employee', { tag: '@smoke' }, async ({ pimPage }) => {
    const data = buildEmployee();
    await pimPage.addEmployee(data);
    try {
      await pimPage.searchByEmployeeId(data.employeeId);
      await pimPage.expectEmployeeListed(data.employeeId);
    } finally {
      await pimPage.deleteEmployeeIfExists(data.employeeId);
    }
  });

  test('shows required errors when the name is empty', async ({ pimPage }) => {
    await pimPage.openAddEmployee();
    await pimPage.saveForm();
    await pimPage.expectRequiredErrors(2);
  });

  test('searches an employee by id', async ({ pimPage, employee }) => {
    await pimPage.searchByEmployeeId(employee.employeeId);
    await pimPage.expectEmployeeListed(employee.employeeId);
  });

  test('shows no records for an unknown id', async ({ pimPage }) => {
    await pimPage.searchByEmployeeId(buildUnknownId());
    await pimPage.expectNoRecords();
  });

  test('updates the last name of an employee', async ({ pimPage, employee }) => {
    const { lastName } = buildEmployee();
    await pimPage.updateLastName(employee.employeeId, lastName);
  });

  test('deletes an employee', async ({ pimPage, employee }) => {
    await pimPage.deleteEmployee(employee.employeeId);
    await pimPage.searchByEmployeeId(employee.employeeId);
    await pimPage.expectNoRecords();
  });
});
