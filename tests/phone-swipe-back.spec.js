import { test, expect } from '@playwright/test';
test('phone: swiping in from the left edge goes back', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto('./?s=cabbagetown'); await page.waitForTimeout(500);
  const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click();
  await expect(page.getByRole('button', { name: /Start stroll/ }).first()).toBeVisible();
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', 6, 400); for (let i = 1; i <= 8; i++) await touch('touchMove', 6 + i * 15, 402); await touch('touchEnd');
  await expect(page.getByRole('heading', { name: /Find a stroll|Pick a stroll/ }).first()).toBeVisible();
  await ctx.close();
});
