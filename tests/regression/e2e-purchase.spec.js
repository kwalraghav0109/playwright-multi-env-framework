const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { InventoryPage } = require('../../pages/InventoryPage');
const { CartPage } = require('../../pages/CartPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');

test.describe('End-to-end purchase flow', () => {
  test('a user can log in, add items, checkout, and complete an order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Log in as a standard user', async () => {
      await loginPage.open();
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await test.step('Add two items to the cart', async () => {
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Fleece Jacket');
      expect(await inventoryPage.getCartCount()).toBe(2);
    });

    await test.step('Go to cart and verify items', async () => {
      await inventoryPage.goToCart();
      expect(await cartPage.getItemCount()).toBe(2);
    });

    await test.step('Complete checkout', async () => {
      await cartPage.proceedToCheckout();
      await checkoutPage.fillShippingInfo('Raghav', 'Khandelwal', '110001');
      await checkoutPage.finishOrder();
      const confirmation = await checkoutPage.getConfirmationText();
      expect(confirmation).toContain('Thank you for your order');
    });
  });
});
