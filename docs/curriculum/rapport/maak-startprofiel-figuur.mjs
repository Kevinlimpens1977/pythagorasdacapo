/**
 * De schermafbeelding van het startprofiel voor het MT-rapport.
 *
 *   node docs/curriculum/rapport/maak-startprofiel-figuur.mjs
 *
 * Het rapport laat zien wat een leerling in HELIX ziet na de nulmeting. Die
 * kaart staat achter een login, dus hij wordt hier opnieuw opgebouwd met exact
 * dezelfde opmaak: dezelfde HTML-structuur als
 * `src/components/nulmeting/NulmetingProfielKaart.jsx` en de gebouwde CSS van
 * de app (`dist/assets/index-*.css`). Wat je op de foto ziet, is dus wat de
 * leerling ziet.
 *
 * De leerling is verzonnen. De scores lopen bewust uiteen - sterk in data,
 * startniveau bij AI, producten maken en samenleving - omdat het rapport juist
 * laat zien hoe HELIX per onderdeel verschillend reageert.
 *
 * Dezelfde gegevens staan als echt profiel op het testaccount
 * `testleerling-h1k2`, zodat de kaart ook in de app zelf te bekijken is.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// fileURLToPath en niet .pathname: een pad met een spatie erin komt anders als
// %20 terug en dan vindt Node de map niet.
const REPO = path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const UIT = path.join(REPO, 'exports', 'curriculum');
const DOEL = path.join(UIT, 'startprofiel-voorbeeld.png');

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'
];

const profiel = {
  leerlingTekst: 'Je bent sterk in data en in veilig online zijn. Zelf dingen maken en AI zijn nog nieuw voor je: daar gaan je eerste lessen over.',
  domeinen: [
    { domein: 'Praktische kennis en vaardigheden', percentage: 71 },
    { domein: 'Ontwerpen en maken', percentage: 42 },
    { domein: 'De gedigitaliseerde wereld', percentage: 72 }
  ],
  deelvaardigheden: [
    { onderdeel: 'Digitale systemen', goed: 5, label: 'Op weg' },
    { onderdeel: 'Digitale media en informatie', goed: 4, label: 'Op weg' },
    { onderdeel: 'Data en dataverwerking', goed: 6, label: 'Sterk' },
    { onderdeel: 'Artificiële intelligentie', goed: 2, label: 'Startniveau' },
    { onderdeel: 'Digitale producten creëren', goed: 2, label: 'Startniveau' },
    { onderdeel: 'Programmeren', goed: 3, label: 'Op weg' },
    { onderdeel: 'Veiligheid en privacy', goed: 5, label: 'Op weg' },
    { onderdeel: 'Jezelf en de ander', goed: 5, label: 'Op weg' },
    { onderdeel: 'Digitale technologie en samenleving', goed: 2, label: 'Startniveau' }
  ],
  sterkePunten: ['Data en dataverwerking', 'Veiligheid en privacy', 'Jezelf en de ander'],
  adviezen: [
    { onderdeel: 'Digitale producten creëren', advies: 'Maak stap voor stap een digitaal product: doel, ontwerp, testen, verbeteren.' },
    { onderdeel: 'Artificiële intelligentie', advies: 'Ontdek wat AI wel en niet kan, en wanneer je een AI-antwoord moet controleren.' },
    { onderdeel: 'Digitale technologie en samenleving', advies: 'Kijk naar wat digitale technologie verandert in werk, samenleving en wereld.' }
  ]
};

// Dezelfde labelkleuren als src/lib/nulmetingProfielWeergave.js.
const labelKlasse = (label) => (label === 'Startniveau'
  ? 'bg-orange-50 text-orange-700 border-orange-200'
  : 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)] border-[var(--helix-border)]');

const domeinTegel = (domein) => `
  <div class="rounded-xl border border-[var(--helix-border)] bg-white p-3">
    <p class="text-[11px] font-black uppercase tracking-wide text-[var(--helix-muted)]">${domein.domein}</p>
    <p class="mt-1 text-2xl font-black text-[var(--helix-navy)]">${domein.percentage}%</p>
  </div>`;

const deelRegel = (deel) => `
  <li class="flex items-center justify-between gap-3 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2">
    <div class="min-w-0">
      <p class="truncate text-sm font-bold text-[var(--helix-navy)]">${deel.onderdeel}</p>
      <p class="text-xs font-semibold text-[var(--helix-muted)]">${deel.goed} van 6 goed</p>
    </div>
    <span class="shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-black ${labelKlasse(deel.label)}">${deel.label}</span>
  </li>`;

const kaart = `
<section class="helix-card mb-5 p-6">
  <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div>
      <p class="helix-eyebrow">Mijn startprofiel</p>
      <h2 class="mt-1 text-xl font-black text-[var(--helix-navy)]">Nulmeting digitale vaardigheden</h2>
    </div>
  </div>
  <div class="space-y-4">
    <p class="text-base font-semibold leading-7 text-[var(--helix-navy)]">${profiel.leerlingTekst}</p>
    <div class="grid gap-3 sm:grid-cols-3">${profiel.domeinen.map(domeinTegel).join('')}</div>
    <ul class="grid gap-2 md:grid-cols-3">${profiel.deelvaardigheden.map(deelRegel).join('')}</ul>
    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        <p class="text-xs font-black uppercase tracking-wide text-emerald-800">Sterke punten</p>
        <ul class="mt-2 space-y-1 text-sm font-semibold text-emerald-900">
          ${profiel.sterkePunten.map((punt) => `<li>${punt}</li>`).join('')}
        </ul>
      </div>
      <div class="rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p class="text-xs font-black uppercase tracking-wide text-blue-800">Hier ga je mee verder</p>
        <ul class="mt-2 space-y-2 text-sm text-blue-950">
          ${profiel.adviezen.map((advies) => `<li class="flex gap-2"><span>&rarr;</span><span><span class="font-bold">${advies.onderdeel}:</span> ${advies.advies}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`;

const cssBestand = fs.readdirSync(path.join(REPO, 'dist', 'assets')).find((naam) => /^index-.*\.css$/.test(naam));
if (!cssBestand) {
  console.error('Geen gebouwde CSS gevonden. Draai eerst: npm run build');
  process.exit(1);
}

const pagina = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${path.join(REPO, 'dist', 'assets', cssBestand).replace(/\\/g, '/')}">
<style>
  body { background: var(--helix-bg, #fdf8ee); margin: 0; padding: 24px; font-family: 'Segoe UI', sans-serif; }
  .blad { max-width: 1040px; }
</style></head>
<body><div class="blad">${kaart}</div></body></html>`;

fs.mkdirSync(UIT, { recursive: true });
const htmlPad = path.join(UIT, 'startprofiel-voorbeeld.html');
fs.writeFileSync(htmlPad, pagina, 'utf8');

const browser = BROWSERS.find((pad) => fs.existsSync(pad));
if (!browser) {
  console.error('Geen Edge of Chrome gevonden; de HTML staat klaar in ' + htmlPad);
  process.exit(1);
}

const resultaat = spawnSync(browser, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  // Precies zo hoog als de kaart: anders staat er een halve pagina crème onder.
  '--window-size=1100,700',
  `--screenshot=${DOEL}`,
  `file:///${htmlPad.replace(/\\/g, '/')}`
], { encoding: 'utf8' });

if (resultaat.status !== 0 && !fs.existsSync(DOEL)) {
  console.error('Schermafbeelding maken mislukt:', resultaat.stderr?.slice(0, 400));
  process.exit(1);
}

console.log(`Schermafbeelding: ${DOEL} (${Math.round(fs.statSync(DOEL).size / 1024)} kB)`);
