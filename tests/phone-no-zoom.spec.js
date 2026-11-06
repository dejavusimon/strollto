import { test, expect } from '@playwright/test';
test('phone: pinching the page never zooms it (on Explore, a stroll and a stop), the maps still pinch', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?s=cabbagetown&app=1'); await page.waitForTimeout(600);
  const cdp = await ctx.newCDPSession(page);
  const pinch = async (x, y) => { await cdp.send('Input.synthesizePinchGesture', { x, y, scaleFactor: 2.5, relativeSpeed: 600, gestureSourceType: 'touch' }); await page.waitForTimeout(300); return page.evaluate(() => window.visualViewport.scale); };
  expect(await pinch(195, 500)).toBe(1);
  const ta = await page.evaluate(() => getComputedStyle(document.querySelector('main')).touchAction);
  expect(ta).toBe('pan-x pan-y');
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(600);
  expect(await pinch(195, 650)).toBe(1);
  expect(await page.evaluate(() => getComputedStyle(document.querySelector('.rmap-box')).touchAction)).toBe('none');
  await ctx.close();
});
