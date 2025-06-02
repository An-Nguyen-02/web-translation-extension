import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test('Extension popup shows translated text after click', async ({ context }) => {
  // Load unpacked extension
  const extensionPath = path.join(__dirname, '..', 'extension');

  const userDataDir = path.join(__dirname, 'user-data');
  const extensionContext = await context.browser().launchPersistentContext(userDataDir, {
    headless: false, // Extensions need to run in full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ]
  });

  const [backgroundPage] = extensionContext.backgroundPages();
  const extensionId = backgroundPage.url().split('/')[2];
  const extensionPopup = `chrome-extension://${extensionId}/popup.html`;

  const page = await extensionContext.newPage();
  await page.goto(extensionPopup);

  // Click "Start"
  await page.click('#start');

  // Wait 3 seconds for WebSocket simulation
  await page.waitForTimeout(3100);

  // Assert content
  const originalText = await page.locator('#original').innerText();
  const translatedText = await page.locator('#translated').innerText();

  expect(originalText).toBe('Hello');
  expect(translatedText).toBe('Xin chào');

  await extensionContext.close();
});