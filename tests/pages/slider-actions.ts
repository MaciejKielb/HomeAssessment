import { expect } from '@playwright/test';
import { SliderActionsLocators } from '../types/slider-locators';
import { SliderAssertions } from '../assertions/slider-assertions';

/**
 * Slider action methods - handles all user interactions with slider elements
 */
export class SliderActions {
  constructor(
    private locators: SliderActionsLocators,
    private assertions: SliderAssertions,
  ) {}

  /**
   * Get the slide count
   */
  async getSlideCount(): Promise<number> {
    return await this.locators.slides.count();
  }

  /**
   * Get the active slide index
   */
  async getActiveSlideIndex(): Promise<number> {
    const index = await this.locators.activeSlide.getAttribute('data-slick-index');
    return index ? parseInt(index, 10) : -1;
  }

  /**
   * Click the Next button and wait for transition to complete
   */
  async clickNext(): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    const slideCount = await this.getSlideCount();
    if (slideCount === 0) throw new Error('No slides available');
    const expectedIndex = (currentIndex + 1) % slideCount;

    await expect(this.locators.nextButton).toBeEnabled();
    await this.locators.nextButton.click();
    // Wait for slider transition to complete by checking opacity and aria-hidden changes
    // This replaces waitForTimeout() antipattern - we wait for actual animation completion
    await this.assertions.waitForActiveIndex(expectedIndex);
  }

  /**
   * Click the Previous button and wait for transition to complete
   */
  async clickPrevious(): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    const slideCount = await this.getSlideCount();
    if (slideCount === 0) throw new Error('No slides available');
    const expectedIndex = (currentIndex - 1 + slideCount) % slideCount;

    await expect(this.locators.prevButton).toBeEnabled();
    await this.locators.prevButton.click();
    // Wait for slider transition to complete by checking opacity and aria-hidden changes
    // This replaces waitForTimeout() antipattern - we wait for actual animation completion
    await this.assertions.waitForActiveIndex(expectedIndex);
  }

  /**
   * Navigate to a specific slide by index
   */
  async navigateToSlide(targetIndex: number): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    const slideCount = await this.getSlideCount();
    
    if (targetIndex < 0 || targetIndex >= slideCount) {
      throw new Error(`Target slide index ${targetIndex} is out of range (0-${slideCount - 1})`);
    }
    
    const steps = targetIndex - currentIndex;
    
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        await this.clickNext();
      }
    } else if (steps < 0) {
      for (let i = 0; i < Math.abs(steps); i++) {
        await this.clickPrevious();
      }
    }
  }
}
