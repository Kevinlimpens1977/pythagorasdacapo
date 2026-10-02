import test from 'node:test';
import assert from 'node:assert/strict';
import { controleerVertalingen } from './vertalingen.mjs';

const draaiboek = {
  hoofdstukId: 'hoofdstuk-test',
  scenes: [
    { id: 's0', regels: [{ id: 's0-r1', tekst: 'Wat is massa?' }] },
    { id: 's1', regels: [{ id: 's1-r1', tekst: 'Massa meet je in gram.' }, { id: 's1-r2', tekst: '1 kg is 1000 g.' }] }
  ]
};

const goed = () => ({
  hoofdstukId: 'hoofdstuk-test',
  bron: { 's0-r1': 'Wat is massa?', 's1-r1': 'Massa meet je in gram.', 's1-r2': '1 kg is 1000 g.' },
  talen: {
    en: { 's0-r1': 'What is mass?', 's1-r1': 'You measure mass (massa) in grams.', 's1-r2': '1 kg is 1000 g.' },
    tr: { 's0-r1': 'Kütle nedir?', 's1-r1': 'Kütleyi (massa) gram ile ölçersin.', 's1-r2': '1 kg 1000 g eder.' }
  }
});

test('controleerVertalingen keurt een complete, actuele vertaling goed', () => {
  assert.deepEqual(controleerVertalingen(draaiboek, goed(), ['en', 'tr']), []);
});

test('controleerVertalingen meldt een regel zonder bron-tekst als verouderd', () => {
  const v = goed();
  delete v.bron['s1-r1'];
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /vertaling verouderd voor regel s1-r1/i);
});

test('controleerVertalingen meldt een bron die niet meer gelijk is aan de draaiboektekst', () => {
  const v = goed();
  v.bron['s1-r2'] = '1 kg is 100 g.';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /vertaling verouderd voor regel s1-r2/i);
});

test('controleerVertalingen meldt een ontbrekende taal', () => {
  const fouten = controleerVertalingen(draaiboek, goed(), ['en', 'tr', 'ar']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /taal ar ontbreekt/i);
});

test('controleerVertalingen meldt per taal een ontbrekende of lege regel', () => {
  const v = goed();
  delete v.talen.en['s0-r1'];
  v.talen.tr['s1-r2'] = '   ';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 2);
  assert.match(fouten[0], /en.*s0-r1.*ontbreekt of is leeg/i);
  assert.match(fouten[1], /tr.*s1-r2.*ontbreekt of is leeg/i);
});

test('controleerVertalingen meldt een taalcode die niet in de lijst staat', () => {
  const v = goed();
  v.talen.fr = { ...v.talen.en };
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /taal fr staat niet in de lijst/i);
});

test('controleerVertalingen meldt emoji in een vertaling', () => {
  const v = goed();
  v.talen.en['s0-r1'] = 'What is mass? \u{1F914}';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /en.*s0-r1.*emoji/i);
});

test('controleerVertalingen overleeft een leeg of half bestand', () => {
  const fouten = controleerVertalingen(draaiboek, {}, ['en']);
  assert.ok(fouten.some((f) => /vertaling verouderd voor regel s0-r1/i.test(f)));
  assert.ok(fouten.some((f) => /taal en ontbreekt/i.test(f)));
  assert.doesNotThrow(() => controleerVertalingen(draaiboek, null, ['en']));
});

test('controleerVertalingen meldt een bidi-isolaat zonder sluitteken', () => {
  const v = goed();
  v.talen.en['s1-r2'] = 'That is ⁦1 kg = 1000 g.';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /en.*s1-r2.*isolaat/i);
});

test('controleerVertalingen meldt een los sluitteken (PDI) van een bidi-isolaat', () => {
  const v = goed();
  v.talen.tr['s0-r1'] = 'Kütle nedir?⁩';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 1);
  assert.match(fouten[0], /tr.*s0-r1.*isolaat/i);
});

test('controleerVertalingen meldt RLI en FSI zonder sluitteken ook', () => {
  const v = goed();
  v.talen.en['s0-r1'] = 'What is ⁧mass?';
  v.talen.tr['s0-r1'] = 'Kütle ⁨nedir?';
  const fouten = controleerVertalingen(draaiboek, v, ['en', 'tr']);
  assert.equal(fouten.length, 2);
  assert.match(fouten[0], /en.*s0-r1.*isolaat/i);
  assert.match(fouten[1], /tr.*s0-r1.*isolaat/i);
});

test('controleerVertalingen keurt gesloten en geneste bidi-isolaten goed', () => {
  const v = goed();
  v.talen.en['s1-r2'] = '⁦1 kg = 1000 g⁩ en ⁧x ⁦5 g⁩ y⁩.';
  assert.deepEqual(controleerVertalingen(draaiboek, v, ['en', 'tr']), []);
});
