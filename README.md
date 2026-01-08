# 🎭 Playwright Automation Suite

[![Playwright Tests](https://github.com/MaciejKielb/HomeAssessment/actions/workflows/playwright.yml/badge.svg?branch=main&event=push)](https://github.com/MaciejKielb/HomeAssessment/actions/workflows/playwright.yml)

This repository contains end-to-end (E2E) tests powered by [Playwright](https://playwright.dev).

> **⚠️ Important:** Test failures are **expected and intentional**. Tests were implemented according to the **requirements** (expected behavior), not the current (incorrect) behavior of the application. The tests are designed to fail until the defects in the application are fixed. This is a deliberate design choice to document and validate the correct expected behavior.

> **Note:** This project uses Yarn as the package manager. While npm works equally well, Yarn was chosen based on team preferences and familiarity from professional experience. Both package managers are fully supported and interchangeable.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) – [Download Node.js](https://nodejs.org)
- **npm** (comes with Node.js) or **Yarn** – [Install Yarn](https://classic.yarnpkg.com)

## 🚀 Local Setup

Follow these steps to get your local development environment running:

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <PROJECT_FOLDER_NAME>
    ```

2.  **Install dependencies and Playwright browsers:**

    **Using npm:**
    ```bash
    npm install
    npx playwright install --with-deps
    ```

    **Using yarn:**
    ```bash
    yarn install
    npx playwright install --with-deps
    ```

    > `--with-deps` ensures all system dependencies required by Playwright are installed.

3.  **Configure environment variables (optional):**

    Create a `.env` file in the root directory to override default configuration:
    
    ```bash
    # Create .env file with custom BASE_URL
    echo "BASE_URL=https://test-qa.capslock.global" > .env
    ```
    
    Available environment variables:
    - `BASE_URL` - Base URL for the application under test (default: `https://test-qa.capslock.global`)
    
    > If `.env` file is not present, tests will use default values from `playwright.config.ts`

## 🧪 Running Tests

> **Note:** Remember that test failures are expected and intentional. Tests validate the correct expected behavior according to requirements, not the current application state.

You can use the following commands to execute tests:

- **Run all tests (Headless mode):**
  ```bash
  npm test
  # or
  yarn test
  ```
- **Open Interactive UI Mode:**
  (Recommended for local development. Provides a live preview and time-travel debugging)
  ```bash
  npm run test:ui
  # or
  yarn test:ui
  ```
- **Debug Mode:**
  (Run tests step-by-step with the Playwright Inspector)
  ```bash
  npm run test:debug
  # or
  yarn test:debug
  ```
- **Show Last Test Report:**
  ```bash
  npm run test:report
  # or
  yarn test:report
  ```

### 🏷️ Running Tests by Tags

Tests are organized with tags to allow selective execution:

- **`@smoke`** - Critical smoke tests that verify core functionality
- **`@regression`** - Regression tests that ensure existing features work correctly
- **`@critical`** - Critical path tests that must pass before deployment
- **`@happy-path`** - Positive test scenarios that verify expected successful behavior
- **`@negative`** - Negative test scenarios that verify error handling and validation

**Examples:**

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Run regression tests
npx playwright test --grep @regression

# Run happy path tests (positive scenarios)
npx playwright test --grep @happy-path

# Run negative tests (error scenarios)
npx playwright test --grep @negative

# Run tests with multiple tags (OR logic)
npx playwright test --grep "@smoke|@critical"
```

## ⚙️ CI/CD & Caching

The Continuous Integration (CI) pipeline is configured to speed up builds by caching dependencies and Playwright browsers.

- Node/Yarn dependencies are cached via `actions/setup-node` using `yarn.lock`.
- Playwright browsers are cached based on the installed Playwright version, not on other package changes.
- **Important:** If you update Playwright to a new version, the CI will automatically fetch new browsers. For other package updates, make sure to commit the updated `yarn.lock` to keep Node/Yarn cache in sync.

### 🏷️ Using Tags in CI/CD

Test tags can be leveraged in CI/CD pipelines to optimize test execution:

**Recommended CI Strategy:**

1. **Fast Feedback (PR/Push)**
   ```yaml
   # Run only smoke tests for quick feedback
   npx playwright test --grep @smoke
   ```
   - Runs critical smoke tests (~1-2 minutes)
   - Provides fast feedback on core functionality
   - Suitable for every push and pull request

2. **Pre-Deployment (Before Production)**
   ```yaml
   # Run critical path tests
   npx playwright test --grep @critical
   ```
   - Runs all critical path tests
   - Ensures essential features work before deployment
   - Should pass before merging to main

3. **Full Regression (Nightly/Scheduled)**
   ```yaml
   # Run all tests including regression
   npx playwright test --grep @regression
   # or simply run all tests
   npx playwright test
   ```
   - Runs complete test suite
   - Catches edge cases and regression issues
   - Can be scheduled for nightly builds

**Benefits:**
- ⚡ **Faster CI feedback** - Smoke tests provide quick validation
- 💰 **Cost optimization** - Run expensive full suites only when needed
- 🎯 **Focused testing** - Run relevant tests based on changes
- 🔄 **Parallel execution** - Different test suites can run in parallel jobs

**Example CI Workflow:**
```yaml
# Fast smoke tests on every push
- name: Run smoke tests
  run: npx playwright test --grep @smoke

# Full regression on schedule or before release
- name: Run full regression
  if: github.event_name == 'schedule' || github.event_name == 'release'
  run: npx playwright test
```

## 💡 Pro Tip

If you are using **Visual Studio Code**, install the official [Playwright Test extension](marketplace.visualstudio.com). It allows you to run individual tests directly from your code editor using "Play" buttons.

Recommended for debugging and interactive runs, especially useful for new developers joining the project.

---

## 🐛 Defects Found

During test implementation and manual testing, several defects were discovered where the application behavior does not match the requirements. Automated tests were implemented according to the **requirements** (expected behavior), not the current (incorrect) behavior of the page.

### Defects Detected by Tests

1. **Email Validation** - Form accepts email addresses without TLD (Top Level Domain). For example, `user@domain` is accepted when it should require a valid format like `user@domain.com`. This allows invalid email addresses to pass validation.

2. **Interest Checkboxes** - Form allows proceeding to the next step without selecting any checkbox. At least one interest checkbox should be required before allowing form progression. Currently, users can click "Next" without making any selection, which violates the requirement that all fields are mandatory.

### Additional Defects Observed

1. **Duplicate Form on Page** - Form container appears twice on the page, requiring use of `#form-container-1` selector instead of `#form-container`. This is a critical bug that could cause confusion and data submission issues.

2. **Responsive Design Issues:**
   - **Mobile (≤575px width):** "Go to Estimate" button appears on the page, should not be displayed, and does not have any functionality
   - **Stats Show Bathroom Slips And Falls block section:** Quoted text overlaps with picture up to 767px width
   - **Bath Walls section block:** There are 12 pictures inside the block representing only colors (they repeat themselves). They are not interactive. The video should respond to clicks and change to show the wall in the selected color. Color label text is not formatting correctly up to 991px width

3. **Visual/UI Issues:**
   - Quote icon displays as asterisks (*) instead of proper quotation marks icon
   - Icon is oversized and misaligned, even on large resolutions

All defects are documented with their impact on user experience and functionality.

---

## 📝 Test Strategy & Improvements

### Why These Test Scenarios Were Selected

The test scenarios focus on **critical user journeys** and **form validation** because:

1. **Form Submission Flow** - This is the primary conversion path. Testing the complete flow ensures users can successfully submit their information, which is essential for business success.

2. **Field Validation** - Comprehensive validation testing (ZIP code, email, phone, name, checkboxes, radio buttons) ensures data quality and prevents invalid submissions from reaching the backend.

3. **Error Handling** - Testing both positive and negative scenarios helps identify UX issues and ensures users receive appropriate feedback when validation fails.

4. **Cross-browser Compatibility** - Running tests on Chromium, Firefox, and WebKit ensures the form works consistently across different browsers, which is crucial for user accessibility.

5. **UI Components** - Testing slider navigation and video playback ensures core interactive elements function correctly and provide a good user experience.

### Improvements for Scalability and Maintainability

To make the test project more scalable and maintainable, the following improvements could be implemented:

1. **Type Safety**
   - Add TypeScript interfaces for test data structures
   - Create enums for form field types (InterestType, PropertyType) instead of string literals
   - Define types for error messages and validation rules

2. **Code Organization**
   - ✅ **Already implemented:** Split large Page Object files into specialized modules (form-actions, form-assertions, form-navigation)
   - Create a `types/` folder for shared TypeScript types
   - Organize test data by feature area

3. **Test Data Management**
   - Implement factory methods for generating dynamic test data
   - Add data builders for complex test scenarios
   - Externalize test data to JSON/YAML files for easier maintenance

4. **Code Quality Tools**
   - Add ESLint and Prettier for consistent code formatting
   - Set up pre-commit hooks to enforce code quality
   - Add TypeScript strict mode checks

5. **Documentation**
   - Add JSDoc comments to all public methods
   - Create CONTRIBUTING.md with coding standards
   - Document test architecture and design patterns

6. **CI/CD Enhancements**
   - Add test result reporting (e.g., Allure reports)
   - Implement test retry strategies for flaky tests
   - Add parallel test execution optimization

7. **Test Maintenance**
   - Implement visual regression testing for UI components
   - Add API-level tests to complement E2E tests
   - Create test utilities for common operations

### Additional Valuable Improvements

1. **Performance Testing**
   - Add tests to measure page load times
   - Verify lazy loading of images and content
   - Test form submission response times

2. **Security Testing**
   - Test for XSS vulnerabilities in form inputs
   - Verify proper sanitization of user data
   - Test CSRF protection mechanisms

3. **Mobile Testing**
   - Add mobile viewport tests
   - Test touch interactions on mobile devices
   - Verify responsive design breakpoints

4. **Test Reporting**
   - Integrate with test management tools (TestRail, Zephyr)
   - Add detailed test execution reports with screenshots
   - Implement test coverage metrics

5. **Environment Management**
   - Add `.env.example` file for configuration reference
   - Support multiple test environments (dev, staging, prod)
   - Implement environment-specific test data

6. **Error Recovery**
   - Add tests for network failure scenarios
   - Test form recovery after browser refresh
   - Verify error logging and monitoring

7. **Accessibility Testing**
   - Add tests to verify all images have alt text
   - Test keyboard navigation throughout the form
   - Verify ARIA attributes are properly implemented
   - Test screen reader compatibility
   - Ensure form labels are properly associated with inputs
   - Verify color contrast meets WCAG standards
   - Add `@accessibility` tag for selective test execution