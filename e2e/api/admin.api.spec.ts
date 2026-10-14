import { test, expect } from '@fixtures/test.fixture';
import adminData from '@data/admin.data.json';
import { buildJobTitle, buildSystemUser } from '@utils/dataFactory';

test.describe('API - Admin', () => {
  for (const username of adminData.existingUsers) {
    test(`finds the existing user "${username}"`, { tag: '@smoke' }, async ({ adminApi }) => {
      const users = await adminApi.searchUsers(username);
      expect(users.map((u) => u.userName)).toContain(username);
    });
  }

  test('creates and deletes a system user', async ({ adminApi, employee }) => {
    const user = buildSystemUser(employee.fullName);
    const created = await adminApi.createUser({
      username: user.username,
      password: user.password,
      empNumber: employee.empNumber!,
      userRoleId: adminData.roleIds.ess,
    });
    try {
      const found = await adminApi.searchUsers(user.username);
      expect(found.map((u) => u.id)).toContain(created.id);
    } finally {
      await adminApi.deleteUserIfExists(created.id);
    }
    expect(await adminApi.searchUsers(user.username)).toHaveLength(0);
  });

  test('creates, reads and deletes a job title', async ({ adminApi }) => {
    const input = buildJobTitle();
    const created = await adminApi.createJobTitle(input);
    try {
      const fetched = await adminApi.getJobTitle(created.id);
      expect(fetched.title).toBe(input.title);
      const all = await adminApi.listJobTitles();
      expect(all.data.map((j) => j.id)).toContain(created.id);
    } finally {
      await adminApi.deleteJobTitleIfExists(created.id);
    }
  });
});
