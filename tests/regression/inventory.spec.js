const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');

test.describe('Inventory', () => {
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
  });

  test('adds a single item to the cart and updates the cart badge', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('adds multiple items to the cart', async () => {
    await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
    await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(2);
  });

  test('sorts products by price low to high correctly', async () => {
    await inventoryPage.sortBy('Price (low to high)');
    const prices = await inventoryPage.getAllItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorts products by name Z to A correctly', async () => {
    await inventoryPage.sortBy('Name (Z to A)');
    const names = await inventoryPage.getAllItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });
});
