# 🎭 Playwright Automation Suite

[![Playwright Tests](https://github.com/MaciejKielb/HomeAssessment/actions/workflows/playwright.yml/badge.svg?branch=main&event=push)](https://github.com/MaciejKielb/HomeAssessment/actions/workflows/playwright.yml)

This repository contains end-to-end (E2E) tests powered by [Playwright](https://playwright.dev).

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) – [Download Node.js](https://nodejs.org)
- **Yarn** – [Install Yarn](https://classic.yarnpkg.com)

## 🚀 Local Setup

Follow these steps to get your local development environment running:

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <PROJECT_FOLDER_NAME>
    ```

2.  **Install dependencies and Playwright browsers:**

    ```bash
    yarn install
    npx playwright install --with-deps
    ```

    > `--with-deps` ensures all system dependencies required by Playwright are installed.

3.  **Configure environment variables (optional):**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` file to override default configuration:
    - `BASE_URL` - Base URL for the application under test (default: `https://test-qa.capslock.global`)
    
    > If `.env` file is not present, tests will use default values from `playwright.config.ts`

## 🧪 Running Tests

You can use the following commands to execute tests:

- **Run all tests (Headless mode):**
  ```bash
  yarn test
  ```
- **Open Interactive UI Mode:**
  (Recommended for local development. Provides a live preview and time-travel debugging)
  ```bash
  yarn test:ui
  ```
- **Debug Mode:**
  (Run tests step-by-step with the Playwright Inspector)
  ```bash
  yarn test:debug
  ```
- **Show Last Test Report:**
  ```bash
  yarn test:report
  ```

### 🏷️ Running Tests by Tags

Tests are organized with tags to allow selective execution:

- **`@smoke`** - Critical smoke tests that verify core functionality
- **`@regression`** - Regression tests that ensure existing features work correctly
- **`@critical`** - Critical path tests that must pass before deployment
- **`@accessibility`** - Accessibility tests (WCAG compliance)

**Examples:**

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Run regression tests
npx playwright test --grep @regression

# Run tests with multiple tags (OR logic)
npx playwright test --grep "@smoke|@critical"

# Exclude specific tags
npx playwright test --grep-invert @accessibility
```

## ⚙️ CI/CD & Caching

The Continuous Integration (CI) pipeline is configured to speed up builds by caching dependencies and Playwright browsers.

- Node/Yarn dependencies are cached via `actions/setup-node` using `yarn.lock`.
- Playwright browsers are cached based on the installed Playwright version, not on other package changes.
- **Important:** If you update Playwright to a new version, the CI will automatically fetch new browsers. For other package updates, make sure to commit the updated `yarn.lock` to keep Node/Yarn cache in sync.

## 💡 Pro Tip

If you are using **Visual Studio Code**, install the official [Playwright Test extension](marketplace.visualstudio.com). It allows you to run individual tests directly from your code editor using "Play" buttons.

Recommended for debugging and interactive runs, especially useful for new developers joining the project.
