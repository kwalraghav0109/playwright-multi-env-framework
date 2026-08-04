// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { loadEnvironmentConfig } = require('./config/environmentLoader');

const env = loadEnvironmentConfig();

/**
 * Playwright config for the multi-environment, CI-integrated framework.
 *
 * Key features demonstrated here:
 * - Environment switching via TEST_ENV (config/environments/*.json)
 * - Parallel execution across workers, with CI-specific worker limits
 * - Multiple reporters: HTML (visual), JUnit (CI test-result integration), custom summary
 * - Project-based tagging so smoke vs regression suites can run independently
 */
module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),

  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined, // undefined = Playwright auto-detects local CPU cores
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? env.retries : 0,

  timeout: env.defaultTimeout,

  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['list'],
    [require.resolve('./reporters/summaryReporter.js')],
  ],

  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'smoke-chromium',
      testDir: './tests/smoke',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression-chromium',
      testDir: './tests/regression',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'regression-firefox',
      testDir: './tests/regression',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'regression-webkit',
      testDir: './tests/regression',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
