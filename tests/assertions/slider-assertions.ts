import { expect } from '@playwright/test';
import { SliderAssertionsLocators } from '../types/slider-locators';

/**
 * Slider assertion methods - handles all verification and expectation logic
 * Moved from pages/ folder as assertions are not part of Page Object Model
 */
export class SliderAssertions {
  constructor(private locators: SliderAssertionsLocators) {}

  /**
   * Verify that slider is visible
   */
  async expectSliderVisible(): Promise<void> {
    await expect(this.locators.slider).toBeVisible();
  }

  /**
   * Verify that navigation buttons (Previous and Next) are visible
   */
  async expectNavigationButtonsVisible(): Promise<void> {
    await expect(this.locators.prevButton).toBeVisible();
    await expect(this.locators.nextButton).toBeVisible();
  }

  /**
   * Verify that slide count matches expected value
   */
  async expectSlideCount(expectedCount: number): Promise<void> {
    const slideCount = await this.locators.slides.count();
    await expect(slideCount).toBe(expectedCount);
  }

  /**
   * Verify that active slide has the expected index
   */
  async expectActiveSlideIndex(expectedIndex: number): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    await expect(currentIndex).toBe(expectedIndex);
  }

  /**
   * Verify that all slide images are loaded and visible
   */
  async expectAllImagesLoaded(): Promise<void> {
    const slideCount = await this.locators.slides.count();
    
    for (let i = 0; i < slideCount; i++) {
      const slide = this.locators.slides.nth(i);
      const image = slide.locator('img');
      await expect(image).toBeVisible();
    }
  }

  /**
   * Wait for the expected slide to become active by checking:
   * 1. It has the correct data-slick-index attribute
   * 2. It has opacity: 1 (animation completed - active slide is fully visible)
   * 3. It has aria-hidden="false" (accessible state)
   * This replaces waitForTimeout() by waiting for actual animation completion
   */
  async waitForActiveIndex(expectedIndex: number): Promise<void> {
    const expectedSlide = this.locators.slider.locator(`[data-slick-index="${expectedIndex}"]`);
    
    // Wait for slide to have correct index and be fully visible (opacity: 1)
    await expect(expectedSlide).toHaveAttribute('data-slick-index', String(expectedIndex), { timeout: 10000 });
    await expect(expectedSlide).toHaveCSS('opacity', '1', { timeout: 10000 });
    await expect(expectedSlide).toHaveAttribute('aria-hidden', 'false', { timeout: 10000 });
  }

  /**
   * Get the active slide index
   */
  private async getActiveSlideIndex(): Promise<number> {
    const index = await this.locators.activeSlide.getAttribute('data-slick-index');
    return index ? parseInt(index, 10) : -1;
  }
}
