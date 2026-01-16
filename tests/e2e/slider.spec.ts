import { test, expect } from '@fixtures';

test.describe('Slider Tests', () => {

  test('should display slider with navigation buttons', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectSliderVisible();
    await sliderPage.expectNavigationButtonsVisible();
  });

  test('should have correct number of slides', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectSlideCount(8);
  });

  test('should load all slide images', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectAllImagesLoaded();
  });

  test('should navigate to next slide when clicking Next button', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectActiveSlideIndex(0);

    await sliderPage.clickNext();
    await sliderPage.expectActiveSlideIndex(1);
  });

  test('should navigate to previous slide when clicking Previous button', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.navigateToSlide(1);
    await sliderPage.clickPrevious();
    await sliderPage.expectActiveSlideIndex(0);
  });

  test('should navigate through all slides', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectCanNavigateThroughAllSlides();
  });

  test('should support circular navigation (wrap around)', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.expectCircularNavigation();
  });

  test('should navigate to specific slide by index', { tag: '@regression' }, async ({ sliderPage }) => {
    await sliderPage.navigateToSlide(3);
    await sliderPage.expectActiveSlideIndex(3);

    await sliderPage.navigateToSlide(0);
    await sliderPage.expectActiveSlideIndex(0);
  });
});

