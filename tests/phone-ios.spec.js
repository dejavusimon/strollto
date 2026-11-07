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
test('phone: touch spots follow the finger (Touches on by default), and switch off', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?s=cabbagetown'); await page.waitForTimeout(600);
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
  await touch('touchStart', [{ x: 200, y: 500 }]); await touch('touchMove', [{ x: 210, y: 470 }]);
  const dot = await page.evaluate(() => { const d = document.querySelector('#touches .pg-dot'); return d ? d.style.transform : null; });
  expect(dot).toContain('210px');
  await touch('touchEnd', []); await page.waitForTimeout(500);
  expect(await page.locator('#touches .pg-dot').count()).toBe(0);
  await page.getByRole('switch', { name: 'Touches' }).click();
  await expect(page.locator('#touches')).toHaveCount(0);
  await ctx.close();
});
test('stop map: tapping a later stop asks to go there next, and the in-between stops are skipped', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./?s=cabbagetown'); await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(700);
  // find Stop 9 on the map and tap it
  const pos = await page.evaluate(() => { const t = [...document.querySelectorAll('.rmap-box text')].find(x => x.textContent.trim() === '9'); if (!t) return null; const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  expect(pos).not.toBeNull();
  await page.mouse.click(pos.x, pos.y); await page.waitForTimeout(600);
  await expect(page.getByRole('heading', { name: 'Go to Stop 9 directly?' })).toBeVisible();
  await expect(page.getByText(/Stops 2, 3, 4, 5, 6, 7 and 8 are marked skipped/)).toBeVisible();
  await page.getByRole('button', { name: 'Go to Stop 9' }).click(); await page.waitForTimeout(500);
  await expect(page.getByText(/to Stop 9/).first()).toBeVisible();
  await expect(page.getByText(/Turn right onto Lancaster Ave/).first()).toBeVisible();   // a real street route, not a straight line
});
test('plan choices: the chosen plan does not repeat its time and distance inside its button', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./?view=computer&page=stroll&stroll=cabbagetown'); await page.waitForTimeout(700);
  const all = page.getByRole('button', { name: /^All 10 stops/ });
  await expect(all).toHaveAttribute('aria-pressed', 'true');
  expect((await all.textContent()).trim()).toBe('All 10 stops');
  await expect(page.getByText('All 10 stops · ~46 min · ~3.6 km')).toBeVisible();
  await expect(page.locator('section[aria-labelledby="dphone"]').getByText('iPhone', { exact: true })).toBeVisible();
});
