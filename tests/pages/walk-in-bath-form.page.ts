import { Page, Locator } from '@playwright/test';
import { FormActions, InterestType, PropertyType } from './form-actions';
import { FormAssertions } from './form-assertions';
import { FormNavigation } from './form-navigation';

/**
 * Walk-In Bath Form Page Object Model
 * Orchestrates form interactions by delegating to specialized modules
 */
export class WalkInBathFormPage {
  readonly page: Page;
  readonly form: Locator;
  
  // Form Input Locators
  readonly zipInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  
  // Button Locators
  readonly nextButton: Locator;
  readonly goToEstimateButton: Locator;
  readonly submitButton: Locator;
  
  // Interest Checkbox Locators
  readonly independenceCheckbox: Locator;
  readonly safetyCheckbox: Locator;
  readonly therapyCheckbox: Locator;
  readonly otherCheckbox: Locator;
  
  // Property Type Radio Button Locators
  readonly ownedHouseOption: Locator;
  readonly rentalPropertyOption: Locator;
  readonly mobileHomeOption: Locator;
  
  // Error Message Locators
  readonly zipCodeError: Locator;
  readonly phoneError: Locator;
  readonly missingNameError: Locator;
  readonly nameFormatError: Locator;
  readonly nameFullNameError: Locator;
  readonly propertyTypeError: Locator;
  
  // URL Patterns
  readonly thankYouPageUrl: RegExp;

  private readonly actions: FormActions;
  private readonly assertions: FormAssertions;
  private readonly navigation: FormNavigation;

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

    this.actions = new FormActions(
      this.zipInput,
      this.nextButton,
      this.independenceCheckbox,
      this.safetyCheckbox,
      this.therapyCheckbox,
      this.otherCheckbox,
      this.ownedHouseOption,
      this.rentalPropertyOption,
      this.mobileHomeOption,
      this.nameInput,
      this.emailInput,
      this.goToEstimateButton,
      this.phoneInput,
      this.submitButton,
    );

    this.assertions = new FormAssertions(
      this.page,
      this.zipInput,
      this.independenceCheckbox,
      this.safetyCheckbox,
      this.therapyCheckbox,
      this.otherCheckbox,
      this.ownedHouseOption,
      this.rentalPropertyOption,
      this.mobileHomeOption,
      this.nameInput,
      this.emailInput,
      this.phoneInput,
      this.zipCodeError,
      this.phoneError,
      this.missingNameError,
      this.nameFormatError,
      this.nameFullNameError,
      this.propertyTypeError,
      this.thankYouPageUrl,
    );

    this.navigation = new FormNavigation(this.actions);
  }

  // ============================================================================
  // Navigation
  // ============================================================================

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
  }

  // ============================================================================
  // ZIP Code Step Actions
  // ============================================================================

  async enterZipCode(zipCode: string) {
    return this.actions.enterZipCode(zipCode);
  }

  async clickNext() {
    return this.actions.clickNext();
  }

  // ============================================================================
  // Interest Checkbox Step Actions
  // ============================================================================

  async selectAllInterests() {
    return this.actions.selectAllInterests();
  }

  async selectAtLeastOneInterest() {
    return this.actions.selectAtLeastOneInterest();
  }

  async selectIndependenceCheckbox() {
    return this.actions.selectInterestCheckbox('independence');
  }

  async selectSafetyCheckbox() {
    return this.actions.selectInterestCheckbox('safety');
  }

  async selectTherapyCheckbox() {
    return this.actions.selectInterestCheckbox('therapy');
  }

  async selectOtherCheckbox() {
    return this.actions.selectInterestCheckbox('other');
  }

  // ============================================================================
  // Property Type Step Actions
  // ============================================================================

  async selectMobileHome() {
    return this.actions.selectPropertyType('mobileHome');
  }

  async selectOwnedHouse() {
    return this.actions.selectPropertyType('ownedHouse');
  }

  async selectRentalProperty() {
    return this.actions.selectPropertyType('rentalProperty');
  }

  // ============================================================================
  // Contact Info Step Actions
  // ============================================================================

  async enterContactInfo(name: string, email: string) {
    return this.actions.enterContactInfo(name, email);
  }

  async clickGoToEstimate() {
    return this.actions.clickGoToEstimate();
  }

  // ============================================================================
  // Phone Step Actions
  // ============================================================================

  async enterPhoneNumber(phone: string) {
    return this.actions.enterPhoneNumber(phone);
  }

  // ============================================================================
  // Form Submission
  // ============================================================================

  async submitForm() {
    return this.actions.submitForm();
  }

  // ============================================================================
  // Navigation Methods
  // ============================================================================

  async navigateToPropertyTypeStep(): Promise<void> {
    return this.navigation.navigateToPropertyTypeStep();
  }

  async navigateToContactInfoStep(): Promise<void> {
    return this.navigation.navigateToContactInfoStep();
  }

  async navigateToPhoneStep(): Promise<void> {
    return this.navigation.navigateToPhoneStep();
  }

  // ============================================================================
  // Verification Methods
  // ============================================================================

  async verifyInterestStep() {
    return this.assertions.verifyInterestStep();
  }

  async verifyInterestsSelected() {
    return this.assertions.verifyInterestsSelected();
  }

  async verifyPropertyTypeOptionsEnabled() {
    return this.assertions.verifyPropertyTypeOptionsEnabled();
  }

  async verifyPropertyTypeStep() {
    return this.assertions.verifyPropertyTypeStep();
  }

  async verifyMobileHomeSelected() {
    return this.assertions.verifyPropertyTypeSelected('mobileHome');
  }

  async verifyOwnedHouseSelected() {
    return this.assertions.verifyPropertyTypeSelected('ownedHouse');
  }

  async verifyRentalPropertySelected() {
    return this.assertions.verifyPropertyTypeSelected('rentalProperty');
  }

  async verifyPhoneFormatted() {
    return this.assertions.verifyPhoneFormatted();
  }

  async verifyRedirectToThankYouPage() {
    return this.assertions.verifyRedirectToThankYouPage();
  }

  async verifyNotOnThankYouPage() {
    return this.assertions.verifyNotOnThankYouPage();
  }

  // ============================================================================
  // Expectation Methods - ZIP Code Validation
  // ============================================================================

  async expectZipCodeSuccess() {
    return this.assertions.expectZipCodeSuccess();
  }

  async expectZipCodeFailure(zipCode: string) {
    return this.assertions.expectZipCodeFailure(zipCode);
  }

  // ============================================================================
  // Expectation Methods - Email Validation
  // ============================================================================

  async expectEmailSuccess() {
    return this.assertions.expectEmailSuccess();
  }

  async expectEmailFailure(email: string): Promise<void> {
    return this.assertions.expectEmailFailure();
  }

  // ============================================================================
  // Expectation Methods - Phone Validation
  // ============================================================================

  async expectPhoneSuccess() {
    return this.assertions.expectPhoneSuccess();
  }

  async expectPhoneFailure(phone: string) {
    return this.assertions.expectPhoneFailure();
  }

  // ============================================================================
  // Expectation Methods - Interest Checkbox Validation
  // ============================================================================

  async expectFormStaysOnInterestStep() {
    return this.assertions.expectFormStaysOnInterestStep();
  }

  async expectInterestSuccess() {
    return this.assertions.expectInterestSuccess();
  }

  // ============================================================================
  // Expectation Methods - Name Field Validation
  // ============================================================================

  async expectFormStaysOnContactInfoStepWithNameError() {
    return this.assertions.expectFormStaysOnContactInfoStepWithNameError();
  }

  async expectNameSuccess() {
    return this.assertions.expectNameSuccess();
  }

  async expectFormStaysOnContactInfoStepWithNameFormatError() {
    return this.assertions.expectFormStaysOnContactInfoStepWithNameFormatError();
  }

  async expectFormStaysOnContactInfoStepWithNameFullNameError() {
    return this.assertions.expectFormStaysOnContactInfoStepWithNameFullNameError();
  }

  // ============================================================================
  // Expectation Methods - Property Type Validation
  // ============================================================================

  async expectFormStaysOnPropertyTypeStep() {
    return this.assertions.expectFormStaysOnPropertyTypeStep();
  }

  async expectPropertyTypeSuccess() {
    return this.assertions.expectPropertyTypeSuccess();
  }
}
