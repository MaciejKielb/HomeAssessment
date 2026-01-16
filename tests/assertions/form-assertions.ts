import { Page, Locator, expect } from '@playwright/test';
import { FormAssertionsLocators } from '../types/form-locators';

/**
 * Form assertion methods - handles all verification and expectation logic
 * Moved from pages/ folder as assertions are not part of Page Object Model
 */

export class FormAssertions {
  constructor(
    private page: Page,
    private locators: FormAssertionsLocators,
  ) {}

  // ============================================================================
  // Generic Assertion Helpers
  // ============================================================================

  /**
   * Generic helper to verify all elements are visible
   */
  private async expectAllVisible(locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  }

  /**
   * Generic helper to verify all elements are not visible
   */
  private async expectAllNotVisible(locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      await expect(locator).not.toBeVisible();
    }
  }

  /**
   * Generic helper to verify all elements are enabled
   */
  private async expectAllEnabled(locators: Locator[]): Promise<void> {
    for (const locator of locators) {
      await expect(locator).toBeEnabled();
    }
  }

  /**
   * Generic helper to verify form stayed on current step
   */
  private async expectFormStaysOnStep(
    currentStepElements: Locator[],
    errorElement: Locator,
    nextStepElements: Locator[]
  ): Promise<void> {
    await this.expectAllVisible(currentStepElements);
    await expect(errorElement).toBeVisible();
    await this.expectAllNotVisible(nextStepElements);
  }

  /**
   * Generic helper to verify form proceeded to next step
   */
  private async expectFormProceededToStep(
    nextStepElements: Locator[],
    previousStepElements: Locator[],
    errorElements: Locator[]
  ): Promise<void> {
    await this.expectAllVisible(nextStepElements);
    await this.expectAllNotVisible(previousStepElements);
    await this.expectAllNotVisible(errorElements);
  }

  /**
   * Unified method to verify redirect to Thank You page
   * Replaces both verifyRedirectToThankYouPage() and expectPhoneSuccess()
   */
  async expectThankYouPage(): Promise<void> {
    await expect(this.page).toHaveURL(this.locators.thankYouPageUrl);
    // filter({ hasText }) already verifies text, no need for redundant toContainText()
    const thankYouHeading = this.page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
  }

  /**
   * Verify that form did not redirect to thank you page
   */
  async expectNotOnThankYouPage(): Promise<void> {
    await expect(this.page).not.toHaveURL(this.locators.thankYouPageUrl);
  }

  // ============================================================================
  // Step Verification Methods
  // ============================================================================

  /**
   * Verify that we're on interest step
   */
  async expectInterestStep(): Promise<void> {
    await this.expectAllVisible([
      this.locators.independenceCheckbox,
      this.locators.safetyCheckbox,
      this.locators.therapyCheckbox,
      this.locators.otherCheckbox,
    ]);
  }

  /**
   * Verify that all interest checkboxes are selected
   */
  async expectInterestsSelected(): Promise<void> {
    const checkboxes = [
      this.locators.independenceCheckbox,
      this.locators.safetyCheckbox,
      this.locators.therapyCheckbox,
      this.locators.otherCheckbox,
    ];
    for (const checkbox of checkboxes) {
      await expect(checkbox).toBeChecked();
    }
  }

  /**
   * Verify that property type options are enabled
   */
  async expectPropertyTypeOptionsEnabled(): Promise<void> {
    await this.expectAllEnabled([
      this.locators.ownedHouseOption,
      this.locators.rentalPropertyOption,
      this.locators.mobileHomeOption,
    ]);
  }

  /**
   * Verify that we're on property type step
   */
  async expectPropertyTypeStep(): Promise<void> {
    await this.expectAllVisible([
      this.locators.ownedHouseOption,
      this.locators.rentalPropertyOption,
      this.locators.mobileHomeOption,
    ]);
  }

  /**
   * Verify that a specific property type is selected
   */
  async expectPropertyTypeSelected(selectedType: 'ownedHouse' | 'rentalProperty' | 'mobileHome'): Promise<void> {
    const propertyTypeMap = {
      ownedHouse: this.locators.ownedHouseOption,
      rentalProperty: this.locators.rentalPropertyOption,
      mobileHome: this.locators.mobileHomeOption,
    };

    const allPropertyTypes: Array<'ownedHouse' | 'rentalProperty' | 'mobileHome'> = [
      'ownedHouse',
      'rentalProperty',
      'mobileHome',
    ];

    for (const type of allPropertyTypes) {
      if (type === selectedType) {
        await expect(propertyTypeMap[type]).toBeChecked();
      } else {
        await expect(propertyTypeMap[type]).not.toBeChecked();
      }
    }
  }

  /**
   * Verify phone number is formatted correctly
   */
  async expectPhoneFormatted(): Promise<void> {
    await expect(this.locators.phoneInput).toHaveValue(/^\(\d{3}\)\d{3}-\d{4}$/);
  }

  // ============================================================================
  // ZIP Code Assertions
  // ============================================================================

  /**
   * Verify ZIP code validation succeeded
   */
  async expectZipCodeSuccess(): Promise<void> {
    await this.expectAllVisible([
      this.locators.independenceCheckbox,
      this.locators.safetyCheckbox,
      this.locators.therapyCheckbox,
      this.locators.otherCheckbox,
    ]);
    await expect(this.locators.zipCodeError).not.toBeVisible();
  }

  /**
   * Verify ZIP code validation failed
   */
  async expectZipCodeFailure(zipCode: string): Promise<void> {
    await expect(this.locators.zipInput).toBeVisible();
    await expect(this.locators.independenceCheckbox).not.toBeVisible();
    await expect(this.locators.zipInput).toHaveValue(zipCode);
    await expect(this.locators.zipCodeError).toBeVisible();
  }

  // ============================================================================
  // Email Assertions
  // ============================================================================

  /**
   * Verify email validation succeeded
   */
  async expectEmailSuccess(): Promise<void> {
    await expect(this.locators.phoneInput).toBeVisible();
  }

  /**
   * Verify email validation failed
   */
  async expectEmailFailure(): Promise<void> {
    await this.expectFormStaysOnStep(
      [this.locators.emailInput, this.locators.nameInput],
      this.locators.emailError,
      [this.locators.phoneInput]
    );
  }

  // ============================================================================
  // Phone Assertions
  // ============================================================================

  /**
   * Verify phone validation failed
   */
  async expectPhoneFailure(): Promise<void> {
    await expect(this.locators.phoneInput).toBeVisible();
    await expect(this.locators.phoneError).toBeVisible();
    await this.expectNotOnThankYouPage();
  }

  // ============================================================================
  // Interest Checkbox Assertions
  // ============================================================================

  /**
   * Verify that form stays on interest step when no checkbox is selected
   */
  async expectStaysOnInterestStep(): Promise<void> {
    await this.expectFormStaysOnStep(
      [
        this.locators.independenceCheckbox,
        this.locators.safetyCheckbox,
        this.locators.therapyCheckbox,
        this.locators.otherCheckbox,
      ],
      this.locators.interestError,
      [
        this.locators.ownedHouseOption,
        this.locators.rentalPropertyOption,
        this.locators.mobileHomeOption,
      ]
    );
  }

  /**
   * Verify that form proceeds to property type step when at least one interest checkbox is selected
   */
  async expectInterestSuccess(): Promise<void> {
    await this.expectFormProceededToStep(
      [
        this.locators.ownedHouseOption,
        this.locators.rentalPropertyOption,
        this.locators.mobileHomeOption,
      ],
      [this.locators.independenceCheckbox],
      []
    );
  }

  // ============================================================================
  // Name Field Assertions
  // ============================================================================

  /**
   * Verify that form stays on contact info step when name field is empty
   */
  async expectStaysOnContactInfoWithNameError(): Promise<void> {
    await this.expectFormStaysOnStep(
      [this.locators.nameInput, this.locators.emailInput],
      this.locators.missingNameError,
      [this.locators.phoneInput]
    );
  }

  /**
   * Verify that form proceeds to phone step when name is valid
   */
  async expectNameSuccess(): Promise<void> {
    await this.expectFormProceededToStep(
      [this.locators.phoneInput],
      [],
      [
        this.locators.missingNameError,
        this.locators.nameFormatError,
        this.locators.nameFullNameError,
      ]
    );
  }

  /**
   * Verify that form stays on contact info step when name format is invalid
   */
  async expectStaysOnContactInfoWithNameFormatError(): Promise<void> {
    await this.expectFormStaysOnStep(
      [this.locators.nameInput, this.locators.emailInput],
      this.locators.nameFormatError,
      [this.locators.phoneInput]
    );
  }

  /**
   * Verify that form stays on contact info step when name doesn't contain both first and last name
   */
  async expectStaysOnContactInfoWithNameFullNameError(): Promise<void> {
    await this.expectFormStaysOnStep(
      [this.locators.nameInput, this.locators.emailInput],
      this.locators.nameFullNameError,
      [this.locators.phoneInput]
    );
  }

  // ============================================================================
  // Property Type Assertions
  // ============================================================================

  /**
   * Verify that form stays on property type step when no radio button is selected
   */
  async expectStaysOnPropertyTypeStep(): Promise<void> {
    await this.expectFormStaysOnStep(
      [this.locators.ownedHouseOption],
      this.locators.propertyTypeError,
      [this.locators.nameInput, this.locators.emailInput]
    );
  }

  /**
   * Verify that form proceeds to contact info step when property type radio button is selected
   */
  async expectPropertyTypeSuccess(): Promise<void> {
    await this.expectFormProceededToStep(
      [this.locators.nameInput, this.locators.emailInput],
      [this.locators.ownedHouseOption],
      [this.locators.propertyTypeError]
    );
  }
}
