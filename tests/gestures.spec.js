import { test, expect } from '@playwright/test';
test('phone map: pinch zooms, handle swipe opens the drawer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?screen=map');
  await page.waitForTimeout(600);
  const svg = page.locator('.st-cmap svg').first();
  const box = await svg.boundingBox();
  const ids = async () => page.evaluate(() => [...document.querySelectorAll('.st-cmap text')].length);
  const pos = async () => page.evaluate(() => { const c = document.querySelector('.st-cmap .st-cmap-mini, .st-cmap circle'); return c ? [c.getAttribute('cx'), c.getAttribute('cy')] : null; });
  const before = await pos(); const nb = await ids();
  const cx = box.x + box.width / 2, cy = box.y + 250;
  await svg.evaluate((el, a) => {
    const ev = (t, id, x, y) => el.dispatchEvent(new PointerEvent(t, { pointerId: id, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, isPrimary: id === 1 }));
    ev('pointerdown', 1, a.cx - 20, a.cy); ev('pointerdown', 2, a.cx + 20, a.cy);
    for (let i = 1; i <= 10; i++) { ev('pointermove', 1, a.cx - 20 - i * 10, a.cy); ev('pointermove', 2, a.cx + 20 + i * 10, a.cy); }
    ev('pointerup', 1, a.cx - 120, a.cy); ev('pointerup', 2, a.cx + 120, a.cy);
  }, { cx, cy });
  await page.waitForTimeout(300);
  const after = await pos(); const na = await ids();

  expect(JSON.stringify(after)).not.toEqual(JSON.stringify(before));
  // tap brings the drawer back, then swipe up on the handle
  await page.mouse.click(cx, box.y + 300); await page.waitForTimeout(400);
  const sheet = page.locator('section[aria-label="Strolls on the map"]');
  const h0 = (await sheet.boundingBox()).height;
  const hb = await page.locator('.sheet-grab').boundingBox();
  await page.locator('.sheet-grab').evaluate((el) => {
    const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
    const ev = (t, yy) => el.dispatchEvent(new PointerEvent(t, { pointerId: 7, pointerType: 'touch', clientX: x, clientY: yy, bubbles: true }));
    ev('pointerdown', y); ev('pointermove', y - 10); ev('pointermove', y - 40); ev('pointerup', y - 40);
  });
  await page.waitForTimeout(500);
  const h1 = (await sheet.boundingBox()).height;
  expect(h1).toBeGreaterThan(h0 + 100);
  await page.locator('.sheet-grab').evaluate((el) => {
    const r = el.getBoundingClientRect(), x = r.x + r.width / 2, y = r.y + r.height / 2;
    const ev = (t, yy) => el.dispatchEvent(new PointerEvent(t, { pointerId: 8, pointerType: 'touch', clientX: x, clientY: yy, bubbles: true }));
    ev('pointerdown', y); ev('pointermove', y + 40); ev('pointerup', y + 40);
  });
  await page.waitForTimeout(500);
  const h2 = (await sheet.boundingBox()).height;
  expect(h2).toBeLessThan(h1 - 100);
});
