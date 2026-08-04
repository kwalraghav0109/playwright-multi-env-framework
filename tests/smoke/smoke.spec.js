const { test, expect } = require('@playwright/test');
const { loadEnvironmentConfig } = require('../../config/environmentLoader');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

/**
 * Smoke suite — the minimum set of checks that must pass before
 * a build is considered safe to move forward. Kept deliberately small
 * and fast so it can run on every commit, not just on a schedule.
 */
test.describe('Smoke @smoke', () => {
  const env = loadEnvironmentConfig();

  test('application loads and login page renders', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('a user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(env.testUser.username, env.testUser.password);
    await loginPage.waitForUrl('/inventory.html');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('product inventory is visible after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login(env.testUser.username, env.testUser.password);
    const items = await inventoryPage.getAllItemNames();
    expect(items.length).toBeGreaterThan(0);
  });
});
