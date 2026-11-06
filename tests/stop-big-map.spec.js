import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
test('stop page: the map opens to full screen and shrinks back', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?s=cabbagetown'); await start(page);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
  const box = page.locator('.rmap-box');
  expect(Math.round((await box.boundingBox()).height)).toBe(180);
  await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(600);
  const big = (await box.boundingBox()).height; expect(big).toBeGreaterThan(500);
  await expect(page.getByRole('button', { name: 'Next stop' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Show where I am' })).toBeVisible();
  const u = await page.getByRole('button', { name: 'Shrink the map' }).boundingBox(), bx = await box.boundingBox();
  expect(Math.abs(u.x + u.width / 2 - (bx.x + bx.width / 2))).toBeLessThan(2);
  // drag the pull-up tab: the map follows, then shrinks back
  const t = await page.getByRole('button', { name: 'Shrink the map' }).boundingBox();
  await page.mouse.move(t.x + t.width / 2, t.y + 10); await page.mouse.down(); await page.mouse.move(t.x + t.width / 2, t.y - 150, { steps: 6 });
  const mid = (await box.boundingBox()).height; expect(mid).toBeLessThan(big - 100);
  await page.mouse.up(); await page.waitForTimeout(600);
  expect(Math.round((await box.boundingBox()).height)).toBe(180);
  await expect(page.getByRole('button', { name: 'Next stop' })).toBeVisible();
  // drag the pull-down tab open
  const d = await page.getByRole('button', { name: 'Open the big map' }).boundingBox();
  await page.mouse.move(d.x + d.width / 2, d.y + 10); await page.mouse.down(); await page.mouse.move(d.x + d.width / 2, d.y + 160, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(600);
  expect((await box.boundingBox()).height).toBeGreaterThan(500);
});
