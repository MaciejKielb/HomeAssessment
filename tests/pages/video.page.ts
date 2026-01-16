import { Page, Locator } from '@playwright/test';

export class VideoPage {
  readonly page: Page;
  readonly videoElements: Locator;

  constructor(page: Page) {
    this.page = page;
    this.videoElements = page.locator('video');
  }

  /**
   * Get count of video elements on the page
   */
  async getVideoCount(): Promise<number> {
    return await this.videoElements.count();
  }

  /**
   * Get a specific video by index
   */
  getVideoByIndex(index: number): Locator {
    return this.videoElements.nth(index);
  }
}

