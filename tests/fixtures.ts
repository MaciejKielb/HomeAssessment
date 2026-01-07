import { test as base } from '@playwright/test';
import { WalkInBathFormPage } from '@pages/walk-in-bath-form.page';
import { SliderPage } from '@pages/slider.page';
import { VideoPage } from '@pages/video.page';

/**
 * Custom fixtures for Page Object Models
 * Extends base Playwright test with pre-initialized page objects
 * 
 * Note: All three fixtures navigate to the same page ('/'),
 * but we keep them separate for:
 * - Better test readability (tests get ready-to-use POM)
 * - Future flexibility (each POM might need different initialization)
 * - Consistency with Playwright fixture patterns
 */
type CustomFixtures = {
  /** Walk-In Bath Form page object - automatically initialized and navigated */
  formPage: WalkInBathFormPage;
  /** Slider page object - automatically initialized and navigated */
  sliderPage: SliderPage;
  /** Video page object - automatically initialized and navigated */
  videoPage: VideoPage;
};

export const test = base.extend<CustomFixtures>({
  /**
   * Walk-In Bath Form page object fixture
   * Automatically initializes and navigates to the form page
   */
  formPage: async ({ page }, use) => {
    const formPage = new WalkInBathFormPage(page);
    await formPage.goto();
    await use(formPage);
  },

  /**
   * Slider page object fixture
   * Automatically initializes and navigates to the slider page
   */
  sliderPage: async ({ page }, use) => {
    const sliderPage = new SliderPage(page);
    await sliderPage.goto();
    await use(sliderPage);
  },

  /**
   * Video page object fixture
   * Automatically initializes and navigates to the video page
   */
  videoPage: async ({ page }, use) => {
    const videoPage = new VideoPage(page);
    await videoPage.goto();
    await use(videoPage);
  },
});

export { expect } from '@playwright/test';

