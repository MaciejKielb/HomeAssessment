import { Locator, Page } from '@playwright/test';

/**
 * Verifies that element remains visible for specified duration
 * Uses polling with interval to detect if element becomes hidden (bug detection)
 * 
 * @param page - Playwright Page object
 * @param locator - Locator of the element to check
 * @param duration - Total duration to verify (in milliseconds), default 1500ms
 * @param interval - Polling interval (in milliseconds), default 200ms
 * @throws Error if element becomes hidden during the verification period
 */
export async function verifyElementRemainsVisible(
  page: Page,
  locator: Locator,
  duration: number = 1500,
  interval: number = 200
): Promise<void> {
  const startTime = Date.now();
  const endTime = startTime + duration;

  while (Date.now() < endTime) {
    const isVisible = await locator.isVisible().catch(() => false);
    if (!isVisible) {
      throw new Error(
        `BUG DETECTED: Element became hidden during ${duration}ms wait period. Form proceeded when it should not.`
      );
    }
    await page.waitForTimeout(interval);
  }
}

