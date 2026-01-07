import { test, expect } from '@playwright/test';
import { SliderPage } from '@pages/slider.page';

test.describe('Slider Tests', () => {
  let sliderPage: SliderPage;

  test.beforeEach(async ({ page }) => {
    sliderPage = new SliderPage(page);
    await sliderPage.goto();
  });

  test('should display slider with navigation buttons', async () => {
    await sliderPage.verifyNavigationButtonsVisible();
    expect(await sliderPage.isSliderVisible()).toBe(true);
  });

  test('should have correct number of slides', async () => {
    const slideCount = await sliderPage.getSlideCount();
    expect(slideCount).toBe(8);
  });

  test('should load all slide images', async () => {
    await sliderPage.verifyAllImagesLoaded();
  });

  test('should navigate to next slide when clicking Next button', async () => {
    const initialIndex = await sliderPage.getActiveSlideIndex();
    expect(initialIndex).toBe(0);

    await sliderPage.clickNext();
    const newIndex = await sliderPage.getActiveSlideIndex();
    expect(newIndex).toBe(1);
  });

  test('should navigate to previous slide when clicking Previous button', async () => {
    await sliderPage.navigateToSlide(1);
    await sliderPage.clickPrevious();
    const newIndex = await sliderPage.getActiveSlideIndex();
    expect(newIndex).toBe(0);
  });

  test('should navigate through all slides', async () => {
    await sliderPage.verifyCanNavigateThroughAllSlides();
  });

  test('should support circular navigation (wrap around)', async () => {
    await sliderPage.verifyCircularNavigation();
  });

  test('should navigate to specific slide by index', async () => {
    await sliderPage.navigateToSlide(3);
    const currentIndex = await sliderPage.getActiveSlideIndex();
    expect(currentIndex).toBe(3);

    await sliderPage.navigateToSlide(0);
    const finalIndex = await sliderPage.getActiveSlideIndex();
    expect(finalIndex).toBe(0);
  });
});

