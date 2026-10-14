import { test } from '@fixtures/test.fixture';
import adminData from '@data/admin.data.json';
import { buildSystemUser } from '@utils/dataFactory';

test.describe('Admin - system users', () => {
  test('adds a system user for an employee', { tag: '@smoke' }, async ({ adminPage, employee }) => {
    const user = buildSystemUser(employee.fullName);
    await adminPage.addUser(user);
    try {
      await adminPage.searchUser(user.username);
      await adminPage.expectUserListed(user.username);
    } finally {
      await adminPage.deleteUserIfExists(user.username);
    }
  });

  test('shows required errors when the form is empty', async ({ adminPage }) => {
    await adminPage.openAddUser();
    await adminPage.saveForm();
    await adminPage.expectRequiredError();
  });

  for (const username of adminData.existingUsers) {
    test(`finds the existing user "${username}"`, async ({ adminPage }) => {
      await adminPage.searchUser(username);
      await adminPage.expectUserListed(username);
    });
  }

  test('deletes a system user', async ({ adminPage, employee }) => {
    const user = buildSystemUser(employee.fullName);
    await adminPage.addUser(user);
    await adminPage.deleteUser(user.username);
  });
});
