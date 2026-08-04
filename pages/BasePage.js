/**
 * BasePage — shared functionality for all page objects.
 * Every page in the framework extends this class, so common
 * actions (navigation, waiting, generic assertions) live in one place.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }

  async waitForUrl(urlPart) {
    await this.page.waitForURL(`**${urlPart}**`);
  }
}

module.exports = { BasePage };
