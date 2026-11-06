import { test, expect } from '@playwright/test';

const btn = (page, name) => page.getByRole('button', { name, exact: true });
const noFonts = async (page) => page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '' }));

test('computer: plan a stroll, get a real QR link, preview the phone', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await noFonts(page);
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('./?view=computer');
  // first visit: the walking buddy greets and points at the page; Skip ends the how-to
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
  await expect(page.locator('#help')).toBeHidden();
  await btn(page, 'Show me').click();
  await expect(page.locator('.wfind.tour-on')).toHaveCount(1);
  await btn(page, 'Next').click(); await btn(page, 'Next').click();
  await expect(page.locator('.tour-send.tour-on')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.tour-on')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /walking buddy|Send it to your phone/ })).toHaveCount(0);
  // How to try it (top bar) brings the buddy back
  await btn(page, 'How to try it').first().click();
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
  await btn(page, 'Not now').click();
  await btn(page, 'History').click();
  await btn(page, 'See this stroll').first().click();
  await expect(page.getByRole('heading', { name: 'Plan your walk' })).toBeVisible();
  await btn(page, 'Send to my phone').nth(1).click();
  const link = await page.locator('#qr-link').inputValue();
  expect(link).toMatch(/\?s=[a-z]+.*from=desktop/);
  const qr = page.locator('[aria-label^="QR code for http"]').last();
  await expect(qr).toBeVisible();
  await qr.click();
  await expect(page.getByText('This is what the phone shows after scanning')).toBeVisible();
  await btn(page, 'Start stroll').click();
  await expect(btn(page, 'Next stop')).toBeVisible();
  await btn(page, 'Back to the website').click();
  expect(errors).toEqual([]);
});

test('phone: a QR link opens the plan and the walk can be finished', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await noFonts(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./?s=danforth&skip=8,9,10,11,12,13,14,15&from=desktop');
  await expect(page.locator('#help')).toBeHidden();
  await expect(page.getByText(/Picked up from your computer, with your plan: 7 of 15 stops/)).toBeVisible();
  await btn(page, 'Start stroll').click();
  await btn(page, 'Next stop').click();
  // skipping is a press and hold on Next
  const nb = await btn(page, 'Next stop').boundingBox();
  await page.mouse.move(nb.x + nb.width / 2, nb.y + nb.height / 2); await page.mouse.down(); await page.waitForTimeout(800); await page.mouse.up();
  await btn(page, 'Closed').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Skip this stop', exact: true }).click();
  for (let i = 0; i < 24 && !(await btn(page, 'Finish stroll').count()); i++) await btn(page, 'Next stop').click();
  await btn(page, 'Finish stroll').click();
  if (await btn(page, 'Finish stroll').count()) await btn(page, 'Finish stroll').click();
  await expect(page.getByText('6 of 15')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('phone: plain link: the buddy greets once, points without covering, and the bar is slim', async ({ page }) => {
  await noFonts(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('#help')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
  expect((await page.locator('.pg-bar').boundingBox()).height).toBeLessThanOrEqual(44);
  await btn(page, 'Show me').click(); await page.waitForTimeout(700);
  for (const sel of ['.ptour-q', '.ptour-best', null, '.ptour-modes']) {
    if (sel) {
      await expect(page.locator(sel + '.tour-on')).toHaveCount(1);
      const t = await page.locator(sel).boundingBox(), b = await page.locator('.tour-bubble').boundingBox();
      const overlap = Math.min(t.y + t.height, b.y + b.height) - Math.max(t.y, b.y);
      expect(overlap).toBeLessThan(12);
    }
    await page.getByRole('button', { name: /^(Next|Done)$/ }).click(); await page.waitForTimeout(700);
  }
  await expect(page.locator('.tour-bubble')).toHaveCount(0);
  const box = await page.locator('#frame').boundingBox();
  expect(box.width).toBeGreaterThan(380);
  // second opening: no greeting
  await page.reload(); await page.waitForTimeout(600);
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toHaveCount(0);
  // How to try it brings it back
  await btn(page, 'How to try it').click();
  await expect(page.getByRole('heading', { name: 'Hi, I’m your walking buddy' })).toBeVisible();
});
test('phone: the system Back steps back inside the app', async ({ page }) => {
  await noFonts(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./'); await page.waitForTimeout(500);
  const nn = page.getByRole('button', { name: 'Not now' }); if (await nn.isVisible().catch(() => false)) await nn.click();
  await page.getByRole('button', { name: /See this stroll|Open/ }).first().click(); await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: /Start stroll/ }).first()).toBeVisible();
  await page.goBack(); await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: /What do you enjoy/ })).toBeVisible();
  expect(page.url()).toContain('localhost:4173');
});
