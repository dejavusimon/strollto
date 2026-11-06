import { test, expect } from '@playwright/test';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
test('iPhone: no drawn edge-swipe arrow; the page history goes back', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, userAgent: UA });
  const page = await ctx.newPage(); await page.goto('./?s=cabbagetown'); await page.waitForTimeout(600);
  await expect(page.getByRole('button', { name: /Start stroll/ }).first()).toBeVisible();
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', 6, 400); for (let i = 1; i <= 8; i++) await touch('touchMove', 6 + i * 15, 402);
  const op = await page.evaluate(() => { const el = [...document.querySelectorAll('[aria-hidden="true"]')].find(x => x.style.marginLeft && x.style.top === '45%'); return el ? +el.style.opacity || 0 : 0; });
  await touch('touchEnd'); await page.waitForTimeout(300);
  expect(op).toBe(0);
  await expect(page.getByRole('button', { name: /Start stroll/ }).first()).toBeVisible();   // our swipe did nothing
  await page.goBack(); await page.waitForTimeout(500);                                       // the phone's own swipe-back
  await expect(page.getByRole('heading', { name: /What do you enjoy/ })).toBeVisible();
  await ctx.close();
});
test('phone turned sideways shows "Turn your phone upright"', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, userAgent: UA });
  const page = await ctx.newPage(); await page.goto('./?s=cabbagetown'); await page.waitForTimeout(500);
  await expect(page.getByText('Turn your phone upright')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
  await expect(page.getByText('Turn your phone upright')).toBeHidden();
  await ctx.close();
});
test('stop page: back button in the small map once the blue bar scrolls away, never in the big map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./?s=cabbagetown'); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
  const box = page.locator('.rmap-box');
  await expect(box.getByRole('button', { name: 'Stroll overview' })).toHaveCount(0);
  await page.evaluate(() => { const m = document.querySelector('.route-pin + main'); m.dispatchEvent(new Event('scroll')); m.scrollTop = 400; m.dispatchEvent(new Event('scroll')); });
  await page.waitForTimeout(600);
  await expect(box.getByRole('button', { name: 'Stroll overview' })).toBeVisible();
  const b = await box.boundingBox(), k = await box.getByRole('button', { name: 'Stroll overview' }).boundingBox();
  expect(k.x - b.x).toBeLessThan(14); expect(k.y - b.y).toBeLessThan(14);
  await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(700);
  await expect(box.getByRole('button', { name: 'Stroll overview' })).toHaveCount(0);
});
