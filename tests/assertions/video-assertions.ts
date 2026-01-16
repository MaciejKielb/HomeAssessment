import { expect } from '@playwright/test';
import { VideoAssertionsLocators } from '../types/video-locators';

/**
 * Video assertion methods - handles all verification and expectation logic
 * Moved from pages/ folder as assertions are not part of Page Object Model
 */
export class VideoAssertions {
  constructor(private locators: VideoAssertionsLocators) {}

  /**
   * Verify that at least one video element exists on the page
   */
  async expectVideoCountGreaterThan(minCount: number): Promise<void> {
    const videoCount = await this.locators.videoElements.count();
    await expect(videoCount).toBeGreaterThan(minCount);
  }

  /**
   * Verify that all video elements are visible
   */
  async expectAllVideosVisible(): Promise<void> {
    const videoCount = await this.locators.videoElements.count();
    
    for (let i = 0; i < videoCount; i++) {
      const video = this.locators.videoElements.nth(i);
      await expect(video).toBeVisible();
    }
  }
}
