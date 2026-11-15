import { test, expect } from '@playwright/test';
const start = async (page) => { const s = page.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click(); };
for (const [w, hgt] of [[390, 844], [375, 667], [430, 932]]) {
  test(`stop page ${w}x${hgt}: at the stop one slim row, reading shows the stop name, walking shows the map and the next stop`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: hgt });
    await page.goto('./?s=cabbagetown'); await start(page);
    await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
    // at the stop: the next stop folds into one row; no map over the stop
    await expect(page.getByRole('heading', { name: 'You’re at Stop 1' })).toBeVisible();
    await expect(page.locator('.rp-slim')).toBeVisible();
    await expect(page.locator('.rmap-box')).toBeHidden();
    expect((await page.locator('.route-pin').boundingBox()).height).toBeLessThan(80);
    // reading: the row shows the stop name instead
    await page.evaluate(() => { const m = document.querySelector('main.stop-main'); m.scrollTop = 500; m.dispatchEvent(new Event('scroll')); });
    await page.waitForTimeout(400);
    await expect(page.locator('.rp-name')).toBeVisible(); await expect(page.locator('.rp-next')).toBeHidden();
    // walking: Walk to Stop 2 opens the map, directions and the next stop's preview
    await page.getByRole('button', { name: 'Walk to Stop 2', exact: true }).click(); await page.waitForTimeout(700);
    await expect(page.getByRole('heading', { name: 'Walking to Stop 2' })).toBeVisible();
    const card = await page.locator('.rp-walk').boundingBox(), map = await page.locator('.rmap-box').boundingBox();
    expect(map.height).toBeGreaterThan(200); expect(card.y + card.height).toBeLessThanOrEqual(hgt + 1);
    await expect(page.getByRole('button', { name: 'Skip Stop 2' })).toBeVisible();
    await page.getByRole('button', { name: 'I’m here' }).click(); await page.waitForTimeout(600);
    await expect(page.getByRole('heading', { name: 'You’re at Stop 2' })).toBeVisible();
  });
}
for (const [w, hgt] of [[375, 667], [360, 640], [320, 568]]) {
  test(`small phone ${w}x${hgt}: walking map keeps room, no duplicate buttons, card fits`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: hgt });
    await page.goto('./?s=cabbagetown'); await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
    await page.getByRole('button', { name: /^Walk to Stop 2: open/ }).click(); await page.waitForTimeout(800);
    const map = await page.locator('.rmap-box').boundingBox(), card = await page.locator('.rp-walk').boundingBox();
    expect(map.height).toBeGreaterThan(w > 330 ? 300 : 220);
    expect(map.y + map.height).toBeLessThanOrEqual(card.y + 2);           // the card never covers the map
    expect(card.y + card.height).toBeLessThanOrEqual(hgt + 1);
    await expect(page.locator('.float-hide')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Next stop', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'I’m here' })).toBeVisible();
  });
}
