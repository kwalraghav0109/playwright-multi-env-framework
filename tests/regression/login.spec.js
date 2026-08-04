const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Login', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('logs in successfully with valid standard user credentials', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.waitForUrl('/inventory.html');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('shows an error for a locked-out user', async () => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    const error = await loginPage.getErrorText();
    expect(error).toContain('locked out');
  });

  test('shows an error when password is incorrect', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    const error = await loginPage.getErrorText();
    expect(error).toContain('do not match');
  });

  test('shows an error when username field is empty', async () => {
    await loginPage.login('', 'secret_sauce');
    const error = await loginPage.getErrorText();
    expect(error).toContain('Username is required');
  });
});
