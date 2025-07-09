import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000', // of Vercel preview URL
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
  },
});
