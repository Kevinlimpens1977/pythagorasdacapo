/**
 * De tijdlijn voor bijlage C van het MT-rapport.
 *
 *   node docs/curriculum/rapport/maak-tijdlijn-figuur.mjs
 *
 * Drie sporen onder elkaar: het landelijke curriculum, de technologie waar de
 * kerndoelen over gaan, en de schoolloopbaan van de brugklasser van 2026. Het
 * punt van de figuur is de afstand tussen die sporen: de kerndoelen van 2006
 * gingen twintig jaar mee, en bij hetzelfde tempo volgt de volgende herziening
 * pas rond 2046 - ruim nadat deze leerling de school heeft verlaten.
 *
 * De figuur wordt als SVG opgebouwd en met Edge headless naar PNG geschoten,
 * zodat hij scherp in het PDF komt. Uitvoer: exports/curriculum/tijdlijn-kerndoelen.png
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const REPO = path.resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const UIT = path.join(REPO, 'exports', 'curriculum');
const DOEL = path.join(UIT, 'tijdlijn-kerndoelen.png');

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe'
];

const START = 2004;
const EIND = 2048;
const BREEDTE = 1240;
const MARGE = 70;

const x = (jaar) => MARGE + ((jaar - START) / (EIND - START)) * (BREEDTE - 2 * MARGE);

const sporen = [
  {
    y: 150,
    naam: 'Landelijk curriculum',
    kleur: '#0f4c81',
    punten: [
      { jaar: 2006, tekst: 'Kerndoelen\nonderbouw vo', sterk: true },
      { jaar: 2026, tekst: 'Nieuwe kerndoelen\nvastgesteld', sterk: true },
      { jaar: 2027, tekst: 'Invoering\ndigitale geletterdheid', onder: true },
      { jaar: 2031, tekst: 'Verplicht voor\nelke school', sterk: true },
      { jaar: 2046, tekst: 'Volgende herziening\nbij hetzelfde tempo?', stippel: true, onder: true }
    ]
  },
  {
    y: 290,
    naam: 'Technologie',
    kleur: '#b45309',
    punten: [
      { jaar: 2022, tekst: 'ChatGPT', onder: true },
      { jaar: 2024, tekst: 'AI in Office\nen in de klas' },
      { jaar: 2026, tekst: 'nu', sterk: true, onder: true },
      { jaar: 2031, tekst: '?', onder: false },
      { jaar: 2046, tekst: '?', onder: true }
    ]
  },
  {
    y: 420,
    naam: 'Onze brugklasser',
    kleur: '#166534',
    punten: [
      { jaar: 2026, tekst: 'start in\nklas 1', sterk: true },
      { jaar: 2031, tekst: 'doet examen', sterk: true, onder: true }
    ]
  }
];

const jaarlabels = [2006, 2016, 2026, 2036, 2046];

const tekstRegels = (tekst, cx, cy, anker = 'middle', kleur = '#374151', grootte = 12.5, vet = false) =>
  String(tekst).split('\n').map((regel, i) => (
    `<text x="${cx}" y="${cy + i * 15}" text-anchor="${anker}" font-family="Segoe UI, sans-serif" font-size="${grootte}" ${vet ? 'font-weight="600"' : ''} fill="${kleur}">${regel}</text>`
  )).join('');

const spoorSvg = (spoor) => {
  const lijn = `<line x1="${x(START) + 10}" y1="${spoor.y}" x2="${x(EIND) - 10}" y2="${spoor.y}" stroke="${spoor.kleur}" stroke-width="2.5" opacity="0.35" />`;
  const naam = `<text x="${MARGE - 14}" y="${spoor.y - 52}" text-anchor="start" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700" fill="${spoor.kleur}" letter-spacing="1.2">${spoor.naam.toUpperCase()}</text>`;

  const punten = spoor.punten.map((punt) => {
    const px = x(punt.jaar);
    const straal = punt.sterk ? 7 : 5;
    const stip = punt.stippel
      ? `<circle cx="${px}" cy="${spoor.y}" r="${straal}" fill="#ffffff" stroke="${spoor.kleur}" stroke-width="2" stroke-dasharray="3 2" />`
      : `<circle cx="${px}" cy="${spoor.y}" r="${straal}" fill="${punt.sterk ? spoor.kleur : '#ffffff'}" stroke="${spoor.kleur}" stroke-width="2" />`;
    const regels = String(punt.tekst).split('\n').length;
    const ty = punt.onder ? spoor.y + 26 : spoor.y - 18 - (regels - 1) * 15;
    return stip + tekstRegels(punt.tekst, px, ty, 'middle', spoor.kleur, 12.5, punt.sterk);
  }).join('');

  return lijn + naam + punten;
};

const jaarAs = jaarlabels.map((jaar) => (
  `<line x1="${x(jaar)}" y1="110" x2="${x(jaar)}" y2="470" stroke="#d1d5db" stroke-width="1" stroke-dasharray="2 4" />`
  + `<text x="${x(jaar)}" y="498" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="#6b7280">${jaar}</text>`
)).join('');

// De twintig jaar tussen 2006 en 2026, en dezelfde afstand daarna.
const spanBalk = `
  <rect x="${x(2006)}" y="60" width="${x(2026) - x(2006)}" height="22" rx="4" fill="#0f4c81" opacity="0.12" />
  <text x="${(x(2006) + x(2026)) / 2}" y="76" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" font-weight="700" fill="#0f4c81">20 jaar ongewijzigd</text>
  <rect x="${x(2026)}" y="60" width="${x(2046) - x(2026)}" height="22" rx="4" fill="#0f4c81" opacity="0.06" stroke="#0f4c81" stroke-opacity="0.25" stroke-dasharray="4 3" />
  <text x="${(x(2026) + x(2046)) / 2}" y="76" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="12" font-weight="600" fill="#0f4c81" opacity="0.8">bij hetzelfde tempo: opnieuw 20 jaar</text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREEDTE}" height="530" viewBox="0 0 ${BREEDTE} 530">
  <rect width="${BREEDTE}" height="530" fill="#ffffff" />
  ${jaarAs}
  ${spanBalk}
  ${sporen.map(spoorSvg).join('')}
</svg>`;

fs.mkdirSync(UIT, { recursive: true });
const svgPad = path.join(UIT, 'tijdlijn-kerndoelen.svg');
fs.writeFileSync(svgPad, svg, 'utf8');

const htmlPad = path.join(UIT, 'tijdlijn-kerndoelen.html');
fs.writeFileSync(htmlPad, `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#fff}</style></head><body>${svg}</body></html>`, 'utf8');

const browser = BROWSERS.find((pad) => fs.existsSync(pad));
if (!browser) {
  console.error('Geen Edge of Chrome gevonden; de SVG staat klaar in ' + svgPad);
  process.exit(1);
}

const resultaat = spawnSync(browser, [
  '--headless', '--disable-gpu', '--hide-scrollbars',
  `--window-size=${BREEDTE},530`,
  `--screenshot=${DOEL}`,
  `file:///${htmlPad.replace(/\\/g, '/')}`
], { encoding: 'utf8' });

if (!fs.existsSync(DOEL)) {
  console.error('Figuur maken mislukt:', resultaat.stderr?.slice(0, 400));
  process.exit(1);
}

console.log(`Tijdlijn: ${DOEL} (${Math.round(fs.statSync(DOEL).size / 1024)} kB)`);
