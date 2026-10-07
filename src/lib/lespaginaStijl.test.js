import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

// De inhoud van de regel waarvan een regel precies met deze selector en " {" begint.
function regel(selector) {
  const begin = css.indexOf(`\n${selector} {`);
  assert.notEqual(begin, -1, `regel ${selector} ontbreekt`);
  const open = css.indexOf('{', begin);
  return css.slice(open + 1, css.indexOf('}', open));
}

const LESKLASSEN = [
  '.study-block', '.study-panel', '.study-example', '.study-example-label', '.study-surface',
  '.study-rail', '.study-stappen', '.study-step', '.study-step-nummer', '.study-step-title',
  '.study-step-meta', '.study-step-todo', '.study-step-check', '.study-einde'
];

test('het lesblok is een witte kaart van de leeromgeving', () => {
  const blok = regel('.study-block');
  assert.match(blok, /background:\s*var\(--lo-kaart\)/);
  assert.match(blok, /border-radius:\s*var\(--lo-hoek-xl\)/);
  assert.match(blok, /box-shadow:\s*var\(--lo-schaduw-kaart\)/);
  assert.match(blok, /padding:\s*22px/);
  assert.doesNotMatch(blok, /border:/);
});

test('de huidige stap heeft een geel nummerblokje, de andere een crème', () => {
  assert.match(regel('.study-step-nummer'), /height:\s*30px/);
  assert.match(regel('.study-step-nummer'), /background:\s*var\(--lo-papier-2\)/);
  const actief = regel('.study-step-active .study-step-nummer');
  assert.match(actief, /background:\s*var\(--lo-geel\)/);
  assert.match(actief, /border-color:\s*var\(--lo-inkt\)/);
  assert.match(regel('.study-step-active'), /background:\s*var\(--lo-geel-zacht\)/);
  assert.match(regel('.study-step-title'), /font-size:\s*15px/);
  assert.match(regel('.study-step-title'), /font-weight:\s*700/);
});

test('de lesklassen gebruiken alleen tokens van de leeromgeving', () => {
  for (const selector of LESKLASSEN) {
    const inhoud = regel(selector);
    assert.doesNotMatch(inhoud, /--helix-/, `${selector} gebruikt nog een --helix-token`);
    assert.doesNotMatch(inhoud, /#[0-9A-Fa-f]{3,8}\b|rgba?\(/, `${selector} heeft een losse kleur`);
  }
});

test('binnen de lespagina zien de gedeelde knoppen eruit als de leeromgeving', () => {
  const hoofd = regel('.study-stijl .helix-btn-solid');
  assert.match(hoofd, /background:\s*var\(--lo-blauw\)/);
  assert.match(hoofd, /border-radius:\s*var\(--lo-hoek-m\)/);
  assert.match(hoofd, /font-weight:\s*800/);
  assert.match(regel('.study-stijl .btn-secondary'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.study-stijl .helix-eyebrow'), /color:\s*var\(--lo-blauw-inkt\)/);
  assert.match(regel('.study-stijl .input-standard'), /border:\s*1px solid var\(--lo-lijn\)/);
  assert.match(regel('.study-stijl .lesson-prose'), /color:\s*var\(--lo-inkt\)/);
});

test('de hoofdknoppen houden een focusring en springen niet omhoog', () => {
  assert.match(regel('.study-stijl .helix-btn-solid:focus-visible'), /0 0 0 6px var\(--lo-blauw\)/);
  assert.match(regel('.study-stijl .helix-btn-solid:hover:not(:disabled)'), /translate:\s*none/);
});

test('de scope-regels zetten geen binnenmarge, zodat de toetsstepper zijn maten houdt', () => {
  // Van de eerste tot en met de laatste regel van het scope-blok.
  const eind = css.indexOf('\n.study-stijl .lesson-prose {');
  assert.notEqual(eind, -1);
  const scope = css.slice(css.indexOf('\n.study-stijl .btn-primary,'), css.indexOf('}', eind) + 1);
  assert.doesNotMatch(scope, /padding/);
});

test('de scope-regels staan onder de basisregels van de knoppen', () => {
  const scope = css.indexOf('\n.study-stijl .btn-primary,');
  assert.notEqual(scope, -1);
  assert.ok(css.indexOf('\n.btn-primary {') < scope);
  assert.ok(css.indexOf('\n.btn-secondary {') < scope);
  assert.ok(css.indexOf('\n.input-standard {') < scope);
});
