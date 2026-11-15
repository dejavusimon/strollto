import { test, expect } from '@playwright/test';
const toList = async (page) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./?view=phone'); await page.waitForTimeout(800);
  await page.getByRole('button', { name: 'List', exact: true }).click(); await page.waitForTimeout(500);
};
const head = (page) => page.locator('h2[aria-live]').first();
const sheet = (page) => page.locator('.v2flt-sheet');
test('list filters: Show applies, Clear all then close leaves no filter, close without Show changes nothing', async ({ page }) => {
  await toList(page);
  await expect(head(page)).toHaveText(/159 strolls/);
  // apply a filter
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('button', { name: 'Food' }).click();
  await sheet(page).getByRole('button', { name: /^Show 1 walk$/ }).click();
  await expect(head(page)).toHaveText(/1 of 159/);
  await expect(page.getByRole('button', { name: /^Filters, 1 on/ })).toBeVisible();
  // Clear all, then the close button: the list is unfiltered
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('button', { name: 'Clear all' }).click();
  await sheet(page).getByRole('button', { name: 'Close without changing the filters' }).click();
  await expect(sheet(page)).toHaveCount(0);
  await expect(head(page)).toHaveText(/159 strolls/);
  await expect(page.getByRole('button', { name: 'Filters', exact: true })).toBeVisible();
  // Clear all, then tapping outside the sheet: still unfiltered
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('button', { name: 'Art' }).click();
  await sheet(page).getByRole('button', { name: /^Show \d+ walks?$/ }).click();
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('button', { name: 'Clear all' }).click();
  await page.mouse.click(195, 60);
  await expect(sheet(page)).toHaveCount(0);
  await expect(head(page)).toHaveText(/159 strolls/);
  // picking without Show, then closing: nothing changes
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('button', { name: 'Under 1 hr' }).click();
  await sheet(page).getByRole('button', { name: 'Close without changing the filters' }).click();
  await expect(head(page)).toHaveText(/159 strolls/);
  // the sheet reopens showing what is applied
  await page.getByRole('button', { name: /^Filters/ }).click();
  await expect(sheet(page).getByRole('button', { name: 'Under 1 hr' })).toHaveAttribute('aria-pressed', 'false');
  await expect(sheet(page).getByRole('button', { name: 'Any' }).first()).toHaveAttribute('aria-pressed', 'true');
});
test('list filters: Hide walks I’ve finished hides walks with the green check', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('strollto.prototype.v3.b25', JSON.stringify({ history: [{ strollId: 'cabbagetown', at: 1 }] })); } catch (e) {} });
  await toList(page);
  await expect(page.locator('[data-tile="cabbagetown"] .v2t-done')).toHaveCount(1);
  await page.getByRole('button', { name: /^Filters/ }).click();
  await sheet(page).getByRole('switch', { name: /Hide walks I’ve finished/ }).click();
  await sheet(page).getByRole('button', { name: /^Show 158 walks$/ }).click();
  await expect(page.locator('[data-tile="cabbagetown"]')).toHaveCount(0);
});
