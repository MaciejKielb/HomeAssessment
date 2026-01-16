import { Locator } from '@playwright/test';

/**
 * Locator interfaces for form components
 * Centralized type definitions for form locators
 */

/**
 * Locators for form actions (interactive elements)
 */
export interface FormActionsLocators {
  zipInput: Locator;
  nextButton: Locator;
  independenceCheckbox: Locator;
  safetyCheckbox: Locator;
  therapyCheckbox: Locator;
  otherCheckbox: Locator;
  ownedHouseOption: Locator;
  rentalPropertyOption: Locator;
  mobileHomeOption: Locator;
  nameInput: Locator;
  emailInput: Locator;
  goToEstimateButton: Locator;
  phoneInput: Locator;
  submitButton: Locator;
}

/**
 * Locators for form assertions (including error messages and validation)
 */
export interface FormAssertionsLocators {
  zipInput: Locator;
  independenceCheckbox: Locator;
  safetyCheckbox: Locator;
  therapyCheckbox: Locator;
  otherCheckbox: Locator;
  ownedHouseOption: Locator;
  rentalPropertyOption: Locator;
  mobileHomeOption: Locator;
  nameInput: Locator;
  emailInput: Locator;
  phoneInput: Locator;
  zipCodeError: Locator;
  phoneError: Locator;
  missingNameError: Locator;
  nameFormatError: Locator;
  nameFullNameError: Locator;
  propertyTypeError: Locator;
  emailError: Locator;
  interestError: Locator;
  thankYouPageUrl: RegExp;
}
