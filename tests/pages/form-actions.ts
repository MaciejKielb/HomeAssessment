import { Locator, expect } from '@playwright/test';
import { FormActionsLocators } from '../types/form-locators';

/**
 * Form action methods - handles all user interactions with form elements
 */

export type InterestType = 'independence' | 'safety' | 'therapy' | 'other';
export type PropertyType = 'ownedHouse' | 'rentalProperty' | 'mobileHome';

export class FormActions {
  constructor(private locators: FormActionsLocators) {}

  /**
   * Enter ZIP code into the form
   */
  async enterZipCode(zipCode: string): Promise<void> {
    await this.locators.zipInput.fill(zipCode);
  }

  /**
   * Click the Next button
   */
  async clickNext(): Promise<void> {
    await this.locators.nextButton.click();
  }

  /**
   * Select all interest checkboxes
   */
  async selectAllInterests(): Promise<void> {
    const allInterestTypes: InterestType[] = ['independence', 'safety', 'therapy', 'other'];
    for (const interestType of allInterestTypes) {
      await this.getInterestCheckbox(interestType).check();
    }
  }

  /**
   * Select at least one interest checkbox (business requirement: at least one must be selected)
   * Used when testing accessibility or when only minimum requirement is needed
   */
  async selectAtLeastOneInterest(): Promise<void> {
    await this.locators.independenceCheckbox.check();
  }

  /**
   * Select a specific interest checkbox by type
   */
  async selectInterestCheckbox(type: InterestType): Promise<void> {
    const checkbox = this.getInterestCheckbox(type);
    await checkbox.check();
  }

  /**
   * Get the appropriate checkbox locator based on type
   */
  private getInterestCheckbox(type: InterestType): Locator {
    switch (type) {
      case 'independence':
        return this.locators.independenceCheckbox;
      case 'safety':
        return this.locators.safetyCheckbox;
      case 'therapy':
        return this.locators.therapyCheckbox;
      case 'other':
        return this.locators.otherCheckbox;
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
        return this.locators.ownedHouseOption;
      case 'rentalProperty':
        return this.locators.rentalPropertyOption;
      case 'mobileHome':
        return this.locators.mobileHomeOption;
    }
  }

  /**
   * Enter contact information (name and email)
   */
  async enterContactInfo(name: string, email: string): Promise<void> {
    const inputs = [this.locators.nameInput, this.locators.emailInput];
    for (const input of inputs) {
      await expect(input).toBeEnabled();
    }
    await this.locators.nameInput.fill(name);
    await this.locators.emailInput.fill(email);
  }

  /**
   * Click the "Go to Estimate" button
   */
  async clickGoToEstimate(): Promise<void> {
    await expect(this.locators.goToEstimateButton).toBeEnabled();
    await this.locators.goToEstimateButton.click();
  }

  /**
   * Enter phone number with proper event triggering
   * Uses evaluate to set value and trigger all formatting events (works in all browsers)
   */
  async enterPhoneNumber(phone: string): Promise<void> {
    await expect(this.locators.phoneInput).toBeEnabled();
    await this.locators.phoneInput.evaluate((el: any, value: string) => {
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
    await expect(this.locators.submitButton).toBeEnabled();
    await this.locators.submitButton.click();
  }
}
