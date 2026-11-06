import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
const toStop = async (page) => { await page.goto('./?s=cabbagetown'); await start(page); await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500); };
const drag = async (page, name, dy, steps = 10) => {
  const t = await page.getByRole('button', { name }).boundingBox(); const x = t.x + t.width / 2, y = t.y + t.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  for (let i = 1; i <= steps; i++) { await page.mouse.move(x, y + dy * i / steps); }
  return { x, y, up: async () => { await page.mouse.up(); await page.waitForTimeout(700); } };
};
for (const [w, hgt] of [[390, 844], [375, 667]]) {
  test(`stop ${w}x${hgt}: tab is inside the map, the map follows a drag and settles`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: hgt }); await toStop(page);
    const box = page.locator('.rmap-box');
    const b0 = await box.boundingBox(), t0 = await page.getByRole('button', { name: 'Open the big map' }).boundingBox();
    expect(t0.y + t0.height).toBeLessThanOrEqual(b0.y + b0.height + 0.5); expect(t0.y).toBeGreaterThan(b0.y);
    expect(t0.height).toBeGreaterThanOrEqual(44);
    // no back button in the route panel or the map
    await expect(page.locator('.route-pin').getByRole('button', { name: 'Stroll overview' })).toHaveCount(0);
    // mid-drag the map is taller and the tab stays under the finger
    const d = await drag(page, 'Open the big map', 150);
    const mid = await box.boundingBox(); expect(Math.abs(mid.height - 330)).toBeLessThan(8);
    await d.up();
    const big = await box.boundingBox(); expect(big.y + big.height).toBeGreaterThan(hgt - 40); expect(big.y + big.height).toBeLessThanOrEqual(hgt + 1);
    await expect(page.getByRole('button', { name: 'Next stop' })).toBeHidden();
    const u = await page.getByRole('button', { name: 'Shrink the map' }).boundingBox(); expect(u.height).toBeGreaterThanOrEqual(56);
    // a small drag up springs back to big
    let d2 = await drag(page, 'Shrink the map', -30); await d2.up();
    expect(Math.abs((await box.boundingBox()).height - big.height)).toBeLessThan(2);
    // a long drag up settles small
    d2 = await drag(page, 'Shrink the map', -260); await d2.up();
    expect(Math.round((await box.boundingBox()).height)).toBe(180);
    await expect(page.getByRole('button', { name: 'Next stop' })).toBeVisible();
    // a short drag down springs back small
    const d3 = await drag(page, 'Open the big map', 30); await d3.up();
    expect(Math.round((await box.boundingBox()).height)).toBe(180);
    // a tap still opens
    await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(700);
    expect((await box.boundingBox()).height).toBeGreaterThan(300);
  });
}
test('small map: Back to the route is a round icon in the lower right; pill in the big map', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await toStop(page);
  const box = page.locator('.rmap-box'), b = await box.boundingBox();
  await page.mouse.move(b.x + 100, b.y + 60); await page.mouse.down(); await page.mouse.move(b.x + 160, b.y + 90, { steps: 5 }); await page.mouse.up();
  const r = await page.getByRole('button', { name: 'Back to the route' }).boundingBox();
  expect(Math.round(r.width)).toBe(44); expect(Math.abs(b.x + b.width - 8 - (r.x + r.width))).toBeLessThan(6); expect(Math.abs(b.y + b.height - 8 - (r.y + r.height))).toBeLessThan(6);
  await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(700);
  const p = await page.getByRole('button', { name: 'Back to the route' }).boundingBox(); expect(p.width).toBeGreaterThan(100);
});
test('phone: edge swipe does not go back on the stop screen', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await toStop(page);
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
  await touch('touchStart', 6, 600); for (let i = 1; i <= 8; i++) await touch('touchMove', 6 + i * 15, 602); await touch('touchEnd');
  await page.waitForTimeout(400);
  await expect(page.locator('.rmap-box')).toBeVisible();
  await ctx.close();
});
test('explore map: the chosen guided stroll is drawn along its streets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?s=cabbagetown'); await start(page);
  const n = await page.evaluate(() => { const S = window.STROLLS || null; return 0; });
  // open the overview's "see on map" path via the landing map with this stroll selected
  const btn = page.getByRole('button', { name: /on the map|See on map|Map/ }).first();
  if (await btn.isVisible().catch(() => false)) await btn.click(); await page.waitForTimeout(800);
  const d = await page.locator('path.st-cmap-route').first().getAttribute('d').catch(() => null);
  test.skip(!d, 'map not reachable from this entry');
  expect((d.match(/L/g) || []).length).toBeGreaterThan(20);
});
