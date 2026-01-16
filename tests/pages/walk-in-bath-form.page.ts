import { Page, Locator } from '@playwright/test';
import { FormActions } from './form-actions';
import { FormAssertions } from '../assertions/form-assertions';
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
  readonly emailError: Locator;
  readonly interestError: Locator;
  
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
    // Error selectors for fields that don't display errors (used for bug detection)
    this.emailError = this.form.getByText(/invalid email|wrong email|please enter a valid email/i);
    this.interestError = this.form.getByText(/please select at least one interest|select at least one option/i);
    this.thankYouPageUrl = /\/thankyou/i;

    this.actions = new FormActions({
      zipInput: this.zipInput,
      nextButton: this.nextButton,
      independenceCheckbox: this.independenceCheckbox,
      safetyCheckbox: this.safetyCheckbox,
      therapyCheckbox: this.therapyCheckbox,
      otherCheckbox: this.otherCheckbox,
      ownedHouseOption: this.ownedHouseOption,
      rentalPropertyOption: this.rentalPropertyOption,
      mobileHomeOption: this.mobileHomeOption,
      nameInput: this.nameInput,
      emailInput: this.emailInput,
      goToEstimateButton: this.goToEstimateButton,
      phoneInput: this.phoneInput,
      submitButton: this.submitButton,
    });

    this.assertions = new FormAssertions(this.page, {
      zipInput: this.zipInput,
      independenceCheckbox: this.independenceCheckbox,
      safetyCheckbox: this.safetyCheckbox,
      therapyCheckbox: this.therapyCheckbox,
      otherCheckbox: this.otherCheckbox,
      ownedHouseOption: this.ownedHouseOption,
      rentalPropertyOption: this.rentalPropertyOption,
      mobileHomeOption: this.mobileHomeOption,
      nameInput: this.nameInput,
      emailInput: this.emailInput,
      phoneInput: this.phoneInput,
      zipCodeError: this.zipCodeError,
      phoneError: this.phoneError,
      missingNameError: this.missingNameError,
      nameFormatError: this.nameFormatError,
      nameFullNameError: this.nameFullNameError,
      propertyTypeError: this.propertyTypeError,
      emailError: this.emailError,
      interestError: this.interestError,
      thankYouPageUrl: this.thankYouPageUrl,
    });

    this.navigation = new FormNavigation(this.actions);
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

  async expectInterestStep() {
    return this.assertions.expectInterestStep();
  }

  async expectInterestsSelected() {
    return this.assertions.expectInterestsSelected();
  }

  async expectPropertyTypeOptionsEnabled() {
    return this.assertions.expectPropertyTypeOptionsEnabled();
  }

  async expectPropertyTypeStep() {
    return this.assertions.expectPropertyTypeStep();
  }

  async expectMobileHomeSelected() {
    return this.assertions.expectPropertyTypeSelected('mobileHome');
  }

  async expectOwnedHouseSelected() {
    return this.assertions.expectPropertyTypeSelected('ownedHouse');
  }

  async expectRentalPropertySelected() {
    return this.assertions.expectPropertyTypeSelected('rentalProperty');
  }

  async expectPhoneFormatted() {
    return this.assertions.expectPhoneFormatted();
  }

  async expectThankYouPage() {
    return this.assertions.expectThankYouPage();
  }

  async expectNotOnThankYouPage() {
    return this.assertions.expectNotOnThankYouPage();
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

  async expectEmailFailure(): Promise<void> {
    return this.assertions.expectEmailFailure();
  }

  // ============================================================================
  // Expectation Methods - Phone Validation
  // ============================================================================

  async expectPhoneSuccess() {
    return this.assertions.expectThankYouPage();
  }

  async expectPhoneFailure(phone: string) {
    return this.assertions.expectPhoneFailure();
  }

  // ============================================================================
  // Expectation Methods - Interest Checkbox Validation
  // ============================================================================

  async expectFormStaysOnInterestStep() {
    return this.assertions.expectStaysOnInterestStep();
  }

  async expectInterestSuccess() {
    return this.assertions.expectInterestSuccess();
  }

  // ============================================================================
  // Expectation Methods - Name Field Validation
  // ============================================================================

  async expectFormStaysOnContactInfoStepWithNameError() {
    return this.assertions.expectStaysOnContactInfoWithNameError();
  }

  async expectNameSuccess() {
    return this.assertions.expectNameSuccess();
  }

  async expectFormStaysOnContactInfoStepWithNameFormatError() {
    return this.assertions.expectStaysOnContactInfoWithNameFormatError();
  }

  async expectFormStaysOnContactInfoStepWithNameFullNameError() {
    return this.assertions.expectStaysOnContactInfoWithNameFullNameError();
  }

  // ============================================================================
  // Expectation Methods - Property Type Validation
  // ============================================================================

  async expectFormStaysOnPropertyTypeStep() {
    return this.assertions.expectStaysOnPropertyTypeStep();
  }

  async expectPropertyTypeSuccess() {
    return this.assertions.expectPropertyTypeSuccess();
  }
}
