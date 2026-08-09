/**
 * Custom summary reporter.
 *
 * Playwright's built-in reporters (html, list, json) are good, but for CI
 * dashboards and Slack notifications it's often useful to have a compact,
 * structured summary of a run — pass/fail counts, duration, and slowest
 * tests — without parsing the full JSON report.
 *
 * This reporter writes summary.json to the report output directory and
 * prints a readable summary to the console at the end of a run.
 */
class SummaryReporter {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  onTestEnd(test, result) {
    this.results.push({
      title: test.titlePath().join(' > '),
      status: result.status,
      duration: result.duration,
      retry: result.retry,
    });
  }

  onEnd(result) {
    const durationMs = Date.now() - this.startTime;
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed').length;
    const skipped = this.results.filter((r) => r.status === 'skipped').length;
    const flaky = this.results.filter((r) => r.status === 'passed' && r.retry > 0).length;

    const slowest = [...this.results]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);

    const summary = {
      environment: process.env.TEST_ENV || 'qa',
      overallStatus: result.status,
      totals: { passed, failed, skipped, flaky, total: this.results.length },
      durationMs,
      slowestTests: slowest,
    };

    const fs = require('fs');
    const path = require('path');
    const outputDir = 'playwright-report';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(
      path.join(outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('\n----------------------------------------');
    console.log(` Test Run Summary [env: ${summary.environment}]`);
    console.log('----------------------------------------');
    console.log(` Passed:  ${passed}`);
    console.log(` Failed:  ${failed}`);
    console.log(` Skipped: ${skipped}`);
    console.log(` Flaky:   ${flaky}`);
    console.log(` Duration: ${(durationMs / 1000).toFixed(1)}s`);
    console.log('----------------------------------------\n');
  }
}

module.exports = SummaryReporter;
