// Waarom rendert de ene versie wel en de andere niet? Meet geometrie en
// mislukte requests op beide versies, op dezelfde viewport.
import { chromium } from 'playwright';

const VERSIES = [
  { naam: 'bron', url: 'http://localhost:8124/index.html' },
  { naam: 'helix', url: 'http://localhost:5173/games/dvlingo/v1/index.html' }
];

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const uit = [];

for (const versie of VERSIES) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const mislukt = [];
  page.on('requestfailed', (r) => mislukt.push(`${r.url().split('/').pop()}: ${r.failure()?.errorText}`));
  page.on('response', (r) => {
    if (r.status() >= 400) mislukt.push(`${r.url().split('/').pop()}: HTTP ${r.status()}`);
  });

  await page.goto(versie.url, { waitUntil: 'networkidle' });
  await wacht(1500);

  const meting = await page.evaluate(() => {
    const doos = (k) => {
      const el = document.querySelector(k);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width), h: Math.round(r.height),
        display: s.display, visibility: s.visibility, opacity: s.opacity, transform: s.transform
      };
    };
    const img = document.querySelector('.start-merk img');
    return {
      main: doos('main'),
      menu: doos('#scherm-menu'),
      menuActief: document.querySelector('#scherm-menu')?.className,
      keuzes: doos('.keuzes'),
      merkDoos: doos('.start-merk img'),
      merkGeladen: img ? { compleet: img.complete, natuurlijk: [img.naturalWidth, img.naturalHeight], src: img.getAttribute('src') } : null,
      htmlKlassen: document.documentElement.className,
      bodyKlassen: document.body.className
    };
  });

  uit.push({ versie: versie.naam, mislukt, meting });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(uit, null, 1));
