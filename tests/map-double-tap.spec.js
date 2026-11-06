import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
const spread = (page) => page.evaluate(() => { const c = [...document.querySelectorAll('.st-cmap svg circle')].slice(0, 40).map(e => +e.getAttribute('cx')); return Math.max(...c) - Math.min(...c); });
test('phone map: double tap zooms in; double tap, hold and slide up/down zooms in/out', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?screen=map'); await start(page); await page.waitForTimeout(500);
  const b = await page.locator('.st-cmap svg').first().boundingBox(); const x = b.x + 200, y = b.y + 420;
  const tap = async () => { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.up(); };
  const s0 = await spread(page);
  await tap(); await page.waitForTimeout(80); await tap(); await page.waitForTimeout(300);
  const s1 = await spread(page); expect(s1).toBeGreaterThan(s0 * 1.3);
  await page.waitForTimeout(500);
  await tap(); await page.waitForTimeout(80); await page.mouse.down(); await page.mouse.move(x, y + 160, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300);
  const s2 = await spread(page); expect(s2).toBeLessThan(s1 * 0.8);
});
test('stop map: double tap zooms in', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?s=cabbagetown'); await start(page);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
  const b = await page.locator('.rmap-box').boundingBox(); const x = b.x + 150, y = b.y + 90;
  for (let i = 0; i < 2; i++) { await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(80); }
  await page.waitForTimeout(300);
  const k = await page.evaluate(() => +/scale\(([\d.]+)\)/.exec(document.querySelector('.rmap-pan').style.transform)[1]);
  expect(k).toBeCloseTo(2, 1);
});
