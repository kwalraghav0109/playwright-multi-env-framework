/**
 * Environment configuration loader.
 *
 * Test environment is selected via the TEST_ENV variable (defaults to "qa").
 * Each environment file under config/environments/ defines the base URL,
 * default timeout, and any environment-specific test data.
 *
 * Usage:
 *   TEST_ENV=staging npx playwright test
 *
 * Note: all three environment files point to the same public demo site
 * (saucedemo.com) since this is a portfolio project without a real multi-stage
 * deployment behind it. In a production setup, each file would point to its
 * own actual environment (e.g. qa.internal-app.com, staging.internal-app.com).
 * The loader/config pattern itself is what's meant to be demonstrated here.
 */

const fs = require('fs');
const path = require('path');

function loadEnvironmentConfig() {
  const envName = process.env.TEST_ENV || 'qa';
  const configPath = path.join(__dirname, 'environments', `${envName}.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No environment config found for "${envName}". Expected file at ${configPath}. ` +
      `Available environments: qa, staging, prod.`
    );
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return { envName, ...config };
}

module.exports = { loadEnvironmentConfig };
