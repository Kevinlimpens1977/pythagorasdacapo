import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Bewaakt de HELIX Leeromgeving-stijl (docs/LEEROMGEVING-STIJL.md): de tokens en
// de maten uit Kevins bijlage (optie D, opgemeten op 7 okt 2026).
const css = readFileSync(new URL('../styles/leeromgeving.css', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

const regel = (selector) => {
  const veilig = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`(?:^|\\n)\\s*${veilig}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `regel ${selector} ontbreekt`);
  return match[1];
};

test('alle kleuren van de leeromgeving staan er met hun vaste waarde', () => {
  const verwacht = {
    '--lo-papier': '#FFF7E8', '--lo-papier-2': '#FBEBD0', '--lo-kaart': '#FFFFFF', '--lo-lijn': '#E8DCC3',
    '--lo-inkt': '#0B0D0F', '--lo-grijs': '#5B5648', '--lo-geel': '#FFD33D', '--lo-geel-zacht': '#FFF0B8',
    '--lo-blauw': '#087EB5', '--lo-blauw-inkt': '#066A99', '--lo-blauw-zacht': '#E1F0F8',
    '--lo-paars': '#793AC7', '--lo-paars-inkt': '#5F2C9E', '--lo-paars-zacht': '#ECE3F8',
    '--lo-groen': '#2E9D63', '--lo-groen-inkt': '#237A4D', '--lo-groen-zacht': '#DFF2E7',
    '--lo-oranje-inkt': '#B4520E', '--lo-oranje-zacht': '#FDE7D6', '--lo-rood': '#D83A2E', '--lo-rood-inkt': '#B42F25', '--lo-rood-zacht': '#FADDDA'
  };
  for (const [naam, waarde] of Object.entries(verwacht)) {
    assert.match(css, new RegExp(`${naam}:\\s*${waarde};`, 'i'), `${naam} moet ${waarde} zijn`);
  }
});

test('de maten uit de bijlage: kaart, lijst, rij en H-blokje', () => {
  assert.match(regel('.lo-kaart'), /padding:\s*22px/);
  assert.match(regel('.lo-kaart'), /border-radius:\s*var\(--lo-hoek-xl\)/);
  assert.match(regel('.lo-kaart-titel'), /font-size:\s*20px/);
  assert.match(regel('.lo-kaart-titel'), /font-weight:\s*800/);
  assert.match(regel('.lo-kaart-uitleg'), /font-size:\s*14px/);
  assert.match(regel('.lo-lijst'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.lo-rij'), /padding:\s*10px 12px/);
  assert.match(regel('.lo-rij-titel'), /font-size:\s*15px/);
  assert.match(regel('.lo-rij-titel'), /font-weight:\s*700/);
  assert.match(regel('.lo-onderregel'), /font-size:\s*12\.5px/);
  assert.match(regel('.lo-hblok'), /height:\s*30px/);
  assert.match(regel('.lo-hblok'), /border:\s*2px solid var\(--lo-inkt\)/);
  assert.match(regel('.lo-hblok'), /font-size:\s*13px/);
  assert.match(regel('.lo-paragrafen'), /padding:\s*0 12px 10px 52px/);
});

test('de knoppen, labels en keuzeknoppen uit de bijlage', () => {
  assert.match(regel('.lo-knop-start'), /padding:\s*6px 10px/);
  assert.match(regel('.lo-knop-start'), /font-size:\s*13px/);
  assert.match(regel('.lo-knop-start'), /background:\s*var\(--lo-blauw-zacht\)/);
  assert.match(regel('.lo-knop-start'), /color:\s*var\(--lo-blauw-inkt\)/);
  assert.match(regel('.lo-label'), /padding:\s*2px 9px/);
  assert.match(regel('.lo-label'), /font-size:\s*12px/);
  assert.match(regel('.lo-keuze'), /padding:\s*5px 11px/);
  assert.match(css, /\.lo-keuze\[aria-pressed='true'\],\s*\.lo-keuze\[aria-current='page'\]\s*\{[^}]*background:\s*var\(--lo-inkt\)/);
});

test('rijen passen op een telefoon: ze wrappen en de titel houdt ruimte', () => {
  assert.match(regel('.lo-rij'), /flex-wrap:\s*wrap/);
  assert.match(regel('.lo-rij-toggle'), /flex:\s*1 1 14rem/);
  assert.match(regel('.lo-paragraafrij'), /flex-wrap:\s*wrap/);
  assert.match(regel('.lo-rij-tekst'), /flex:\s*1 1 12rem/);
});

test('rode tekst is donker genoeg en er is een voortgangsbalk en een invoerveld', () => {
  assert.match(regel('.lo-label--rood'), /color:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-melding--fout'), /color:\s*var\(--lo-rood-inkt\)/);
  assert.match(regel('.lo-voortgang'), /height:\s*8px/);
  assert.match(regel('.lo-invoer'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.lo-invoer'), /border-radius:\s*var\(--lo-hoek-m\)/);
});

test('de leeromgeving staat los van het Slide Design System', () => {
  assert.doesNotMatch(css, /Slide Design System[^.]*volg/i);
  assert.doesNotMatch(css, /Bangers|ds-display|ds-anchor|--font-comic/);
  assert.match(css, /docs\/LEEROMGEVING-STIJL\.md/);
  assert.match(index, /@import "\.\/styles\/leeromgeving\.css";/);
});

test('het logo heeft de merkkleuren en drie golvende stipjes die stilstaan bij minder beweging', () => {
  assert.match(regel('.lo-logo-geel'), /fill:\s*var\(--lo-geel\)/);
  assert.match(regel('.lo-logo-inkt'), /fill:\s*var\(--lo-inkt\)/);
  assert.match(regel('.lo-logo-blauw'), /fill:\s*var\(--lo-blauw\)/);
  assert.match(regel('.lo-logo-stip'), /animation:\s*lo-logo-golf/);
  assert.match(regel('.lo-logo-stip:nth-child(2)'), /animation-delay:\s*0\.15s/);
  assert.match(regel('.lo-logo-stip:nth-child(3)'), /animation-delay:\s*0\.3s/);
  assert.match(css, /prefers-reduced-motion: reduce\)\s*\{\s*\.lo-logo-stip\s*\{\s*animation:\s*none/);
});
