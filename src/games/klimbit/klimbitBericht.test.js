import test from 'node:test';
import assert from 'node:assert/strict';
import { afgekaptTekst, leesKlimbitBericht } from './klimbitBericht.js';

test('alleen berichten van KlimBit met een bekende soort komen door', () => {
  assert.equal(leesKlimbitBericht(null), null);
  assert.equal(leesKlimbitBericht({ bron: 'dvlingo', soort: 'klaar', punten: 10 }), null);
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'bezig' }), null);
  assert.deepEqual(leesKlimbitBericht({ bron: 'klimbit', soort: 'gereed', op: 5 }), { soort: 'gereed', pogingNr: null, op: 5 });
});

test('gestart geeft het pogingnummer door', () => {
  assert.deepEqual(
    leesKlimbitBericht({ bron: 'klimbit', soort: 'gestart', details: { pogingNr: 2 }, op: 1000 }),
    { soort: 'gestart', pogingNr: 2, op: 1000 }
  );
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'gestart', details: { pogingNr: 'x' } }).pogingNr, null);
});

test('klaar neemt de piekhoogte uit de details, anders de punten', () => {
  const bericht = leesKlimbitBericht({
    bron: 'klimbit', soort: 'klaar', punten: 437, details: { piekHoogte: 437.6, duurMs: 81000, pogingNr: 1 }, op: 2000
  });
  assert.equal(bericht.piekHoogte, 437.6);
  assert.equal(bericht.duurMs, 81000);
  assert.equal(bericht.pogingNr, 1);
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'klaar', punten: 120 }).piekHoogte, 120);
});

test('klaar zonder bruikbare hoogte wordt genegeerd', () => {
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'klaar' }), null);
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'klaar', punten: '500' }), null);
  assert.equal(leesKlimbitBericht({ bron: 'klimbit', soort: 'klaar', punten: -1 }), null);
});

test('de afkaptekst verschijnt alleen als de server minder telde', () => {
  assert.equal(afgekaptTekst({ hoogte: 437, ingestuurdeHoogte: 437.9 }), '');
  assert.match(afgekaptTekst({ hoogte: 85, ingestuurdeHoogte: 5000 }), /meldde 5000 m.*telt 85 m/);
});
