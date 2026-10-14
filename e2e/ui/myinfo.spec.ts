import { test } from '@fixtures/test.fixture';
import myInfoData from '@data/myinfo.data.json';
import { buildAddress } from '@utils/dataFactory';

test.describe('My Info', () => {
  test.beforeEach(async ({ myInfoPage }) => {
    await myInfoPage.open();
  });

  for (const tab of myInfoData.tabs) {
    test(`opens the ${tab.name} tab`, async ({ myInfoPage }) => {
      await myInfoPage.openTab(tab.name, tab.path);
    });
  }

  test('updates the contact address', { tag: '@smoke' }, async ({ myInfoPage }) => {
    const address = buildAddress();
    await myInfoPage.updateAddress(address);
    await myInfoPage.expectAddress(address);
  });
});
