import dotenv from 'dotenv';

dotenv.config();

/** Central place for environment values and timeouts. Override via .env */
export const env = {
  baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  isCI: !!process.env.CI,
  authFile: 'playwright/.auth/admin.json',

  admin: {
    username: process.env.ADMIN_USER ?? 'Admin',
    password: process.env.ADMIN_PASS ?? 'admin123',
  },

  timeouts: {
    test: 60_000,
    expect: 10_000,
    action: 15_000,
    navigation: 30_000,
  },
};
