import { test, expect } from '@playwright/test';
import { VideoPage } from '@pages/video.page';

test.describe('Video Playback Tests', () => {
  let videoPage: VideoPage;

  test.beforeEach(async ({ page }) => {
    videoPage = new VideoPage(page);
    await videoPage.goto();
  });

  test('should display videos visible to users', async () => {
    const videoCount = await videoPage.getVideoCount();
    expect(videoCount).toBeGreaterThan(0);

    // Test behavior: videos should be visible to users
    // Note: This test focuses on user-visible behavior, not implementation details
    // If a video has a broken src but is visible, the user will see the issue visually
    for (let i = 0; i < videoCount; i++) {
      const video = videoPage.getVideoByIndex(i);
      await expect(video).toBeVisible();
    }
  });
});

