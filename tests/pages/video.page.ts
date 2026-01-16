import { Page, Locator } from '@playwright/test';
import { VideoAssertions } from '../assertions/video-assertions';

/**
 * Video Page Object Model
 * Handles video interactions and delegates assertions to VideoAssertions
 */
export class VideoPage {
  readonly page: Page;
  readonly videoElements: Locator;

  private readonly assertions: VideoAssertions;

  constructor(page: Page) {
    this.page = page;
    this.videoElements = page.locator('video');

    this.assertions = new VideoAssertions({
      videoElements: this.videoElements,
    });
  }

  /**
   * Get count of video elements on the page
   */
  async getVideoCount(): Promise<number> {
    return await this.videoElements.count();
  }

  /**
   * Verify that at least one video element exists on the page
   */
  async expectVideoCountGreaterThan(minCount: number): Promise<void> {
    return this.assertions.expectVideoCountGreaterThan(minCount);
  }

  /**
   * Verify that all video elements are visible
   */
  async expectAllVideosVisible(): Promise<void> {
    return this.assertions.expectAllVideosVisible();
  }
}

