import { test, expect } from '@fixtures';

test.describe('Video Playback Tests', () => {

  test('should display videos visible to users', { tag: '@regression' }, async ({ videoPage }) => {
    // Test behavior: videos should be visible to users
    // Note: This test focuses on user-visible behavior, not implementation details
    // If a video has a broken src but is visible, the user will see the issue visually
    await videoPage.expectVideoCountGreaterThan(0);
    await videoPage.expectAllVideosVisible();
  });
});

