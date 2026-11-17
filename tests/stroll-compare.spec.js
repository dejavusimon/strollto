import { test, expect } from '@playwright/test';
test('phone stroll page: Compare sits above Share stroll and opens List to pick a second stroll', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto('./?s=cabbagetown&from=switch'); await page.waitForTimeout(800);
  const cmp = page.getByRole('button', { name: 'Compare this stroll with another' });
  const share = page.getByRole('button', { name: 'Share stroll' });
  await expect(cmp).toBeVisible();
  const a = await cmp.boundingBox(), b = await share.boundingBox();
  expect(a.y + a.height).toBeLessThanOrEqual(b.y + 1);
  await cmp.click(); await page.waitForTimeout(700);
  await expect(page.locator('h2[aria-live]').first()).toHaveText(/Pick a stroll to compare/);
  await page.locator('.v2t[data-tile="westqueenwest"], [data-tile="westqueenwest"]').first().click(); await page.waitForTimeout(900);
  await expect(page.getByText('West Queen West').first()).toBeVisible();
  await expect(page.getByText('Cabbagetown').first()).toBeVisible();
  await ctx.close();
});
test('phone Explore: featured picks change every 8 seconds', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?view=phone'); await page.waitForTimeout(500);
  const idx = () => page.evaluate(() => [...document.querySelectorAll('[data-dot]')].findIndex(e => e.getAttribute('data-on') === '1'));
  const i0 = await idx(); await page.waitForTimeout(6000); const i1 = await idx(); await page.waitForTimeout(3000); const i2 = await idx();
  expect(i0).toBeGreaterThanOrEqual(0); expect(i1).toBe(i0); expect(i2).not.toBe(i0);
  await ctx.close();
});
