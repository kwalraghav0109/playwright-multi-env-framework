const { loadEnvironmentConfig } = require('./config/environmentLoader');

/**
 * Global setup runs once before the entire test run starts.
 * It resolves the active environment config and logs which
 * environment/config the run is using — useful for CI logs when
 * debugging "why did this pass locally but fail in staging".
 */
module.exports = async function globalSetup() {
  const config = loadEnvironmentConfig();
  console.log(`\n[global-setup] Running against environment: ${config.envName}`);
  console.log(`[global-setup] Base URL: ${config.baseURL}`);
  console.log(`[global-setup] Default timeout: ${config.defaultTimeout}ms\n`);
};
