import { test, expect } from '@playwright/test';
test('website map: a trackpad pinch zooms the map, not the page', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('./?view=computer'); await page.waitForTimeout(400); { const k = page.getByRole('button', { name: 'Not now' }); if (await k.isVisible().catch(() => false)) await k.click(); }
  const mapBtn = page.getByRole('button', { name: 'Map', exact: true }).first(); await mapBtn.click(); await page.waitForTimeout(600);
  const svg = page.locator('.st-cmap svg').first(); const b = await svg.boundingBox();
  const prevented = await svg.evaluate((el, a) => { const ev = new WheelEvent('wheel', { deltaY: -40, ctrlKey: true, clientX: a.x, clientY: a.y, bubbles: true, cancelable: true }); el.dispatchEvent(ev); return ev.defaultPrevented; }, { x: b.x + b.width / 2, y: b.y + b.height / 2 });
  expect(prevented).toBe(true);
  const outside = await page.evaluate(() => { const ev = new WheelEvent('wheel', { deltaY: -40, ctrlKey: true, bubbles: true, cancelable: true }); document.body.dispatchEvent(ev); return ev.defaultPrevented; });
  expect(outside).toBe(false);
});

test('website map: clicking a stop shows it on the card', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('./?view=computer'); await page.waitForTimeout(400); { const k = page.getByRole('button', { name: 'Not now' }); if (await k.isVisible().catch(() => false)) await k.click(); }
  await page.getByRole('button', { name: 'Map', exact: true }).first().click(); await page.waitForTimeout(500);
  await page.locator('.st-cmap-hit').first().dispatchEvent('click'); await page.waitForTimeout(500);
  await page.evaluate(() => { const g = document.querySelectorAll('.st-cmap-stop')[1].parentNode; g.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
  await page.waitForTimeout(400);
  await expect(page.getByText(/Stop 2 of \d+ on this stroll/)).toBeVisible();
});
