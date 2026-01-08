import { Page, Locator, expect } from '@playwright/test';
import { testData } from '@data/test-data';
import { verifyElementRemainsVisible } from '@helpers/wait-helpers';

export class WalkInBathFormPage {
  readonly page: Page;
  readonly form: Locator;
  readonly zipInput: Locator;
  readonly nextButton: Locator;
  readonly independenceCheckbox: Locator;
  readonly safetyCheckbox: Locator;
  readonly therapyCheckbox: Locator;
  readonly otherCheckbox: Locator;
  readonly ownedHouseOption: Locator;
  readonly rentalPropertyOption: Locator;
  readonly mobileHomeOption: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly goToEstimateButton: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;
  readonly zipCodeError: Locator;
  readonly phoneError: Locator;
  readonly missingNameError: Locator;
  readonly nameFormatError: Locator;
  readonly nameFullNameError: Locator;
  readonly propertyTypeError: Locator;
  readonly thankYouPageUrl: RegExp;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#form-container-1');
    this.zipInput = this.form.getByRole('textbox', { name: /enter zip code/i });
    this.nextButton = this.form.getByRole('button', { name: /next/i });
    this.independenceCheckbox = this.form.getByText(/independence/i);
    this.safetyCheckbox = this.form.getByText(/safety/i);
    this.therapyCheckbox = this.form.getByText(/therapy/i);
    this.otherCheckbox = this.form.getByText(/other/i);
    this.ownedHouseOption = this.form.getByText(/owned house\s*\/\s*condo/i);
    this.rentalPropertyOption = this.form.getByText(/rental property/i);
    this.mobileHomeOption = this.form.getByText(/mobile home/i);
    this.nameInput = this.form.getByRole('textbox', { name: /name/i });
    this.emailInput = this.form.getByRole('textbox', { name: /email/i });
    this.goToEstimateButton = this.form.getByRole('button', { name: /go to estimate/i });
    this.phoneInput = this.form.locator('input[name="phone"]');
    this.submitButton = this.form.getByRole('button', { name: /submit your request/i });
    this.zipCodeError = this.form.getByText(/wrong zip code/i);
    this.phoneError = this.form.getByText(/wrong phone number/i);
    this.missingNameError = this.form.getByText(/please enter your name/i);
    this.nameFormatError = this.form.getByText(/your name should consist only/i);
    this.nameFullNameError = this.form.getByText(/should contain both first and last name/i);
    this.propertyTypeError = this.form.getByText(/choose one of the variants/i);
    this.thankYouPageUrl = /\/thankyou/i;
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
  }

  async enterZipCode(zipCode: string) {
    await this.zipInput.fill(zipCode);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async selectAllInterests() {
    // Wait for checkboxes to be visible and enabled before clicking (important for Firefox)
    await expect(this.independenceCheckbox).toBeVisible();
    await this.independenceCheckbox.check();
    await expect(this.safetyCheckbox).toBeVisible();
    await this.safetyCheckbox.check();
    await expect(this.therapyCheckbox).toBeVisible();
    await this.therapyCheckbox.check();
    await expect(this.otherCheckbox).toBeVisible();
    await this.otherCheckbox.check();
  }

  /**
   * Select at least one interest checkbox (business requirement: at least one must be selected)
   * Used when testing accessibility or when only minimum requirement is needed
   */
  async selectAtLeastOneInterest() {
    await expect(this.independenceCheckbox).toBeVisible();
    await this.independenceCheckbox.check();
  }

  async selectIndependenceCheckbox() {
    await expect(this.independenceCheckbox).toBeVisible();
    await this.independenceCheckbox.check();
  }

  async selectSafetyCheckbox() {
    await expect(this.safetyCheckbox).toBeVisible();
    await this.safetyCheckbox.check();
  }

  async selectTherapyCheckbox() {
    await expect(this.therapyCheckbox).toBeVisible();
    await this.therapyCheckbox.check();
  }

  async selectOtherCheckbox() {
    await expect(this.otherCheckbox).toBeVisible();
    await this.otherCheckbox.check();
  }

  /**
   * Verify that we're on interest step
   * Checks that all interest checkboxes are visible
   */
  async verifyInterestStep() {
    await expect(this.independenceCheckbox).toBeVisible();
    await expect(this.safetyCheckbox).toBeVisible();
    await expect(this.therapyCheckbox).toBeVisible();
    await expect(this.otherCheckbox).toBeVisible();
  }

  async verifyInterestsSelected() {
    await expect(this.independenceCheckbox).toBeChecked();
    await expect(this.safetyCheckbox).toBeChecked();
    await expect(this.therapyCheckbox).toBeChecked();
    await expect(this.otherCheckbox).toBeChecked();
  }

  async verifyPropertyTypeOptionsEnabled() {
    await expect(this.ownedHouseOption).toBeEnabled();
    await expect(this.rentalPropertyOption).toBeEnabled();
    await expect(this.mobileHomeOption).toBeEnabled();
  }

  async selectMobileHome() {
    await this.mobileHomeOption.check();
  }

  async selectOwnedHouse() {
    await this.ownedHouseOption.check();
  }

  async selectRentalProperty() {
    await this.rentalPropertyOption.check();
  }

  /**
   * Navigates through form steps to reach property type step
   * Used to avoid code duplication in accessibility tests
   */
  async navigateToPropertyTypeStep(): Promise<void> {
    await this.enterZipCode(testData.valid.zipCode);
    await this.clickNext();
    await this.selectAtLeastOneInterest();
    await this.clickNext();
  }

  /**
   * Verify that we're on property type step
   * Checks that all property type radio buttons are visible
   */
  async verifyPropertyTypeStep() {
    await expect(this.ownedHouseOption).toBeVisible();
    await expect(this.rentalPropertyOption).toBeVisible();
    await expect(this.mobileHomeOption).toBeVisible();
  }

  /**
   * Navigates through form steps to reach contact info step
   * Used to avoid code duplication in email validation tests
   */
  async navigateToContactInfoStep(): Promise<void> {
    await this.enterZipCode(testData.valid.zipCode);
    await this.clickNext();
    await this.selectAllInterests();
    await this.clickNext();
    await this.selectMobileHome();
    await this.clickNext();
  }

  /**
   * Navigates through form steps to reach phone step
   * Used to avoid code duplication in phone validation tests
   */
  async navigateToPhoneStep(): Promise<void> {
    await this.navigateToContactInfoStep();
    await this.enterContactInfo(testData.valid.name, testData.valid.email);
    await this.clickGoToEstimate();
  }

  async verifyMobileHomeSelected() {
    await expect(this.ownedHouseOption).not.toBeChecked();
    await expect(this.rentalPropertyOption).not.toBeChecked();
    await expect(this.mobileHomeOption).toBeChecked();
  }

  async verifyOwnedHouseSelected() {
    await expect(this.ownedHouseOption).toBeChecked();
    await expect(this.rentalPropertyOption).not.toBeChecked();
    await expect(this.mobileHomeOption).not.toBeChecked();
  }

  async verifyRentalPropertySelected() {
    await expect(this.ownedHouseOption).not.toBeChecked();
    await expect(this.rentalPropertyOption).toBeChecked();
    await expect(this.mobileHomeOption).not.toBeChecked();
  }

  async enterContactInfo(name: string, email: string) {
    await expect(this.nameInput).toBeEnabled();
    await expect(this.emailInput).toBeEnabled();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  async clickGoToEstimate() {
    await expect(this.goToEstimateButton).toBeEnabled();
    await this.goToEstimateButton.click();
  }

  async enterPhoneNumber(phone: string) {
    await expect(this.phoneInput).toBeEnabled();
    // Use evaluate to set value and trigger all formatting events (works in all browsers)
    await this.phoneInput.evaluate((el: any, value: string) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    }, phone);
  }

  async verifyPhoneFormatted() {
    await expect(this.phoneInput).toHaveValue(/^\(\d{3}\)\d{3}-\d{4}$/);
  }

  async submitForm() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }

  async verifyRedirectToThankYouPage() {
    await expect(this.page).toHaveURL(this.thankYouPageUrl);
    
    const thankYouHeading = this.page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
    await expect(thankYouHeading).toContainText(/thank you/i);
  }

  /**
   * Verify that form did not redirect to thank you page
   * Used to verify form stayed on current step after validation failure
   */
  async verifyNotOnThankYouPage() {
    await expect(this.page).not.toHaveURL(this.thankYouPageUrl);
  }

  async expectZipCodeSuccess() {
    // Verify form proceeded to interest step (behavior: user sees next step with all checkboxes visible)
    await expect(this.independenceCheckbox).toBeVisible();
    await expect(this.safetyCheckbox).toBeVisible();
    await expect(this.therapyCheckbox).toBeVisible();
    await expect(this.otherCheckbox).toBeVisible();
    // Verify ZIP code was accepted (no error message visible to user)
    await expect(this.zipCodeError).not.toBeVisible();
  }

  async expectZipCodeFailure(zipCode: string) {
    await expect(this.zipInput).toBeVisible();
    await expect(this.independenceCheckbox).not.toBeVisible();
    await expect(this.zipInput).toHaveValue(zipCode);
    await expect(this.zipCodeError).toBeVisible();
  }

  async expectEmailSuccess() {
    // Verify form proceeded to phone step (behavior: user sees phone input on next step)
    await expect(this.phoneInput).toBeVisible();
    // Verify email was accepted (no error messages visible to user)
    // Note: Email errors are not displayed, form just doesn't proceed if invalid
  }

  async expectEmailFailure(email: string): Promise<void> {
    // Verify form did not proceed to phone step (bug detection)
    // Check with interval polling to catch delayed transitions
    // If emailInput remains visible, form correctly stayed on contact info step
    // If emailInput becomes hidden, form proceeded to next step (bug)
    await verifyElementRemainsVisible(this.page, this.emailInput, 1500, 200);
  }

  async expectPhoneSuccess() {
    await expect(this.page).toHaveURL(this.thankYouPageUrl);
    const thankYouHeading = this.page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
  }

  async expectPhoneFailure(phone: string) {
    // Verify form stayed on phone step (behavior: phone input is still visible to user)
    await expect(this.phoneInput).toBeVisible();
    // Verify error message is displayed to user (phoneError locator already contains the text pattern)
    await expect(this.phoneError).toBeVisible();
    // Verify form did not proceed to thank you page (behavior: user is still on phone step)
    await this.verifyNotOnThankYouPage();
  }

  /**
   * Verify that form stays on interest step when no checkbox is selected
   * Expected: Form should remain on interest step (checkboxes visible, property type step not visible)
   */
  async expectFormStaysOnInterestStep() {
    await verifyElementRemainsVisible(this.page, this.independenceCheckbox, 1500, 200);
  }

  /**
   * Verify that form proceeds to property type step when at least one interest checkbox is selected
   * Expected: Property type radio buttons should be visible on next step, no error messages visible
   */
  async expectInterestSuccess() {
    // Verify form proceeded to property type step (behavior: user sees property type options on next step)
    await expect(this.ownedHouseOption).toBeVisible();
    await expect(this.rentalPropertyOption).toBeVisible();
    await expect(this.mobileHomeOption).toBeVisible();
    // Verify that form did not stay on interest step
    await expect(this.independenceCheckbox).not.toBeVisible();
  }

  /**
   * Verify that form stays on contact info step when name field is empty
   * Expected: Form should remain on contact info step with error message displayed
   */
  async expectFormStaysOnContactInfoStepWithNameError() {
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
  async expectNameSuccess() {
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
  async expectFormStaysOnContactInfoStepWithNameFormatError() {
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
  async expectFormStaysOnContactInfoStepWithNameFullNameError() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.nameFullNameError).toBeVisible();
    // Verify that form did not proceed to phone step
    await expect(this.phoneInput).not.toBeVisible();
  }

  /**
   * Verify that form stays on property type step when no radio button is selected
   * Expected: Form should remain on property type step (radio buttons visible, contact info step not visible)
   */
  async expectFormStaysOnPropertyTypeStep() {
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
  async expectPropertyTypeSuccess() {
    // Verify form proceeded to contact info step (behavior: user sees name and email inputs on next step)
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    // Verify that form did not stay on property type step
    await expect(this.ownedHouseOption).not.toBeVisible();
    await expect(this.propertyTypeError).not.toBeVisible();
  }

}
