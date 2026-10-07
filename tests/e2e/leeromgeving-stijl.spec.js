import { expect, test } from '@playwright/test';

// Meet de stijlgids op zoals Kevins bijlage (optie D) op 7 okt 2026 is opgemeten.
// Elke afwijking van de tabel in docs/LEEROMGEVING-STIJL.md is een fout.
test('de stijlgids heeft de maten van de bijlage', async ({ page }) => {
  await page.goto('/login/beheer');
  await page.getByRole('button', { name: /Als beheerder/i }).click();
  await expect(page).toHaveURL(/\/admin\/instellingen$/);
  await page.goto('/admin/stijlgids');

  const kaart = page.locator('[data-stijlgids="optie-d"] .lo-kaart');
  await expect(kaart).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const maten = await kaart.evaluate((el) => {
    const stijl = (selector) => {
      const node = selector ? el.querySelector(selector) : el;
      const s = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        font: s.fontFamily, size: s.fontSize, weight: s.fontWeight, lh: s.lineHeight, color: s.color,
        bg: s.backgroundColor, padding: s.padding, radius: s.borderTopLeftRadius,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`, height: Math.round(rect.height)
      };
    };
    return {
      kaart: stijl(null),
      titel: stijl('.lo-kaart-titel'),
      uitleg: stijl('.lo-kaart-uitleg'),
      lijst: stijl('.lo-lijst'),
      rij: stijl('.lo-rij'),
      hblok: stijl('.lo-hblok'),
      rijtitel: stijl('.lo-rij .lo-rij-titel'),
      onderregel: stijl('.lo-rij .lo-onderregel'),
      start: stijl('.lo-rij .lo-knop-start'),
      paragrafen: stijl('.lo-paragrafen'),
      paragraaftitel: stijl('.lo-paragraafrij .lo-rij-titel'),
      paragraafregel: stijl('.lo-paragraafrij .lo-onderregel'),
      startHier: stijl('.lo-paragraafrij .lo-knop-start'),
      label: stijl('.lo-label'),
      lettertypeGeladen: document.fonts.check('15px "Atkinson Hyperlegible Next Variable"')
    };
  });

  const grijs = 'rgb(91, 86, 72)';
  const inkt = 'rgb(11, 13, 15)';

  expect(maten.lettertypeGeladen).toBe(true);
  expect(maten.kaart.font).toContain('Atkinson Hyperlegible Next');
  expect(maten.kaart).toMatchObject({ size: '15px', bg: 'rgb(255, 255, 255)', padding: '22px', radius: '20px' });
  expect(maten.titel).toMatchObject({ size: '20px', weight: '800', lh: '30px', color: inkt });
  expect(maten.uitleg).toMatchObject({ size: '14px', weight: '400', lh: '21px', color: grijs });
  expect(maten.lijst).toMatchObject({ radius: '12px', border: '1px solid rgb(232, 220, 195)' });
  expect(maten.rij.padding).toBe('10px 12px');
  expect(maten.hblok).toMatchObject({ size: '13px', weight: '800', bg: 'rgb(255, 211, 61)', radius: '8px', border: `2px solid ${inkt}`, height: 30 });
  expect(maten.rijtitel).toMatchObject({ size: '15px', weight: '700', lh: '22.5px', color: inkt });
  expect(maten.onderregel).toMatchObject({ size: '12.5px', weight: '400', lh: '18.75px', color: grijs });
  expect(maten.start).toMatchObject({ size: '13px', weight: '800', padding: '6px 10px', radius: '8px', bg: 'rgb(225, 240, 248)', color: 'rgb(6, 106, 153)', height: 34 });
  expect(maten.paragrafen.padding).toBe('0px 12px 10px 52px');
  expect(maten.paragraaftitel).toMatchObject({ size: '15px', weight: '700' });
  expect(maten.paragraafregel).toMatchObject({ size: '12.5px', color: grijs });
  expect(maten.startHier).toMatchObject({ size: '13px', weight: '800', padding: '6px 10px', height: 34 });
  expect(maten.label).toMatchObject({ size: '12px', weight: '800', padding: '2px 9px' });
});
