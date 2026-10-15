// Opnamebrowser voor de rondleidingsvideo: een zichtbaar Chromium-venster op
// 1920 x 1080. Kevin logt er zelf in; het profiel blijft bewaard buiten git
// (exports/video/rondleiding/browserprofiel). Daarna stuurt Claude het venster
// aan via een klein lokaal HTTP-adres:
//   GET  /ga?url=<url>                ga naar een pagina en wacht tot hij rustig is
//   GET  /foto?naam=<naam>            schermafbeelding naar exports/video/rondleiding/schermen/<naam>.png
//   POST /js   (body = JavaScript)    voer code uit in de pagina, geeft het resultaat terug
//   GET  /klik?tekst=&nr=&exact=1     klik op de n-de tekst die past
//   GET  /venster?w=&h=               zet de grootte van het venster (standaard 1920 x 1080)
//   GET  /status                      huidige url
// Alleen bereikbaar vanaf deze computer (127.0.0.1).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const hier = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(hier, '..', '..');
const require = createRequire(path.join(repo, 'package.json'));
const { chromium } = require('playwright');

const profiel = path.join(repo, 'exports', 'video', 'rondleiding', 'browserprofiel');
const schermen = path.join(repo, 'exports', 'video', 'rondleiding', 'schermen');
fs.mkdirSync(profiel, { recursive: true });
fs.mkdirSync(schermen, { recursive: true });

const context = await chromium.launchPersistentContext(profiel, {
  headless: false,
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  args: ['--window-size=1940,1180']
});
const page = context.pages()[0] || (await context.newPage());
await page.goto('https://dvdacapo.vercel.app/login/beheer');

const lees = (req) => new Promise((klaar) => {
  let data = '';
  req.on('data', (stuk) => { data += stuk; });
  req.on('end', () => klaar(data));
});

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  try {
    let uit;
    if (url.pathname === '/ga') {
      await page.goto(url.searchParams.get('url'), { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(1200);
      uit = { url: page.url() };
    } else if (url.pathname === '/klik') {
      const tekst = url.searchParams.get('tekst');
      const nr = Number(url.searchParams.get('nr') || 0);
      const doel = page.getByText(tekst, { exact: url.searchParams.get('exact') === '1' }).nth(nr);
      await doel.scrollIntoViewIfNeeded({ timeout: 8000 });
      await doel.click({ timeout: 8000 });
      await page.waitForTimeout(Number(url.searchParams.get('wacht') || 1500));
      uit = { url: page.url() };
    } else if (url.pathname === '/venster') {
      await page.setViewportSize({ width: Number(url.searchParams.get('w')) || 1920, height: Number(url.searchParams.get('h')) || 1080 });
      await page.waitForTimeout(600);
      uit = { venster: page.viewportSize() };
    } else if (url.pathname === '/foto') {
      const naam = (url.searchParams.get('naam') || 'scherm').replace(/[^a-z0-9-]/gi, '-');
      const bestand = path.join(schermen, `${naam}.png`);
      await page.screenshot({ path: bestand, fullPage: url.searchParams.get('heel') === '1' });
      uit = { bestand };
    } else if (url.pathname === '/muis') {
      // body = JSON-lijst, bv. [{"van":[x,y],"naar":[x,y]}] (slepen) of [{"klik":[x,y]}]
      for (const stap of JSON.parse(await lees(req))) {
        if (stap.klik) await page.mouse.click(...stap.klik);
        if (stap.van) {
          await page.mouse.move(...stap.van);
          await page.mouse.down();
          await page.mouse.move(...stap.naar, { steps: 25 });
          await page.waitForTimeout(stap.vasthouden || 300);
          await page.mouse.up();
        }
        await page.waitForTimeout(stap.wacht || 600);
      }
      uit = { ok: true };
    } else if (url.pathname === '/toets') {
      await page.keyboard.type(url.searchParams.get('tekst') || '', { delay: 60 });
      if (url.searchParams.get('enter') === '1') await page.keyboard.press('Enter');
      await page.waitForTimeout(800);
      uit = { ok: true };
    } else if (url.pathname === '/js') {
      const code = await lees(req);
      uit = { resultaat: await page.evaluate(code) };
    } else {
      uit = { url: page.url() };
    }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(uit));
  } catch (fout) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ fout: String(fout?.message || fout) }));
  }
}).listen(7791, '127.0.0.1', () => console.log('Opnamebrowser klaar op http://127.0.0.1:7791'));
