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

test('de lespagina in de stijlgids heeft de vormen van de leeromgeving', async ({ page }) => {
  await page.goto('/login/beheer');
  await page.getByRole('button', { name: /Als beheerder/i }).click();
  await expect(page).toHaveURL(/\/admin\/instellingen$/);
  await page.goto('/admin/stijlgids');

  const sectie = page.locator('[data-stijlgids="lespagina"]');
  await expect(sectie).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const maten = await sectie.evaluate((el) => {
    const stijl = (selector) => {
      const node = el.querySelector(selector);
      const s = getComputedStyle(node);
      return {
        size: s.fontSize, weight: s.fontWeight, color: s.color, bg: s.backgroundColor, image: s.backgroundImage,
        radius: s.borderTopLeftRadius, padding: s.padding,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        height: Math.round(node.getBoundingClientRect().height)
      };
    };
    return {
      actiefNummer: stijl('.study-step-active .study-step-nummer'),
      gewoonNummer: stijl('li:last-child .study-step-nummer'),
      actieveStap: stijl('.study-step-active'),
      staptitel: stijl('.study-step-title'),
      blok: stijl('.study-block'),
      hoofdknop: stijl('.btn-primary'),
      leesknop: stijl('.helix-btn-solid'),
      tweede: stijl('.btn-secondary'),
      eyebrow: stijl('.helix-eyebrow'),
      invoer: stijl('.input-standard'),
      leestekst: stijl('.lesson-prose p')
    };
  });

  const inkt = 'rgb(11, 13, 15)';
  const blauw = 'rgb(8, 126, 181)';
  expect(maten.actiefNummer).toMatchObject({ bg: 'rgb(255, 211, 61)', border: `2px solid ${inkt}`, radius: '8px', height: 30, size: '13px', weight: '800' });
  expect(maten.gewoonNummer).toMatchObject({ bg: 'rgb(251, 235, 208)', border: '2px solid rgb(232, 220, 195)' });
  expect(maten.actieveStap.bg).toBe('rgb(255, 240, 184)');
  expect(maten.staptitel).toMatchObject({ size: '15px', weight: '700', color: inkt });
  expect(maten.blok).toMatchObject({ bg: 'rgb(255, 255, 255)', radius: '20px', padding: '22px' });
  expect(maten.blok.border.startsWith('0px')).toBe(true);
  expect(maten.hoofdknop).toMatchObject({ bg: blauw, radius: '12px', weight: '800' });
  expect(maten.leesknop).toMatchObject({ bg: blauw, image: 'none', radius: '12px', weight: '800' });
  expect(maten.tweede).toMatchObject({ bg: 'rgb(255, 255, 255)', border: '1px solid rgb(232, 220, 195)', color: inkt });
  expect(maten.eyebrow).toMatchObject({ size: '12px', weight: '800', color: 'rgb(6, 106, 153)' });
  expect(maten.invoer.border).toBe('1px solid rgb(232, 220, 195)');
  expect(maten.leestekst.color).toBe(inkt);
});

test('de beheer-stijl in de stijlgids: knoppen op één regel en de oude klassen in de nieuwe stijl', async ({ page }) => {
  await page.goto('/login/beheer');
  await page.getByRole('button', { name: /Als beheerder/i }).click();
  await expect(page).toHaveURL(/\/admin\/instellingen$/);
  await page.goto('/admin/stijlgids');

  const sectie = page.locator('[data-stijlgids="beheer"]');
  await expect(sectie).toBeVisible();
  await page.evaluate(() => document.fonts.ready);

  const maten = await sectie.evaluate((el) => {
    const stijl = (node) => {
      const s = getComputedStyle(node);
      return {
        bg: s.backgroundColor, radius: s.borderTopLeftRadius, whiteSpace: s.whiteSpace, transform: s.textTransform,
        border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
        borderTop: s.borderTopWidth,
        height: Math.round(node.getBoundingClientRect().height)
      };
    };
    const een = (selector) => stijl(el.querySelector(selector));
    return {
      balkknoppen: [...el.querySelectorAll('.lo-knoppenbalk .lo-knop-tweede')].map(stijl),
      oudeKnop: een('.btn-tool'),
      kaart: een('.helix-card'),
      badge: een('.helix-badge'),
      gevaar: een('.lo-knop--gevaar')
    };
  });

  expect(maten.balkknoppen.length).toBeGreaterThanOrEqual(7);
  for (const knop of maten.balkknoppen) {
    expect(knop.height).toBeLessThanOrEqual(40);
    expect(knop.whiteSpace).toBe('nowrap');
  }
  expect(maten.oudeKnop).toMatchObject({ border: '1px solid rgb(232, 220, 195)', whiteSpace: 'nowrap' });
  expect(maten.kaart).toMatchObject({ borderTop: '0px', radius: '20px', bg: 'rgb(255, 255, 255)' });
  expect(maten.badge.transform).toBe('none');
  expect(maten.gevaar.bg).toBe('rgb(180, 47, 37)');
});
