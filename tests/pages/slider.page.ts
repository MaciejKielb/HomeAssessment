import { Page, Locator } from '@playwright/test';
import { SliderActions } from './slider-actions';
import { SliderAssertions } from '../assertions/slider-assertions';
import { SliderActionsLocators, SliderAssertionsLocators } from '../types/slider-locators';

/**
 * Slider Page Object Model
 * Orchestrates slider interactions by delegating to specialized modules
 */
export class SliderPage {
  readonly page: Page;
  readonly slider: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly slides: Locator;
  readonly activeSlide: Locator;

  private readonly actions: SliderActions;
  private readonly assertions: SliderAssertions;

  constructor(page: Page) {
    this.page = page;
    this.slider = page.locator('[data-main-slider]');
    this.prevButton = this.page.getByRole('button', { name: 'Previous' });
    this.nextButton = this.page.getByRole('button', { name: 'Next', exact: true });
    this.slides = this.slider.locator('[data-slick-index]');
    this.activeSlide = this.slider.locator('[data-slick-index].slick-active.slick-current');

    const actionsLocators: SliderActionsLocators = {
      prevButton: this.prevButton,
      nextButton: this.nextButton,
      slides: this.slides,
      activeSlide: this.activeSlide,
    };

    const assertionsLocators: SliderAssertionsLocators = {
      slider: this.slider,
      prevButton: this.prevButton,
      nextButton: this.nextButton,
      slides: this.slides,
      activeSlide: this.activeSlide,
    };

    this.assertions = new SliderAssertions(assertionsLocators);
    this.actions = new SliderActions(actionsLocators, this.assertions);
  }

  /**
   * Verify that slider is visible
   */
  async expectSliderVisible(): Promise<void> {
    return this.assertions.expectSliderVisible();
  }

  /**
   * Verify that navigation buttons are visible
   */
  async expectNavigationButtonsVisible(): Promise<void> {
    return this.assertions.expectNavigationButtonsVisible();
  }

  /**
   * Verify that slide count matches expected value
   */
  async expectSlideCount(expectedCount: number): Promise<void> {
    return this.assertions.expectSlideCount(expectedCount);
  }

  /**
   * Verify that active slide has the expected index
   */
  async expectActiveSlideIndex(expectedIndex: number): Promise<void> {
    return this.assertions.expectActiveSlideIndex(expectedIndex);
  }

  /**
   * Verify that all slide images are loaded
   */
  async expectAllImagesLoaded(): Promise<void> {
    return this.assertions.expectAllImagesLoaded();
  }

  // ============================================================================
  // Action Methods (delegated to SliderActions)
  // ============================================================================

  /**
   * Get the total number of slides
   */
  async getSlideCount(): Promise<number> {
    return this.actions.getSlideCount();
  }

  /**
   * Get the index of the currently active slide
   */
  async getActiveSlideIndex(): Promise<number> {
    return this.actions.getActiveSlideIndex();
  }

  /**
   * Click the Next button to navigate to the next slide
   */
  async clickNext(): Promise<void> {
    return this.actions.clickNext();
  }

  /**
   * Click the Previous button to navigate to the previous slide
   */
  async clickPrevious(): Promise<void> {
    return this.actions.clickPrevious();
  }

  /**
   * Navigate to a specific slide by index
   */
  async navigateToSlide(targetIndex: number): Promise<void> {
    return this.actions.navigateToSlide(targetIndex);
  }

  /**
   * Verify that slider can navigate through all slides
   * This method performs navigation actions and verifies the result
   */
  async expectCanNavigateThroughAllSlides(): Promise<void> {
    const slideCount = await this.getSlideCount();
    
    for (let i = 0; i < slideCount; i++) {
      await this.navigateToSlide(i);
      // Verify we're on the correct slide
      await this.expectActiveSlideIndex(i);
    }
  }

  /**
   * Verify that slider supports circular navigation (wraps around)
   * This method performs navigation actions and verifies the result
   */
  async expectCircularNavigation(): Promise<void> {
    const slideCount = await this.getSlideCount();
    
    if (slideCount < 2) return;
    
    await this.navigateToSlide(0);
    
    // Navigate through all slides and verify we wrap around
    for (let i = 0; i < slideCount; i++) {
      await this.clickNext();
      const expectedIndex = (i + 1) % slideCount;
      await this.expectActiveSlideIndex(expectedIndex);
    }
  }
}

