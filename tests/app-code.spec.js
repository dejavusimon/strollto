import { test, expect } from '@playwright/test';
test('website code opens the planned stroll in the installed phone app', async ({ browser }) => {
  const desk = await browser.newPage({ viewport: { width: 1500, height: 950 } });
  await desk.goto('./?view=computer&page=stroll&stroll=cabbagetown'); await desk.waitForTimeout(600);
  const cbs = desk.getByRole('checkbox'); const n = await cbs.count();
  if (n > 3) { await cbs.nth(2).click(); await desk.waitForTimeout(200); }
  await desk.getByRole('button', { name: 'Send to my phone' }).first().click(); await desk.waitForTimeout(300);
  const dlg = desk.getByRole('dialog', { name: 'Send to my phone' });
  await expect(dlg.getByText('StrollTO on an iPhone home screen?')).toBeVisible();
  await expect(dlg.getByText(/Temporary, for testing only/)).toBeVisible();
  const code = (await dlg.getByLabel(/^Code /).textContent()).trim();
  expect(code).toMatch(/^[2-9A-HJKMNP-Z]{4}$/);
  await desk.screenshot({ path: 'test-results/code-desk.png' });
  const ph = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await ph.goto('./?view=phone&app=1'); await ph.waitForTimeout(500);
  const s = ph.getByRole('button', { name: 'Start', exact: true }); if (await s.isVisible().catch(() => false)) await s.click();
  await ph.getByRole('button', { name: /Have a code from the website/ }).click();
  const inp = ph.getByRole('textbox', { name: 'Code' });
  await inp.click(); await ph.keyboard.type('ZZZZ'); await ph.getByRole('button', { name: 'Open', exact: true }).click();
  await expect(ph.getByText(/doesn’t match a stroll/)).toBeVisible();
  await inp.fill(''); await inp.click(); await ph.keyboard.type(code.toLowerCase()); await ph.screenshot({ path: 'test-results/code-phone.png' });
  await ph.getByRole('button', { name: 'Open', exact: true }).click(); await ph.waitForTimeout(500);
  await expect(ph.getByText('Two old cemeteries, a city farm and the Bucket of Blood').first()).toBeVisible();
  if (n > 3) await expect(ph.getByText(/9 of 10 stops|9 stops/).first()).toBeVisible();
});
test('the code button only shows in the installed app', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./?view=phone'); await page.waitForTimeout(500);
  await expect(page.getByRole('button', { name: /Have a code from the website/ })).toHaveCount(0);
});
