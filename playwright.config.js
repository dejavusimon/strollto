import { defineConfig, devices } from '@playwright/test';

// End-to-end checks against the production build (npm run build first, or use npm run check).
// First time on a new computer: npx playwright install chromium
export default defineConfig({
  testDir: 'tests',
  testMatch: /.*\.spec\.js/,
  timeout: 60_000,
  use: { baseURL: 'http://localhost:4173/' },
  webServer: { command: 'npx vite preview --port 4173 --strictPort', url: 'http://localhost:4173/', reuseExistingServer: true, timeout: 60_000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
