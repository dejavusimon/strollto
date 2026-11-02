import { test, expect } from '@playwright/test';
test('phone: map bars return after lifting, stop card, header follows the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?screen=map'); await page.waitForTimeout(700);
  const help = page.locator('#help-phone'); if (await help.isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(400); }
  const top = page.locator('.top-slide').first();
  const svg = page.locator('.st-cmap svg').first(); const box = await svg.boundingBox();

  // drag the map: bars hide, then return ~1 s after lifting, no tap
  await page.mouse.move(box.x + 200, box.y + 380); await page.mouse.down(); await page.mouse.move(box.x + 140, box.y + 460, { steps: 6 }); await page.waitForTimeout(350); await page.mouse.up();
  await page.waitForTimeout(300); const hidH = (await top.boundingBox()).height;
  await page.waitForTimeout(1400); const backH = (await top.boundingBox()).height;
  console.log('top bars while/after', hidH, backH); expect(hidH).toBeLessThan(5); expect(backH).toBeGreaterThan(80);
  // tap a stop: the stop card appears with the stroll below
  await page.goto('./?screen=map&sel=cabbagetown'); await page.waitForTimeout(700);
  if (await help.isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(400); }
  await page.evaluate(() => { const g = document.querySelectorAll('.st-cmap-stop')[2].parentNode; g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await page.waitForTimeout(500);
  await expect(page.getByText(/Stop 3 of \d+ on this stroll/)).toBeVisible();
  
  // overview: header follows the scroll distance
  await page.goto('./?s=guildwood'); await page.waitForTimeout(600);
  if (await help.isVisible().catch(() => false)) { await page.getByRole('button', { name: 'Start', exact: true }).click(); await page.waitForTimeout(400); }
  const main = page.locator('main').first(); const hdr = page.locator('.hdr-slide').first();
  const h0 = (await hdr.boundingBox()).height;
  await page.evaluate(() => { const m = [...document.querySelectorAll('main')].find(x => x.scrollHeight > x.clientHeight + 50); m.scrollTop = 10; m.dispatchEvent(new Event('scroll')); m.scrollTop = 30; m.dispatchEvent(new Event('scroll')); });
  await page.waitForTimeout(50); const h1 = (await hdr.boundingBox()).height;
  console.log('header', h0, '->', h1); expect(Math.round(h0 - h1)).toBe(20);
});
