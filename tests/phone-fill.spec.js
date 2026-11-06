import { test, expect } from '@playwright/test';
const bottomOf = async (page, name) => { const b = await page.getByRole('button', { name }).first().boundingBox(); return b.y + b.height; };
test('phone: the app fills to the bottom edge and survives a shrink and regrow (keyboard / turn)', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.goto('./?s=cabbagetown&app=1'); await page.waitForTimeout(600);
  await page.getByRole('button', { name: /Start stroll/ }).first().click(); await page.waitForTimeout(600);
  const check = async (H) => {
    const fr = await page.evaluate(() => { let el = document.querySelector('#frame').firstElementChild; while (el && el.getBoundingClientRect().height === 0) el = el.firstElementChild; const r = el.getBoundingClientRect(); return { y: r.y, height: r.height }; });
    expect(Math.abs(fr.y + fr.height - H)).toBeLessThan(2);           // no strip under the app
    const nb = await bottomOf(page, 'Next stop'); expect(nb).toBeLessThanOrEqual(H); expect(nb).toBeGreaterThan(H - 90); // on screen, near the bottom
  };
  await check(844);
  await page.setViewportSize({ width: 390, height: 520 }); await page.waitForTimeout(500); await check(520);   // keyboard-like shrink
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(500); await check(844);   // and back
  await page.setViewportSize({ width: 844, height: 390 }); await page.waitForTimeout(400);
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(600); await check(844);   // turned and back
  await ctx.close();
});
