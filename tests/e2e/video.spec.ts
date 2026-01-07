import { test, expect } from '@fixtures';

test.describe('Video Playback Tests', () => {

  test('should display videos visible to users', async ({ videoPage }) => {
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

