import { test, expect } from '@playwright/test';
test('computer: the Website | Phone switch opens the drawn phone and comes back, keeping the open stroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./?view=computer&page=stroll&stroll=cabbagetown'); await page.waitForTimeout(600);
  const sw = page.getByRole('group', { name: 'Show the prototype as' });
  await expect(sw.getByRole('button', { name: 'Website' })).toHaveAttribute('aria-pressed', 'true');
  await sw.getByRole('button', { name: 'Phone' }).click();
  await expect(page).toHaveURL(/view=phone&s=cabbagetown&from=switch/);
  await expect(page.getByRole('button', { name: /Start stroll/ }).first()).toBeVisible();
  await expect(page.getByText('Shared with you')).toHaveCount(0);
  await expect(sw.getByRole('button', { name: 'Phone' })).toHaveAttribute('aria-pressed', 'true');
  await sw.getByRole('button', { name: 'Website' }).click();
  await expect(page).toHaveURL(/view=computer&page=stroll&stroll=cabbagetown/);
});
test('computer: the drawn phone works with a mouse (drag the match cards, wheel to scroll, hold to skip)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./?view=phone'); await page.waitForTimeout(800);
  for (let i = 0; i < 3; i++) { const n = page.getByRole('button', { name: /^(Next|See my matches)$/ }).first(); if (await n.isVisible().catch(() => false)) { await n.click(); await page.waitForTimeout(500); } }
  const top = () => page.$$eval('.v2dk', els => els.filter(e => e.getAttribute('aria-hidden') === 'false').map(e => e.querySelector('.v2dk-count').textContent).join());
  await expect.poll(top).toBe('1 of 10');
  const d = await page.locator('.v2dk-deck').boundingBox();
  await page.mouse.move(d.x + d.width - 80, d.y + 200); await page.mouse.down(); await page.mouse.move(d.x + 40, d.y + 205, { steps: 10 }); await page.mouse.up();
  await expect.poll(top).toBe('2 of 10');
  await page.mouse.move(d.x + 100, d.y + 100); await page.mouse.wheel(0, 300);
  await expect.poll(() => page.locator('main.v2pb').first().evaluate(m => m.scrollTop)).toBeGreaterThan(100);
  await page.goto('./?view=phone&s=cabbagetown&from=switch'); await page.waitForTimeout(600);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(500);
  const nb = await page.getByRole('button', { name: 'Walk to Stop 2', exact: true }).boundingBox();
  await page.mouse.move(nb.x + 20, nb.y + 20); await page.mouse.down(); await page.waitForTimeout(1400); await page.mouse.up();
  await expect(page.getByRole('dialog')).toHaveCount(1);
});
test('phone: no Website | Phone switch on a phone screen', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); await p.goto('./'); await p.waitForTimeout(500);
  await expect(p.locator('.pg-views')).toBeHidden();
  await ctx.close();
});
