import { Locator, expect } from '@playwright/test';

/**
 * Form action methods - handles all user interactions with form elements
 */

export type InterestType = 'independence' | 'safety' | 'therapy' | 'other';
export type PropertyType = 'ownedHouse' | 'rentalProperty' | 'mobileHome';

export class FormActions {
  constructor(
    private zipInput: Locator,
    private nextButton: Locator,
    private independenceCheckbox: Locator,
    private safetyCheckbox: Locator,
    private therapyCheckbox: Locator,
    private otherCheckbox: Locator,
    private ownedHouseOption: Locator,
    private rentalPropertyOption: Locator,
    private mobileHomeOption: Locator,
    private nameInput: Locator,
    private emailInput: Locator,
    private goToEstimateButton: Locator,
    private phoneInput: Locator,
    private submitButton: Locator,
  ) {}

  /**
   * Enter ZIP code into the form
   */
  async enterZipCode(zipCode: string): Promise<void> {
    await this.zipInput.fill(zipCode);
  }

  /**
   * Click the Next button
   */
  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  /**
   * Select all interest checkboxes
   * Waits for each checkbox to be visible before clicking (important for Firefox)
   */
  async selectAllInterests(): Promise<void> {
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
  async selectAtLeastOneInterest(): Promise<void> {
    await expect(this.independenceCheckbox).toBeVisible();
    await this.independenceCheckbox.check();
  }

  /**
   * Select a specific interest checkbox by type
   */
  async selectInterestCheckbox(type: InterestType): Promise<void> {
    const checkbox = this.getInterestCheckbox(type);
    await expect(checkbox).toBeVisible();
    await checkbox.check();
  }

  /**
   * Get the appropriate checkbox locator based on type
   */
  private getInterestCheckbox(type: InterestType): Locator {
    switch (type) {
      case 'independence':
        return this.independenceCheckbox;
      case 'safety':
        return this.safetyCheckbox;
      case 'therapy':
        return this.therapyCheckbox;
      case 'other':
        return this.otherCheckbox;
    }
  }

  /**
   * Select a specific property type radio button
   */
  async selectPropertyType(type: PropertyType): Promise<void> {
    const option = this.getPropertyTypeOption(type);
    await option.check();
  }

  /**
   * Get the appropriate property type option locator based on type
   */
  private getPropertyTypeOption(type: PropertyType): Locator {
    switch (type) {
      case 'ownedHouse':
        return this.ownedHouseOption;
      case 'rentalProperty':
        return this.rentalPropertyOption;
      case 'mobileHome':
        return this.mobileHomeOption;
    }
  }

  /**
   * Enter contact information (name and email)
   */
  async enterContactInfo(name: string, email: string): Promise<void> {
    await expect(this.nameInput).toBeEnabled();
    await expect(this.emailInput).toBeEnabled();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  /**
   * Click the "Go to Estimate" button
   */
  async clickGoToEstimate(): Promise<void> {
    await expect(this.goToEstimateButton).toBeEnabled();
    await this.goToEstimateButton.click();
  }

  /**
   * Enter phone number with proper event triggering
   * Uses evaluate to set value and trigger all formatting events (works in all browsers)
   */
  async enterPhoneNumber(phone: string): Promise<void> {
    await expect(this.phoneInput).toBeEnabled();
    await this.phoneInput.evaluate((el: any, value: string) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    }, phone);
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }
}
