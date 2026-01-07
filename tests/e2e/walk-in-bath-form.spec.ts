import { test, expect } from '@fixtures';

import { testData, zipCodeTestCases, emailTestCases, phoneTestCases, nameTestCases } from '@data/test-data';

test.describe('Walk-In Bath Form - Critical Tests', () => {

  /**
   * Test 1: Complete multi-step form submission flow with valid data
   * Requirements: All fields required, ZIP (5 digits), Email (valid format), Phone (10 digits), Redirect to Thank you page
   */
  test('should complete full form submission flow with valid data and redirect to Thank you page', async ({
    formPage,
  }) => {

    await formPage.enterZipCode(testData.valid.zipCode);
    await formPage.clickNext();

    await formPage.selectAllInterests();
    await formPage.verifyInterestsSelected();
    await formPage.clickNext();

    await formPage.verifyPropertyTypeOptionsEnabled();
    await formPage.selectMobileHome();
    await formPage.verifyMobileHomeSelected();
    await formPage.clickNext();

    await formPage.enterContactInfo(testData.valid.name, testData.valid.email);
    await formPage.clickGoToEstimate();

    await formPage.enterPhoneNumber(testData.valid.phone);
    await formPage.verifyPhoneFormatted();
    await formPage.submitForm();

    await formPage.verifyRedirectToThankYouPage();
  });

  /**
   * Test 2: Validate ZIP code contains exactly 5 digits (Equivalence Partitioning)
   * Requirements: ZIP code must be exactly 5 digits
   * Test cases: Valid (5 digits), Too short (< 5 digits), Too long (> 5 digits)
   */
  for (const testCase of zipCodeTestCases) {
    test(`should validate ZIP code - ${testCase.description}`, async ({ formPage }) => {

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
    test.fixme(`should validate email format - ${testCase.description}`, async ({ formPage }) => {

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

  /**
   * Test 4: Validate phone number contains exactly 10 digits (Equivalence Partitioning)
   * Requirements: Phone number must be exactly 10 digits
   * Test cases: Valid (10 digits), Too short (9 digits)
   * Note: "Too long" case is not testable - phone input automatically truncates to 10 digits
   */
  for (const testCase of phoneTestCases) {
    test(`should validate phone number - ${testCase.description}`, async ({ formPage }) => {

      await formPage.navigateToPhoneStep();
      await formPage.enterPhoneNumber(testCase.phone);
      await formPage.submitForm();

      if (testCase.shouldProceed) {
        await formPage.expectPhoneSuccess();
      } else {
        await formPage.expectPhoneFailure(testCase.phone);
      }
    });
  }

  /**
   * Test 5: Validate interest checkboxes - at least one must be selected
   * Requirements: At least one interest checkbox must be selected (business requirement)
   * Expected: Form should block progression to next step if no checkbox is selected
   * 
   * NOTE: This test is marked with test.fixme() because it detects a bug:
   * - Form allows progression without selecting any checkbox (should block progression)
   * - Test will be enabled once the bug is fixed
   * - Bug is documented in DEFECTS.md
   */
  test.fixme('should block progression when no interest checkbox is selected', async ({ formPage }) => {

    await formPage.enterZipCode(testData.valid.zipCode);
    await formPage.clickNext();
    await formPage.verifyInterestStep();
    await formPage.clickNext();
    await formPage.expectFormStaysOnInterestStep();
  });

  /**
   * Test 6: Validate name field - required and format validation
   * Requirements: All text fields are mandatory, name should consist only of latin letters, apostrophes, underscores, dots and dashes
   * Test cases: Empty, First name only, Full name, With numbers, With invalid special characters
   */
  for (const testCase of nameTestCases) {
    test(`should validate name field - ${testCase.description}`, async ({ formPage }) => {

      await formPage.navigateToContactInfoStep();
      await formPage.enterContactInfo(testCase.name, testData.valid.email);
      await formPage.clickGoToEstimate();

      if (testCase.shouldProceed) {
        await formPage.expectNameSuccess();
      } else {
        if (testCase.errorType === 'required') {
          await formPage.expectFormStaysOnContactInfoStepWithNameError();
        } else if (testCase.errorType === 'fullName') {
          await formPage.expectFormStaysOnContactInfoStepWithNameFullNameError();
        } else {
          await formPage.expectFormStaysOnContactInfoStepWithNameFormatError();
        }
      }
    });
  }

  /**
   * Test 7: Validate property type radio button is required
   * Requirements: All fields are required (property type must be selected)
   * Expected: Form should block progression to next step if no property type radio button is selected
   */
  test('should block progression when no property type radio button is selected', async ({ formPage }) => {

    await formPage.navigateToPropertyTypeStep();
    await formPage.verifyPropertyTypeStep();
    await formPage.clickNext();
    await formPage.expectFormStaysOnPropertyTypeStep();
  });
});
