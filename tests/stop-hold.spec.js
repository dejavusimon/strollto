import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
test('stop page: a first-time tip, and holding Next asks to skip the stop', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?s=guildwood'); await start(page);
  await page.getByRole('button', { name: /Start stroll/ }).first().click();
  await expect(page.getByText('Tip: press and hold the arrow to skip this stop.')).toBeVisible();
  const b = await page.getByRole('button', { name: 'Next stop' }).boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(800); await page.mouse.up();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('Tip: press and hold the arrow to skip this stop.')).toHaveCount(0);
});
test('station list: the A–Z index starts level with the first station', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?screen=map'); await start(page);
  await page.getByRole('button', { name: 'Start from a station' }).click(); await page.waitForTimeout(500);
  const [ix, row] = await page.evaluate(() => [document.querySelector('.az-ix').getBoundingClientRect().top, document.querySelector('li[id^="stn-"]').getBoundingClientRect().top + 10]);
  expect(Math.abs(ix - row)).toBeLessThan(3);
  await ctx.close();
});
