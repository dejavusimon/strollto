import { test, expect } from '@playwright/test';

const btn = (page, name) => page.getByRole('button', { name, exact: true });
const noFonts = async (page) => page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.fulfill({ body: '' }));

test('computer: plan a stroll, get a real QR link, preview the phone', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await noFonts(page);
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('./?view=computer');
  await btn(page, 'Start').click();
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
  await btn(page, 'Skip this stop').click();
  await btn(page, 'Closed').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Skip this stop', exact: true }).click();
  for (let i = 0; i < 10 && !(await btn(page, 'Finish stroll').count()); i++) await btn(page, 'Next stop').click();
  await btn(page, 'Finish stroll').click();
  await expect(page.getByText('6 of 15')).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('phone: plain link shows the help, then Explore full screen', async ({ page }) => {
  await noFonts(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('#help-phone')).toBeVisible();
  await btn(page, 'Start').click();
  await expect(page.getByRole('heading', { name: /What do you enjoy/ })).toBeVisible();
  const box = await page.locator('#frame').boundingBox();
  expect(box.width).toBeGreaterThan(380);
});
