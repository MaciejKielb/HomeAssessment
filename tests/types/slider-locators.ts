import { Locator } from '@playwright/test';

/**
 * Locator interfaces for slider component
 * Centralized type definitions for slider locators
 */

/**
 * Locators for slider actions (interactive elements)
 */
export interface SliderActionsLocators {
  prevButton: Locator;
  nextButton: Locator;
  slides: Locator;
  activeSlide: Locator;
}

/**
 * Locators for slider assertions (including verification elements)
 */
export interface SliderAssertionsLocators {
  slider: Locator;
  prevButton: Locator;
  nextButton: Locator;
  slides: Locator;
  activeSlide: Locator;
}
