import { Page, Locator, expect } from '@playwright/test';

export class SliderPage {
  readonly page: Page;
  readonly slider: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly slides: Locator;
  readonly activeSlide: Locator;

  constructor(page: Page) {
    this.page = page;
    this.slider = page.locator('[data-main-slider]');
    this.prevButton = this.page.getByRole('button', { name: 'Previous' });
    this.nextButton = this.page.getByRole('button', { name: 'Next', exact: true });
    this.slides = this.slider.locator('[data-slick-index]');
    this.activeSlide = this.slider.locator('[data-slick-index].slick-active.slick-current');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('load');
    await this.slider.waitFor({ state: 'visible' });
  }

  async isSliderVisible(): Promise<boolean> {
    return await this.slider.isVisible();
  }

  async getSlideCount(): Promise<number> {
    return await this.slides.count();
  }

  async getActiveSlideIndex(): Promise<number> {
    const index = await this.activeSlide.getAttribute('data-slick-index');
    return index ? parseInt(index, 10) : -1;
  }

  private async waitForActiveIndex(expectedIndex: number): Promise<void> {
    await expect(this.activeSlide).toHaveAttribute('data-slick-index', String(expectedIndex));
  }

  async clickNext(): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    const slideCount = await this.getSlideCount();
    if (slideCount === 0) throw new Error('No slides available');
    const expectedIndex = (currentIndex + 1) % slideCount;

    await expect(this.nextButton).toBeVisible();
    await expect(this.nextButton).toBeEnabled();
    await this.nextButton.click();
    await this.page.waitForTimeout(600); // allow slider transition to settle
    await this.waitForActiveIndex(expectedIndex);
  }

  async clickPrevious(): Promise<void> {
    const currentIndex = await this.getActiveSlideIndex();
    const slideCount = await this.getSlideCount();
    if (slideCount === 0) throw new Error('No slides available');
    const expectedIndex = (currentIndex - 1 + slideCount) % slideCount;

    await expect(this.prevButton).toBeVisible();
    await expect(this.prevButton).toBeEnabled();
    await this.prevButton.click();
    await this.page.waitForTimeout(600); // allow slider transition to settle
    await this.waitForActiveIndex(expectedIndex);
  }

  async verifyNavigationButtonsVisible(): Promise<void> {
    await expect(this.prevButton).toBeVisible();
    await expect(this.nextButton).toBeVisible();
  }

  async verifyAllImagesLoaded(): Promise<void> {
    const slideCount = await this.getSlideCount();
    
    for (let i = 0; i < slideCount; i++) {
      const slide = this.slides.nth(i);
      const image = slide.locator('img');
      
      await expect(image).toBeVisible();
    }
  }

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

  async verifyCanNavigateThroughAllSlides(): Promise<void> {
    const slideCount = await this.getSlideCount();
    
    for (let i = 0; i < slideCount; i++) {
      await this.navigateToSlide(i);
    }
  }

  async verifyCircularNavigation(): Promise<void> {
    const slideCount = await this.getSlideCount();
    
    if (slideCount < 2) return;
    
    await this.navigateToSlide(0);
    
    for (let i = 0; i < slideCount; i++) {
      await this.clickNext();
    }
  }
}

