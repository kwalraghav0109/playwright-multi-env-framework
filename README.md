# Playwright Multi-Environment Test Framework

An extension of a standard Page Object Model framework, built to demonstrate how I structure automation for real CI/CD pipelines: environment-based configuration, parallel execution, multi-format reporting, and a smoke/regression gating strategy.

## Why this project exists

A single flat test suite works fine for a demo. It doesn't reflect how automation actually runs in a company with a QA → Staging → Prod pipeline, where the same suite needs to run against different environments, on a schedule, with fast feedback for critical paths and deeper coverage for everything else. This project is structured around that reality.

## What's demonstrated here

### 1. Multi-environment configuration
Environment is selected via a `TEST_ENV` variable, resolved by `config/environmentLoader.js` against JSON files in `config/environments/` (`qa.json`, `staging.json`, `prod.json`). Each environment can define its own base URL, timeout, retry policy, and test data — without touching test code.

```bash
TEST_ENV=staging npx playwright test
# or
npm run test:staging
```

> Note: all three environment configs currently point at the same public demo site ([saucedemo.com](https://www.saucedemo.com)), since this is a portfolio project without a real multi-stage deployment behind it. The loader pattern is what's meant to be shown — in a production setup, each JSON file would point to its own actual environment URL and credentials.

### 2. Parallel execution
`fullyParallel: true` in `playwright.config.js`, with worker count auto-detected locally and capped at 4 in CI. Tests are also split by `project` (smoke vs. regression, and per-browser), which lets CI run them as independent parallel jobs rather than one long sequential run.

### 3. Smoke vs. regression gating
- **`tests/smoke/`** — a small, fast set of critical-path checks (can the app load, can a user log in, does inventory render). Designed to run on every commit in under a minute and catch a broken build immediately.
- **`tests/regression/`** — the fuller suite (login edge cases, cart/sorting logic, full purchase flow), gated to only run after smoke passes, so CI doesn't burn 15 minutes of matrix runs on a build that's already broken.

### 4. Multi-format reporting
Three reporters run on every execution:
- **HTML** — visual report with screenshots/video on failure, for local debugging
- **JUnit XML** — standard format most CI dashboards and test-management tools can ingest directly
- **Custom summary reporter** (`reporters/summaryReporter.js`) — writes a compact `summary.json` (pass/fail/flaky counts, duration, slowest tests) designed for feeding into a Slack notification or CI status badge without parsing the full report

### 5. CI/CD integration
`.github/workflows/test-pipeline.yml` runs:
- Smoke suite first, as a fast gate
- Regression suite as a 3-way matrix (Chromium/Firefox/WebKit) that only runs if smoke passes
- Supports manual trigger via `workflow_dispatch` with an environment picker (qa/staging/prod)
- Uploads HTML report and JUnit results as CI artifacts for every browser

## Project structure

```
playwright-multi-env-framework/
├── config/
│   ├── environmentLoader.js     # Resolves active environment config
│   └── environments/
│       ├── qa.json
│       ├── staging.json
│       └── prod.json
├── pages/                       # Page Object Model classes
├── reporters/
│   └── summaryReporter.js       # Custom pass/fail/flaky summary reporter
├── tests/
│   ├── smoke/                   # Fast critical-path gate
│   └── regression/              # Full functional coverage
├── global-setup.js              # Logs active environment before the run starts
├── playwright.config.js
└── .github/workflows/test-pipeline.yml
```

## Running it locally

```bash
npm install
npx playwright install

npm run test:smoke        # fast critical-path checks
npm run test:regression   # full suite, all browsers
npm run test:staging      # run against the "staging" environment config
```

View reports:
```bash
npm run report                      # HTML report
cat playwright-report/summary.json  # custom summary
```

---

**About me:** I'm a QA Lead and Test Automation Engineer with 3+ years of experience integrating automation into CI/CD pipelines (Jenkins, GitLab CI/CD, Azure DevOps), cutting developer feedback time by 60% in production. This project reflects the same environment-config, parallel-execution, and reporting patterns I've used at scale.
