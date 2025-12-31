# 🎭 Playwright Automation Suite

This repository contains end-to-end (E2E) tests powered by [Playwright](playwright.dev).

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) – [Download Node.js](nodejs.org)
- **Yarn** – [Install Yarn](classic.yarnpkg.com)

## 🚀 Local Setup

Follow these steps to get your local development environment running:

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <PROJECT_FOLDER_NAME>
    ```

2.  **Install dependencies and browsers:**

    ```bash
    yarn install
    ```

3.  **Download Playwright Browsers:**

    ```bash
    npx playwright install --with-deps
    ```

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

## ⚙️ CI/CD & Caching

The Continuous Integration (CI) pipeline is configured to cache dependencies for faster builds.

- The cache is linked to the `yarn.lock` file.
- **Important:** Whenever you add or update a package using `yarn add`, ensure you commit the updated `yarn.lock` file to keep the CI cache in sync.

## 💡 Pro Tip

If you are using **Visual Studio Code**, install the official [Playwright Test extension](marketplace.visualstudio.com). It allows you to run individual tests directly from your code editor using "Play" buttons.
