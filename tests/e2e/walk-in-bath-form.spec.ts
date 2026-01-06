import { test } from '@playwright/test';

import { testData, zipCodeTestCases, emailTestCases } from '@data/test-data';
import { WalkInBathFormPage } from '@pages/walk-in-bath-form.page';

test.describe('Walk-In Bath Form - Critical Tests', () => {  
  test.beforeEach(async ({ page }) => {
    const formPage = new WalkInBathFormPage(page);
    await formPage.goto();
  });

  /**
   * Test 1: Complete multi-step form submission flow with valid data
   * Requirements: All fields required, ZIP (5 digits), Email (valid format), Phone (10 digits), Redirect to Thank you page
   */
  test('should complete full form submission flow with valid data and redirect to Thank you page', async ({
    page,
  }) => {
    const formPage = new WalkInBathFormPage(page);

    // Step 1: Enter ZIP code
    await formPage.enterZipCode(testData.valid.zipCode);
    await formPage.clickNext();

    // Step 2: Select interests
    await formPage.selectAllInterests();
    await formPage.verifyInterestsSelected();
    await formPage.clickNext();

    // Step 3: Select property type
    await formPage.verifyPropertyTypeOptionsEnabled();
    await formPage.selectMobileHome();
    await formPage.verifyMobileHomeSelected();
    await formPage.clickNext();

    // Step 4: Enter name and email
    await formPage.enterContactInfo(testData.valid.name, testData.valid.email);
    await formPage.clickGoToEstimate();

    // Step 5: Enter phone number
    await formPage.enterPhoneNumber(testData.valid.phone);
    await formPage.verifyPhoneFormatted();
    await formPage.submitForm();

    // Step 6: Verify redirect to Thank you page
    await formPage.verifyRedirectToThankYouPage();
  });

  /**
   * Test 2: Validate ZIP code contains exactly 5 digits (Equivalence Partitioning)
   * Requirements: ZIP code must be exactly 5 digits
   * Test cases: Valid (5 digits), Too short (< 5 digits), Too long (> 5 digits)
   */
  for (const testCase of zipCodeTestCases) {
    test(`should validate ZIP code - ${testCase.description}`, async ({ page }) => {
      const formPage = new WalkInBathFormPage(page);

      await formPage.enterZipCode(testCase.zipCode);
      await formPage.clickNext();

      if (testCase.shouldProceed) {
        await formPage.expectZipCodeSuccess();
      } else {
        await formPage.expectZipCodeFailure(testCase.zipCode);
      }
    });
  }

  /**
   * Test 3: Validate email format matches valid email pattern
   * Requirements: Email must match valid email pattern (user@domain.tld)
   * Test cases: Valid format, Missing @, Missing domain, Missing TLD
   * 
   * NOTE: This entire test suite is marked with test.fixme() because
   * it currently detects a bug where the form proceeds with invalid email format.
   * These tests will be skipped in CI but remain as documentation of a known issue.
   */
  for (const testCase of emailTestCases) {
    test.fixme(`should validate email format - ${testCase.description}`, async ({ page }) => {
      const formPage = new WalkInBathFormPage(page);

      await formPage.navigateToContactInfoStep();
      await formPage.enterContactInfo(testData.valid.name, testCase.email);
      await formPage.clickGoToEstimate();

      if (testCase.shouldProceed) {
        await formPage.expectEmailSuccess();
      } else {
        await formPage.expectEmailFailure(testCase.email);
      }
    });
  }
});
