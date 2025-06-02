// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 10000,
  use: {
    headless: false, // for debugging, can turn on in CI
    viewport: { width: 800, height: 600 },
  },
});