import { Page, Locator, expect } from '@playwright/test';
import { verifyElementRemainsVisible } from '@helpers/wait-helpers';

/**
 * Form assertion methods - handles all verification and expectation logic
 */

export class FormAssertions {
  constructor(
    private page: Page,
    private zipInput: Locator,
    private independenceCheckbox: Locator,
    private safetyCheckbox: Locator,
    private therapyCheckbox: Locator,
    private otherCheckbox: Locator,
    private ownedHouseOption: Locator,
    private rentalPropertyOption: Locator,
    private mobileHomeOption: Locator,
    private nameInput: Locator,
    private emailInput: Locator,
    private phoneInput: Locator,
    private zipCodeError: Locator,
    private phoneError: Locator,
    private missingNameError: Locator,
    private nameFormatError: Locator,
    private nameFullNameError: Locator,
    private propertyTypeError: Locator,
    private thankYouPageUrl: RegExp,
  ) {}

  /**
   * Verify that we're on interest step
   * Checks that all interest checkboxes are visible
   */
  async verifyInterestStep(): Promise<void> {
    await expect(this.independenceCheckbox).toBeVisible();
    await expect(this.safetyCheckbox).toBeVisible();
    await expect(this.therapyCheckbox).toBeVisible();
    await expect(this.otherCheckbox).toBeVisible();
  }

  /**
   * Verify that all interest checkboxes are selected
   */
  async verifyInterestsSelected(): Promise<void> {
    await expect(this.independenceCheckbox).toBeChecked();
    await expect(this.safetyCheckbox).toBeChecked();
    await expect(this.therapyCheckbox).toBeChecked();
    await expect(this.otherCheckbox).toBeChecked();
  }

  /**
   * Verify that property type options are enabled
   */
  async verifyPropertyTypeOptionsEnabled(): Promise<void> {
    await expect(this.ownedHouseOption).toBeEnabled();
    await expect(this.rentalPropertyOption).toBeEnabled();
    await expect(this.mobileHomeOption).toBeEnabled();
  }

  /**
   * Verify that we're on property type step
   * Checks that all property type radio buttons are visible
   */
  async verifyPropertyTypeStep(): Promise<void> {
    await expect(this.ownedHouseOption).toBeVisible();
    await expect(this.rentalPropertyOption).toBeVisible();
    await expect(this.mobileHomeOption).toBeVisible();
  }

  /**
   * Verify that a specific property type is selected
   */
  async verifyPropertyTypeSelected(selectedType: 'ownedHouse' | 'rentalProperty' | 'mobileHome'): Promise<void> {
    if (selectedType === 'ownedHouse') {
      await expect(this.ownedHouseOption).toBeChecked();
      await expect(this.rentalPropertyOption).not.toBeChecked();
      await expect(this.mobileHomeOption).not.toBeChecked();
    } else if (selectedType === 'rentalProperty') {
      await expect(this.ownedHouseOption).not.toBeChecked();
      await expect(this.rentalPropertyOption).toBeChecked();
      await expect(this.mobileHomeOption).not.toBeChecked();
    } else if (selectedType === 'mobileHome') {
      await expect(this.ownedHouseOption).not.toBeChecked();
      await expect(this.rentalPropertyOption).not.toBeChecked();
      await expect(this.mobileHomeOption).toBeChecked();
    }
  }

  /**
   * Verify phone number is formatted correctly
   */
  async verifyPhoneFormatted(): Promise<void> {
    await expect(this.phoneInput).toHaveValue(/^\(\d{3}\)\d{3}-\d{4}$/);
  }

  /**
   * Verify redirect to Thank You page
   */
  async verifyRedirectToThankYouPage(): Promise<void> {
    await expect(this.page).toHaveURL(this.thankYouPageUrl);
    
    const thankYouHeading = this.page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
    await expect(thankYouHeading).toContainText(/thank you/i);
  }

  /**
   * Verify that form did not redirect to thank you page
   * Used to verify form stayed on current step after validation failure
   */
  async verifyNotOnThankYouPage(): Promise<void> {
    await expect(this.page).not.toHaveURL(this.thankYouPageUrl);
  }

  // ZIP Code Assertions

  /**
   * Verify ZIP code validation succeeded
   * Form should proceed to interest step
   */
  async expectZipCodeSuccess(): Promise<void> {
    // Verify form proceeded to interest step (behavior: user sees next step with all checkboxes visible)
    await expect(this.independenceCheckbox).toBeVisible();
    await expect(this.safetyCheckbox).toBeVisible();
    await expect(this.therapyCheckbox).toBeVisible();
    await expect(this.otherCheckbox).toBeVisible();
    // Verify ZIP code was accepted (no error message visible to user)
    await expect(this.zipCodeError).not.toBeVisible();
  }

  /**
   * Verify ZIP code validation failed
   * Form should stay on ZIP code step with error message
   */
  async expectZipCodeFailure(zipCode: string): Promise<void> {
    await expect(this.zipInput).toBeVisible();
    await expect(this.independenceCheckbox).not.toBeVisible();
    await expect(this.zipInput).toHaveValue(zipCode);
    await expect(this.zipCodeError).toBeVisible();
  }

  // Email Assertions

  /**
   * Verify email validation succeeded
   * Form should proceed to phone step
   */
  async expectEmailSuccess(): Promise<void> {
    // Verify form proceeded to phone step (behavior: user sees phone input on next step)
    await expect(this.phoneInput).toBeVisible();
    // Verify email was accepted (no error messages visible to user)
    // Note: Email errors are not displayed, form just doesn't proceed if invalid
  }

  /**
   * Verify email validation failed
   * Form should stay on contact info step
   */
  async expectEmailFailure(): Promise<void> {
    // Verify form did not proceed to phone step (bug detection)
    // Check with interval polling to catch delayed transitions
    // If emailInput remains visible, form correctly stayed on contact info step
    // If emailInput becomes hidden, form proceeded to next step (bug)
    await verifyElementRemainsVisible(this.page, this.emailInput, 1500, 200);
  }

  // Phone Assertions

  /**
   * Verify phone validation succeeded
   * Form should redirect to Thank You page
   */
  async expectPhoneSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(this.thankYouPageUrl);
    const thankYouHeading = this.page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
  }

  /**
   * Verify phone validation failed
   * Form should stay on phone step with error message
   */
  async expectPhoneFailure(): Promise<void> {
    // Verify form stayed on phone step (behavior: phone input is still visible to user)
    await expect(this.phoneInput).toBeVisible();
    // Verify error message is displayed to user
    await expect(this.phoneError).toBeVisible();
    // Verify form did not proceed to thank you page (behavior: user is still on phone step)
    await this.verifyNotOnThankYouPage();
  }

  // Interest Checkbox Assertions

  /**
   * Verify that form stays on interest step when no checkbox is selected
   * Expected: Form should remain on interest step (checkboxes visible, property type step not visible)
   */
  async expectFormStaysOnInterestStep(): Promise<void> {
    await verifyElementRemainsVisible(this.page, this.independenceCheckbox, 1500, 200);
  }

  /**
   * Verify that form proceeds to property type step when at least one interest checkbox is selected
   * Expected: Property type radio buttons should be visible on next step, no error messages visible
   */
  async expectInterestSuccess(): Promise<void> {
    // Verify form proceeded to property type step (behavior: user sees property type options on next step)
    await expect(this.ownedHouseOption).toBeVisible();
    await expect(this.rentalPropertyOption).toBeVisible();
    await expect(this.mobileHomeOption).toBeVisible();
    // Verify that form did not stay on interest step
    await expect(this.independenceCheckbox).not.toBeVisible();
  }

  // Name Field Assertions

  /**
   * Verify that form stays on contact info step when name field is empty
   * Expected: Form should remain on contact info step with error message displayed
   */
  async expectFormStaysOnContactInfoStepWithNameError(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.missingNameError).toBeVisible();
    // Verify that form did not proceed to phone step
    await expect(this.phoneInput).not.toBeVisible();
  }

  /**
   * Verify that form proceeds to phone step when name is valid
   * Expected: Phone input should be visible on next step, no error messages visible
   */
  async expectNameSuccess(): Promise<void> {
    // Verify form proceeded to phone step (behavior: user sees phone input on next step)
    await expect(this.phoneInput).toBeVisible();
    // Verify name was accepted (no error messages visible to user)
    await expect(this.missingNameError).not.toBeVisible();
    await expect(this.nameFormatError).not.toBeVisible();
    await expect(this.nameFullNameError).not.toBeVisible();
  }

  /**
   * Verify that form stays on contact info step when name format is invalid
   * Expected: Form should remain on contact info step with format error message displayed
   */
  async expectFormStaysOnContactInfoStepWithNameFormatError(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameFormatError).toBeVisible();
    // Verify that form did not proceed to phone step
    await expect(this.phoneInput).not.toBeVisible();
  }

  /**
   * Verify that form stays on contact info step when name doesn't contain both first and last name
   * Expected: Form should remain on contact info step with full name error message displayed
   */
  async expectFormStaysOnContactInfoStepWithNameFullNameError(): Promise<void> {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameFullNameError).toBeVisible();
    // Verify that form did not proceed to phone step
    await expect(this.phoneInput).not.toBeVisible();
  }

  // Property Type Assertions

  /**
   * Verify that form stays on property type step when no radio button is selected
   * Expected: Form should remain on property type step (radio buttons visible, contact info step not visible)
   */
  async expectFormStaysOnPropertyTypeStep(): Promise<void> {
    await expect(this.ownedHouseOption).toBeVisible();
    await expect(this.propertyTypeError).toBeVisible();
    // Verify that form did not proceed to contact info step
    await expect(this.nameInput).not.toBeVisible();
    await expect(this.emailInput).not.toBeVisible();
  }

  /**
   * Verify that form proceeds to contact info step when property type radio button is selected
   * Expected: Contact info inputs should be visible on next step, no error messages visible
   */
  async expectPropertyTypeSuccess(): Promise<void> {
    // Verify form proceeded to contact info step (behavior: user sees name and email inputs on next step)
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    // Verify that form did not stay on property type step
    await expect(this.ownedHouseOption).not.toBeVisible();
    await expect(this.propertyTypeError).not.toBeVisible();
  }
}
