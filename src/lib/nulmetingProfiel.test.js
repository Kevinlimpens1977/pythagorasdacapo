import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  bepaalNiveauLabel,
  bouwLeerlingTekst,
  bouwNulmetingMapping,
  buildNulmetingProfiel
} from './nulmetingProfiel.js';

const analysemodel = JSON.parse(readFileSync(new URL('../../docs/seeds/nulmeting-dv/analysemodel.json', import.meta.url), 'utf8'));
const slugA = 'nulmeting-digitale-vaardigheden-a';
const slugB = 'nulmeting-digitale-vaardigheden-b';
const mapping = bouwNulmetingMapping({ analysemodel, slugA, slugB });

const records = (uitkomst) => Object.fromEntries(
  Object.entries(mapping).map(([itemId, regel]) => [itemId, { completed: true, isCorrect: uitkomst(regel, itemId) }])
);

test('de mapping dekt 54 vragen, zes per deelvaardigheid, met stabiele item-ids', () => {
  assert.equal(Object.keys(mapping).length, 54);
  const perDeel = {};
  Object.values(mapping).forEach((regel) => { perDeel[regel.deelvaardigheidId] = (perDeel[regel.deelvaardigheidId] || 0) + 1; });
  assert.deepEqual(Object.values(perDeel), [6, 6, 6, 6, 6, 6, 6, 6, 6]);
  assert.equal(mapping[`${slugA}-01`].deelvaardigheidId, 'systemen');
  assert.equal(mapping[`${slugB}-27`].deelvaardigheidId, 'samenleving');
});

test('de niveaulabels volgen de grenzen uit het analysemodel', () => {
  assert.equal(bepaalNiveauLabel(0, analysemodel), 'Startniveau');
  assert.equal(bepaalNiveauLabel(1, analysemodel), 'Startniveau');
  assert.equal(bepaalNiveauLabel(2, analysemodel), 'In ontwikkeling');
  assert.equal(bepaalNiveauLabel(3, analysemodel), 'In ontwikkeling');
  assert.equal(bepaalNiveauLabel(4, analysemodel), 'Basis op orde');
  assert.equal(bepaalNiveauLabel(5, analysemodel), 'Basis op orde');
  assert.equal(bepaalNiveauLabel(6, analysemodel), 'Extra uitdaging mogelijk');
});

test('een volledig profiel telt per deelvaardigheid, per domein en in totaal', () => {
  // Alles goed behalve programmeren (0/6) en data (2/6, verspreid over A en B).
  const dataFout = (regel) => regel.deelvaardigheidId === 'data'
    && (regel.nr === 3 || (regel.les === 'B' && regel.nr === 12) || (regel.les === 'A' && regel.nr === 21));
  const profiel = buildNulmetingProfiel({
    analysemodel,
    mapping,
    itemRecords: records((regel) => regel.deelvaardigheidId !== 'programmeren' && !dataFout(regel)),
    leerlingId: 'u1',
    naam: 'Test'
  });

  assert.equal(profiel.status, 'compleet');
  assert.deepEqual(profiel.totaal, { goed: 44, van: 54, gemaakt: 54, percentage: 81 });
  const perId = Object.fromEntries(profiel.deelvaardigheden.map((d) => [d.id, d]));
  assert.equal(perId.programmeren.goed, 0);
  assert.equal(perId.programmeren.label, 'Startniveau');
  assert.equal(perId.data.goed, 2);
  assert.equal(perId.data.label, 'In ontwikkeling');
  assert.equal(perId.systemen.label, 'Extra uitdaging mogelijk');
  // Domein = gemiddelde van de deelvaardigheidspercentages: (100+100+33+100)/4 = 83, (100+0)/2 = 50, 100.
  assert.deepEqual(profiel.domeinen.map((d) => d.percentage), [83, 50, 100]);
  assert.deepEqual(profiel.ontwikkelpunten, ['Programmeren', 'Data en dataverwerking']);
  assert.equal(profiel.adviezen.length, 2);
  assert.equal(profiel.adviezen[0].deelvaardigheidId, 'programmeren');
  assert.equal(profiel.sterkePunten.length, 3);
  assert.deepEqual(profiel.docentSignalen, []);
  assert.match(profiel.leerlingTekst, /programmeren, data en dataverwerking/);
});

test('een opvallend verschil tussen deel A en B wordt als docentsignaal gemarkeerd', () => {
  // Veiligheid: A 0/3, B 3/3. Alles anders goed.
  const profiel = buildNulmetingProfiel({
    analysemodel,
    mapping,
    itemRecords: records((regel) => !(regel.deelvaardigheidId === 'veiligheid' && regel.les === 'A'))
  });
  assert.equal(profiel.docentSignalen.length, 1);
  assert.equal(profiel.docentSignalen[0].deelvaardigheidId, 'veiligheid');
  assert.match(profiel.docentSignalen[0].tekst, /deel A 0\/3 en deel B 3\/3/);
  assert.equal(profiel.deelvaardigheden.find((d) => d.id === 'veiligheid').inconsistent, true);
});

test('bij gelijke scores beslissen de toepassingsvragen welk ontwikkelpunt eerst komt', () => {
  // ai en informatie allebei 2/6, maar bij ai zijn de toepassingsvragen fout.
  const profiel = buildNulmetingProfiel({
    analysemodel,
    mapping,
    itemRecords: records((regel) => {
      if (regel.deelvaardigheidId === 'ai') return regel.vaardigheid !== 'toepassen' && regel.nr < 14;
      if (regel.deelvaardigheidId === 'informatie') return regel.vaardigheid === 'toepassen' && regel.nr < 12;
      return true;
    })
  });
  const perId = Object.fromEntries(profiel.deelvaardigheden.map((d) => [d.id, d]));
  assert.equal(perId.ai.goed, perId.informatie.goed);
  assert.equal(profiel.ontwikkelpunten[0], 'Artificiële intelligentie');
  assert.equal(profiel.adviezen.length, 2);
});

test('zonder deel B is het profiel voorlopig en zegt de tekst dat', () => {
  const alleenA = Object.fromEntries(
    Object.entries(mapping).filter(([, regel]) => regel.les === 'A').map(([itemId]) => [itemId, { completed: true, isCorrect: true }])
  );
  const profiel = buildNulmetingProfiel({ analysemodel, mapping, itemRecords: alleenA });
  assert.equal(profiel.status, 'voorlopig');
  assert.deepEqual(profiel.ontbrekendeDelen, ['B']);
  assert.equal(profiel.totaal.gemaakt, 27);
  assert.match(profiel.leerlingTekst, /voorlopig beeld/);
});

test('de leerlingtekst blijft positief en eenvoudig', () => {
  assert.equal(bouwLeerlingTekst({ sterkePunten: ['Veiligheid en privacy'], ontwikkelpunten: [] }), 'Je bent al goed in veiligheid en privacy. Je basis is op orde; je kunt in de lessen extra uitdaging kiezen.');
  assert.equal(bouwLeerlingTekst({}), 'Je startprofiel wordt gevuld zodra je de nulmeting hebt gemaakt.');
});
