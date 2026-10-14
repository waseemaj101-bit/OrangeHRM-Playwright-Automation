import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env.config';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 1, // the demo site is shared, one retry absorbs rare hiccups
  workers: env.isCI ? 2 : 3,
  timeout: env.timeouts.test,
  expect: { timeout: env.timeouts.expect },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: env.baseURL,

    // OrangeHRM always opens in English
    locale: 'en-US',
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },

    // page.getByTestId('x') will match id="x"
    testIdAttribute: 'id',

    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Logs in once and saves the session for the other projects
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 2. Login spec runs in a clean browser (no saved session)
    {
      name: 'login',
      testMatch: '**/ui/login.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // 3. All other UI modules reuse the saved admin session
    {
      name: 'chromium',
      testMatch: '**/ui/*.spec.ts',
      testIgnore: '**/ui/login.spec.ts',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], storageState: env.authFile },
    },

    // 4. API tests (no browser needed, same saved session)
    {
      name: 'api',
      testMatch: '**/api/*.api.spec.ts',
      dependencies: ['setup'],
    },
  ],
});
