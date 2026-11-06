import { test, expect } from '@playwright/test';

test('phone map: station mode, A–Z index, drawer covers the map buttons', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?screen=map'); await page.waitForTimeout(500);
  const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click();
  await page.getByRole('button', { name: 'Start from a station' }).click(); await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: 'Layers' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Show where I am/ })).toHaveCount(0);
  expect(await page.getByRole('button', { name: 'Start from a station' }).evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(230, 235, 245)');
  await page.getByRole('button', { name: 'Stations starting with S' }).click(); await page.waitForTimeout(500);
  await expect(page.locator('#stn-S')).toBeInViewport();
  await ctx.close();
});
