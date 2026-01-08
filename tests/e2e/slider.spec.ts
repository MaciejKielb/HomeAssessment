import { test, expect } from '@fixtures';

test.describe('Slider Tests', () => {

  test('should display slider with navigation buttons', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.verifyNavigationButtonsVisible();
    expect(await sliderPage.isSliderVisible()).toBe(true);
  });

  test('should have correct number of slides', { tag: '@regression' }, async ({ sliderPage }) => {
    const slideCount = await sliderPage.getSlideCount();
    expect(slideCount).toBe(8);
  });

  test('should load all slide images', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.verifyAllImagesLoaded();
  });

  test('should navigate to next slide when clicking Next button', { tag: '@regression' }, async ({ sliderPage }) => {
    const initialIndex = await sliderPage.getActiveSlideIndex();
    expect(initialIndex).toBe(0);

    await sliderPage.clickNext();
    const newIndex = await sliderPage.getActiveSlideIndex();
    expect(newIndex).toBe(1);
  });

  test('should navigate to previous slide when clicking Previous button', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.navigateToSlide(1);
    await sliderPage.clickPrevious();
    const newIndex = await sliderPage.getActiveSlideIndex();
    expect(newIndex).toBe(0);
  });

  test('should navigate through all slides', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.verifyCanNavigateThroughAllSlides();
  });

  test('should support circular navigation (wrap around)', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.verifyCircularNavigation();
  });

  test('should navigate to specific slide by index', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.navigateToSlide(3);
    const currentIndex = await sliderPage.getActiveSlideIndex();
    expect(currentIndex).toBe(3);

    await sliderPage.navigateToSlide(0);
    const finalIndex = await sliderPage.getActiveSlideIndex();
    expect(finalIndex).toBe(0);
  });
});

