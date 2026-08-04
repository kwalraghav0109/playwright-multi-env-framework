const { BasePage } = require('./BasePage');

class InventoryPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('.product_sort_container');
  }

  async addItemToCartByName(itemName) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async getCartCount() {
    const isVisible = await this.cartBadge.isVisible();
    return isVisible ? Number(await this.cartBadge.textContent()) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(optionLabel) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async getAllItemNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getAllItemPrices() {
    const priceTexts = await this.page.locator('.inventory_item_price').allTextContents();
    return priceTexts.map((p) => parseFloat(p.replace('$', '')));
  }
}

module.exports = { InventoryPage };
