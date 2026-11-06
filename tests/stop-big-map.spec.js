import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
for (const [w, hgt] of [[390, 844], [375, 667], [430, 932]]) {
  test(`stop page ${w}x${hgt}: one tap opens the big map to the bottom of the screen, one tap closes it`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: hgt });
    await page.goto('./?s=cabbagetown'); await start(page);
    await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
    const box = page.locator('.rmap-box');
    expect(Math.round((await box.boundingBox()).height)).toBe(180);
    await expect(page.getByRole('button', { name: 'Next stop' })).toBeVisible();
    // scroll the page first, as people do, then open
    await page.evaluate(() => { const m = [...document.querySelectorAll('main')].find(x => x.scrollHeight > x.clientHeight + 50); m.scrollTop = 300; m.dispatchEvent(new Event('scroll')); });
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Open the big map' }).click(); await page.waitForTimeout(700);
    const bx = await box.boundingBox(), frame = await page.locator('#frame').boundingBox().catch(() => null);
    const bottom = frame ? frame.y + frame.height : hgt;
    expect(bx.y + bx.height).toBeLessThanOrEqual(bottom + 1);
    expect(bx.y + bx.height).toBeGreaterThan(bottom - 40);
    await expect(page.getByRole('button', { name: 'Next stop' })).toBeHidden();
    const u = await page.getByRole('button', { name: 'Shrink the map' }).boundingBox();
    expect(u.y + u.height).toBeLessThanOrEqual(bottom); expect(Math.abs(u.x + u.width / 2 - (bx.x + bx.width / 2))).toBeLessThan(2);
    const g = await page.getByRole('button', { name: 'Show where I am' }).boundingBox(); expect(g.y + g.height).toBeLessThanOrEqual(bottom);
    // a scroll-ish event while big must not bring the blue bar back or push the map down
    await page.evaluate(() => { const m = document.querySelector('.route-pin + main'); m && m.dispatchEvent(new Event('scroll')); }); await page.waitForTimeout(300);
    const bx2 = await box.boundingBox(); expect(Math.abs(bx2.y - bx.y)).toBeLessThan(2);
    await page.getByRole('button', { name: 'Shrink the map' }).click(); await page.waitForTimeout(700);
    expect(Math.round((await box.boundingBox()).height)).toBe(180);
    await expect(page.getByRole('button', { name: 'Next stop' })).toBeVisible();
  });
}
