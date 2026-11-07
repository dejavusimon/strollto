import { test, expect } from '@playwright/test';
const go = async (page, url = './?view=computer') => { await page.goto(url); await page.waitForTimeout(400); const b = page.getByRole('button', { name: 'Not now' }); if (await b.isVisible().catch(() => false)) await b.click(); };
test('website fills the window and has no drawn browser frame', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 }); await go(page);
  await expect(page.getByRole('group', { name: 'Browser buttons (prototype)' })).toHaveCount(0);
  await expect(page.locator('.pg-tag')).toHaveText('Prototype');
  await expect(page.locator('.pg-title')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'How to try it' })).toHaveCount(0);
  const wv = await page.locator('.wv').boundingBox(); expect(Math.round(wv.width)).toBe(1600); expect(wv.y + wv.height).toBeLessThanOrEqual(1001); expect(wv.y + wv.height).toBeGreaterThan(990);
});
test('real Back and Forward move between pages and close pop-ups; links reopen the page', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 }); await go(page);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Compare/ }).click(); await page.waitForTimeout(300);
  expect(page.url()).toContain('page=compare');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Map' }).click(); await page.waitForTimeout(300);
  expect(page.url()).toContain('page=map');
  await page.goBack(); await page.waitForTimeout(400);
  expect(page.url()).toContain('page=compare');
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /^Compare/ })).toHaveAttribute('aria-current', 'page');
  await page.goForward(); await page.waitForTimeout(400); expect(page.url()).toContain('page=map');
  await page.goBack(); await page.goBack(); await page.waitForTimeout(400); expect(page.url()).not.toContain('page=');
  // a stroll page and the Send to my phone pop-up
  await page.getByRole('button', { name: 'See this stroll' }).first().click(); await page.waitForTimeout(400);
  expect(page.url()).toMatch(/page=stroll&stroll=/);
  const strollUrl = page.url();
  await page.getByRole('button', { name: 'Send to my phone' }).first().click(); await page.waitForTimeout(300);
  expect(page.url()).toContain('pop=send');
  await page.goBack(); await page.waitForTimeout(400);
  expect(page.url()).toBe(strollUrl); await expect(page.getByRole('dialog')).toHaveCount(0);
  // reload keeps the page
  await page.reload(); await page.waitForTimeout(800);
  expect(page.url()).toBe(strollUrl); await expect(page.getByRole('heading', { name: 'Plan your walk' }).first()).toBeVisible();
});
test('compare link with strolls opens them', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 }); await go(page, './?view=computer&page=compare&a=cabbagetown&b=danforth');
  await page.waitForTimeout(400);
  expect(page.url()).toContain('a=cabbagetown&b=danforth');
  await expect(page.getByText('Two old cemeteries, a city farm and the Bucket of Blood').first()).toBeVisible();
});
test('Buddy switch: off by default; on greets (every opening while on); off removes the buddy', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 });
  await page.goto('./?view=computer'); await page.waitForTimeout(500);
  const sw = page.getByRole('switch', { name: 'Buddy' });
  await expect(sw).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toHaveCount(0);
  await expect(page.locator('.tour-buddy')).toHaveCount(0);
  await expect(page.getByRole('switch', { name: 'Touches' })).toBeHidden();   // phones only
  await sw.click();
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
  await page.reload(); await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
  await page.getByRole('switch', { name: 'Buddy' }).click(); await page.waitForTimeout(200);
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toHaveCount(0);
  await expect(page.locator('.tour-buddy')).toHaveCount(0);
});
test('website: answering a question moves Best match above Featured this week', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 }); await page.goto('./?view=computer'); await page.waitForTimeout(500);
  const y = async (id) => (await page.locator('#' + id).boundingBox()).y;
  expect(await y('dfeat')).toBeLessThan(await y('dbest'));
  await page.getByRole('button', { name: 'History', exact: true }).first().click(); await page.waitForTimeout(300);
  expect(await y('dbest')).toBeLessThan(await y('dfeat'));
});
