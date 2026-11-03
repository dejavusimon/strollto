import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
test('phone map: no zoom buttons; Show where I am uses the phone location', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, geolocation: { latitude: 43.6677, longitude: -79.37, accuracy: 20 }, permissions: ['geolocation'] });
  const page = await ctx.newPage(); await page.goto('./?screen=map'); await start(page);
  await expect(page.getByRole('button', { name: 'Show where I am' })).toBeVisible();
  expect(await page.locator('.st-cmap-zoom').count()).toBe(0);
  await page.getByRole('button', { name: 'Show where I am' }).click();
  await expect(page.locator('.st-me')).toHaveCount(1);
  await ctx.close();
});
test('phone map: a blocked location says how to fix it', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?screen=map'); await start(page);
  await page.getByRole('button', { name: 'Show where I am' }).click();
  await expect(page.getByText(/Location is blocked|Couldn’t find/)).toBeVisible();
  await ctx.close();
});
test('website map: Show where I am uses the browser location', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1500, height: 1000 }, geolocation: { latitude: 43.6677, longitude: -79.37, accuracy: 1500 }, permissions: ['geolocation'] });
  const page = await ctx.newPage(); await page.goto('./?view=computer'); await start(page);
  await page.getByRole('button', { name: 'Map', exact: true }).first().click();
  await page.getByRole('button', { name: 'Show where I am' }).click();
  await expect(page.locator('.st-me')).toHaveCount(1);
  await expect(page.getByText(/approximate/)).toBeVisible();
  await ctx.close();
});
