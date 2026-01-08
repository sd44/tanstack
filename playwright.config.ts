import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */

// const baseURL = process.env.BASE_URL;
const baseURL = 'http://localhost:3000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  workers: 1,

  reporter: [['line']],

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
  },

  webServer: {
    // command: `bun run build && VITE_SERVER_PORT=${PORT} PORT=${PORT} bun start`,
    command: 'bun dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
  },
  //
  projects: [
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
