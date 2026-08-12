import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DVLINGO_STREEFSCORE,
  bouwSpelresultaat,
  leesSpelbericht
} from './dvlingoScore.js';

test('leesSpelbericht weigert berichten van een andere bron', () => {
  assert.equal(leesSpelbericht({ bron: 'iets-anders', soort: 'klaar' }), null);
  assert.equal(leesSpelbericht(null), null);
  assert.equal(leesSpelbericht('klaar'), null);
  assert.equal(leesSpelbericht({ bron: 'dvlingo' }), null);
});

test('leesSpelbericht normaliseert de velden', () => {
  const bericht = leesSpelbericht({
    bron: 'dvlingo',
    soort: 'klaar',
    punten: '4210.4',
    details: { lingos: 2 },
    gestartOp: '2026-08-12T09:00:00.000Z',
    op: '2026-08-12T09:18:00.000Z'
  });

  assert.equal(bericht.soort, 'klaar');
  assert.equal(bericht.punten, 4210);
  assert.deepEqual(bericht.details, { lingos: 2 });
  assert.equal(bericht.gestartOp, '2026-08-12T09:00:00.000Z');
});

test('leesSpelbericht leest de bezig-stand als echte boolean', () => {
  assert.equal(leesSpelbericht({ bron: 'dvlingo', soort: 'bezig', bezig: true }).bezig, true);
  assert.equal(leesSpelbericht({ bron: 'dvlingo', soort: 'bezig', bezig: 'ja' }).bezig, false);
});

test('bouwSpelresultaat zet punten om naar score en maxScore', () => {
  const resultaat = bouwSpelresultaat({
    punten: 3000,
    gestartOp: '2026-08-12T09:00:00.000Z',
    op: '2026-08-12T09:20:00.000Z'
  });

  assert.equal(resultaat.score, 3000);
  assert.equal(resultaat.maxScore, DVLINGO_STREEFSCORE);
  assert.equal(resultaat.startedAt, '2026-08-12T09:00:00.000Z');
  assert.equal(resultaat.completedAt, '2026-08-12T09:20:00.000Z');
});

test('bouwSpelresultaat kapt boven de streefscore af maar bewaart de ruwe punten', () => {
  const resultaat = bouwSpelresultaat({ punten: 9500, op: '2026-08-12T09:20:00.000Z' });

  assert.equal(resultaat.score, DVLINGO_STREEFSCORE);
  assert.equal(resultaat.details.punten, 9500);
  assert.equal(resultaat.details.streefscore, DVLINGO_STREEFSCORE);
});

test('bouwSpelresultaat maakt van een half potje een eerlijke deelscore', () => {
  const resultaat = bouwSpelresultaat({ punten: 1500, op: '2026-08-12T09:10:00.000Z' });
  const accuracy = Math.round((resultaat.score / resultaat.maxScore) * 100);

  assert.equal(resultaat.score, 1500);
  assert.equal(accuracy, 25);
});

test('bouwSpelresultaat blijft geldig bij rommelige invoer', () => {
  const resultaat = bouwSpelresultaat({ punten: -50, details: 'geen object' });

  assert.equal(resultaat.score, 0);
  assert.ok(resultaat.maxScore > 0);
  assert.equal(resultaat.details.punten, 0);
  assert.ok(resultaat.startedAt);
  assert.ok(resultaat.completedAt);
});

test('de details van de spelbrug reizen mee naar het platform', () => {
  const resultaat = bouwSpelresultaat({
    punten: 4000,
    details: { woordenGoed: 7, woordenTotaal: 9, lingos: 1, bonuswoordenGeraden: 2 }
  });

  assert.equal(resultaat.details.woordenGoed, 7);
  assert.equal(resultaat.details.lingos, 1);
  assert.equal(resultaat.details.bonuswoordenGeraden, 2);
});
