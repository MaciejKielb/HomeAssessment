import { test, expect } from '@playwright/test';

import { testData } from '../data/test-data';

test.describe('Walk-In Bath Form - Critical Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
  });

  /**
   * Test 1: Complete multi-step form submission flow with valid data
   * Requirements: All fields required, ZIP (5 digits), Email (valid format), Phone (10 digits), Redirect to Thank you page
   */
  test('should complete full form submission flow with valid data and redirect to Thank you page', async ({
    page,
  }) => {
    const form = page.locator('#form-container-1'); 
    const zipInput = form.getByRole('textbox', { name: /enter zip code/i });
    await zipInput.fill(testData.valid.zipCode);

    const nextButton = form.getByRole('button', { name: /next/i });
    
    
    await nextButton.click();

    const independenceCheckbox = form.getByText(/independence/i)  
    const safetyCheckbox = form.getByText(/safety/i)
    const therapyCheckbox = form.getByText(/therapy/i)
    const otherCheckbox = form.getByText(/other/i)

    // Wait for checkboxes to be visible before clicking (important for Firefox)
    await expect(independenceCheckbox).toBeVisible();
    await independenceCheckbox.check();
    await expect(safetyCheckbox).toBeVisible();
    await safetyCheckbox.check();
    await expect(therapyCheckbox).toBeVisible();
    await therapyCheckbox.check();
    await expect(otherCheckbox).toBeVisible();
    await otherCheckbox.check();

    // Verify checkboxes are selected
    await expect(independenceCheckbox).toBeChecked();
    await expect(safetyCheckbox).toBeChecked();
    await expect(therapyCheckbox).toBeChecked();
    await expect(otherCheckbox).toBeChecked();

    await nextButton.click();

    // Step 3: Select property type
    const ownedHouseOption = form.getByText(/owned house\s*\/\s*condo/i)
    const rentalPropertyOption = form.getByText(/rental property/i)
    const mobileHomeOption = form.getByText(/mobile home/i)

    await expect(ownedHouseOption).toBeEnabled();
    await expect(rentalPropertyOption).toBeEnabled();
    await expect(mobileHomeOption).toBeEnabled();

    await ownedHouseOption.check();
    await rentalPropertyOption.check();
    await mobileHomeOption.check();

    await expect(ownedHouseOption).not.toBeChecked();
    await expect(rentalPropertyOption).not.toBeChecked();
    await expect(mobileHomeOption).toBeChecked();

    await nextButton.click();

    // Step 4: Enter name and email (valid format)
    const nameInput = form.getByRole('textbox', { name: /name/i })
    const emailInput = form.getByRole('textbox', { name: /email/i })

    await expect(nameInput).toBeEnabled();
    await expect(emailInput).toBeEnabled();

    await nameInput.fill(testData.valid.name);
    await emailInput.fill(testData.valid.email);

    const goToEstimateButton = form.getByRole('button', { name: /go to estimate/i });
    await expect(goToEstimateButton).toBeEnabled();
    await goToEstimateButton.click();

    // Step 5: Enter phone number (exactly 10 digits)
    const phoneInput = form.locator('input[name="phone"]')

    await expect(phoneInput).toBeEnabled();
    // Use evaluate to set value and trigger all formatting events (works in all browsers)
    await phoneInput.evaluate((el: any, value: string) => {
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    }, testData.valid.phone);
    // Verify phone number was formatted correctly to (XXX)XXX-XXXX format
    await expect(phoneInput).toHaveValue(/^\(\d{3}\)\d{3}-\d{4}$/);
    
    const submitButton = form.getByRole('button', { name: /submit your request/i });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Verify redirect to Thank you page (requirement: must redirect after successful submission)
    // First verify URL - ensure redirect happened
    await expect(page).toHaveURL(/\/thankyou/i);
    
    // Then verify page content
    const thankYouHeading = page.locator('h1').filter({ hasText: /thank you/i });
    await expect(thankYouHeading).toBeVisible();
    await expect(thankYouHeading).toContainText(/thank you/i);
  });
});
