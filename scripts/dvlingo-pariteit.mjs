// Pariteitsbank voor DVLingo: legt de standalone bron en de geintegreerde
// versie op exact dezelfde viewport vast, scherm voor scherm.
//
//   node scripts/dvlingo-pariteit.mjs
//
// Verwacht twee draaiende servers:
//   8124  python -m http.server 8124 --directory dvlingo_startbestanden
//   5173  npm run dev   (de geintegreerde kopie in public/games/dvlingo/v1)
//
// De beelden komen in exports/dvlingo-pariteit/ met gelijke namen, zodat ze
// blind naast elkaar te leggen zijn.
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const VERSIES = [
  { naam: 'bron', url: 'http://localhost:8124/index.html' },
  { naam: 'helix', url: 'http://localhost:5173/games/dvlingo/v1/index.html' }
];

const MATEN = [
  { naam: 'desktop', breedte: 1280, hoogte: 800 },
  { naam: 'mobiel', breedte: 390, hoogte: 844 }
];

const MAP = 'exports/dvlingo-pariteit';

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

// Speelt zover door dat elk scherm een keer in beeld is geweest. Gebruikt
// alleen de publieke DVL-API en echte knoppen, net als een leerling.
const legScherm = async (page, versie, maat, stap) => {
  await page.screenshot({ path: `${MAP}/${maat}-${stap}-${versie}.png` });
};

const klik = async (page, patroon) => {
  const knop = page.locator('button', { hasText: patroon }).first();
  if (await knop.count()) {
    await knop.click({ force: true });
    return true;
  }
  return false;
};

const run = async () => {
  await mkdir(MAP, { recursive: true });
  const browser = await chromium.launch();
  const gemeten = [];

  for (const maat of MATEN) {
    for (const versie of VERSIES) {
      const context = await browser.newContext({
        viewport: { width: maat.breedte, height: maat.hoogte },
        deviceScaleFactor: 1
      });
      const page = await context.newPage();
      const fouten = [];
      page.on('console', (m) => {
        if (m.type() === 'error') fouten.push(m.text());
      });
      page.on('pageerror', (e) => fouten.push(String(e)));

      await page.goto(versie.url, { waitUntil: 'networkidle' });
      // Ruim wachten: het menu komt met een intro-animatie in beeld en een
      // te vroege opname laat een halfdoorzichtig scherm zien.
      await wacht(2000);
      await legScherm(page, versie.naam, maat.naam, '01-menu');

      // Startscherm van level 1.
      await klik(page, /Spelen|Single player/);
      await wacht(900);
      await legScherm(page, versie.naam, maat.naam, '02-start');

      // Het bord.
      await klik(page, /^START$/);
      await wacht(1400);
      await legScherm(page, versie.naam, maat.naam, '03-bord');

      // Een woord invullen zodat de beoordeelde tegels in beeld komen.
      const doel = await page.evaluate(() => window.DVL?.Game?.staat()?.kern?.doel || '');
      if (doel) {
        for (const letter of doel.slice(1)) {
          await page.keyboard.press(letter);
          await wacht(40);
        }
        await page.keyboard.press('Enter');
        await wacht(2200);
      }
      await legScherm(page, versie.naam, maat.naam, '04-beoordeeld');

      // Pauzescherm met de stopknop.
      await page.evaluate(() => document.querySelector('#pauze')?.click());
      await wacht(800);
      await legScherm(page, versie.naam, maat.naam, '05-pauze');

      // Uitslag. Rechtstreeks via de actieknop van het spel, zodat het niet
      // uitmaakt of de pauzelaag al open stond.
      await page.evaluate(() => document.querySelector('[data-actie="afronden"]')?.click());
      await wacht(1800);
      await legScherm(page, versie.naam, maat.naam, '06-uitslag');

      gemeten.push({ maat: maat.naam, versie: versie.naam, doel, fouten });
      await context.close();
    }
  }

  await browser.close();
  console.log(JSON.stringify(gemeten, null, 2));
};

run().catch((fout) => {
  console.error(fout);
  process.exit(1);
});
