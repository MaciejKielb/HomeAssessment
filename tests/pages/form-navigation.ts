import { testData } from '@data/test-data';
import { FormActions } from './form-actions';

/**
 * Form navigation methods - handles navigation between form steps
 */

export class FormNavigation {
  constructor(private actions: FormActions) {}

  /**
   * Navigates through form steps to reach property type step
   */
  async navigateToPropertyTypeStep(): Promise<void> {
    await this.actions.enterZipCode(testData.valid.zipCode);
    await this.actions.clickNext();
    await this.actions.selectAtLeastOneInterest();
    await this.actions.clickNext();
  }

  /**
   * Navigates through form steps to reach contact info step
   */
  async navigateToContactInfoStep(): Promise<void> {
    await this.actions.enterZipCode(testData.valid.zipCode);
    await this.actions.clickNext();
    await this.actions.selectAllInterests();
    await this.actions.clickNext();
    await this.actions.selectPropertyType('mobileHome');
    await this.actions.clickNext();
  }

  /**
   * Navigates through form steps to reach phone step
   */
  async navigateToPhoneStep(): Promise<void> {
    await this.navigateToContactInfoStep();
    await this.actions.enterContactInfo(testData.valid.name, testData.valid.email);
    await this.actions.clickGoToEstimate();
  }
}
