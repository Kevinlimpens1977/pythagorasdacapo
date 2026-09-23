import test from 'node:test';
import assert from 'node:assert/strict';

import { bouwKlasTestbeeld, bouwTestdataOverzicht } from './testleerlingOverzicht.js';

const paragraaf = (id, extra = {}) => ({
  id,
  code: '2.1',
  title: 'Invoer en uitvoer',
  hoofdstukId: 'hoofdstuk-h2',
  hoofdstukTitle: 'H2',
  niveauId: 'niveau-kb',
  order: 1,
  ...extra
});

const blok = (id, paragraafId) => ({ id, paragraafId, type: 'theory', status: 'published', isArchived: false });

test('een klas zonder route ziet alles wat is toegewezen', () => {
  const beeld = bouwKlasTestbeeld({
    klasData: { id: 'klas-1', niveauId: '', enabledParagrafen: ['p-1', 'p-2'] },
    leerlingId: 'testleerling-h1k2',
    paragrafenById: {
      'p-1': paragraaf('p-1'),
      'p-2': paragraaf('p-2', { code: '2.2', order: 2 })
    },
    blokkenPerParagraaf: {
      'p-1': [blok('b-1', 'p-1'), blok('b-2', 'p-1')],
      'p-2': [blok('b-3', 'p-2')]
    }
  });

  assert.equal(beeld.aantalZichtbaar, 2);
  assert.equal(beeld.aantalBlokken, 3);
  assert.deepEqual(beeld.problemen, []);
  assert.equal(beeld.lessen[0].label, '2.1 Invoer en uitvoer');
});

test('de leerroute van de klas kan een toegewezen paragraaf tegenhouden', () => {
  const beeld = bouwKlasTestbeeld({
    klasData: { id: 'klas-1', niveauId: 'niveau-kb', enabledParagrafen: ['p-1', 'p-tl'] },
    leerlingId: 'testleerling-h1k2',
    paragrafenById: {
      'p-1': paragraaf('p-1'),
      'p-tl': paragraaf('p-tl', { niveauId: 'niveau-tl', code: '1.0', title: 'Nulmeting' })
    },
    blokkenPerParagraaf: { 'p-1': [blok('b-1', 'p-1')] }
  });

  assert.equal(beeld.aantalZichtbaar, 1);
  assert.equal(beeld.problemen.length, 1);
  assert.equal(beeld.problemen[0].soort, 'routeBlokkeert');
  assert.match(beeld.problemen[0].tekst, /1\.0 Nulmeting/);
});

test('een toegewezen paragraaf die niet meer bestaat wordt gemeld', () => {
  const beeld = bouwKlasTestbeeld({
    klasData: { id: 'klas-1', niveauId: '', enabledParagrafen: ['p-weg'] },
    leerlingId: 'testleerling-h1k2',
    paragrafenById: {},
    blokkenPerParagraaf: {}
  });

  assert.equal(beeld.aantalZichtbaar, 0);
  assert.equal(beeld.problemen[0].soort, 'paragraafWeg');
});

test('een zichtbare paragraaf zonder lesblokken is een probleem', () => {
  const beeld = bouwKlasTestbeeld({
    klasData: { id: 'klas-1', niveauId: '', enabledParagrafen: ['p-1'] },
    leerlingId: 'testleerling-h1k2',
    paragrafenById: { 'p-1': paragraaf('p-1') },
    blokkenPerParagraaf: { 'p-1': [] }
  });

  assert.equal(beeld.problemen[0].soort, 'geenBlokken');
  assert.match(beeld.problemen[0].tekst, /geen enkel gepubliceerd lesblok/);
});

test('een blokselectie die blokken weglaat wordt geteld en gemeld', () => {
  const beeld = bouwKlasTestbeeld({
    klasData: {
      id: 'klas-1',
      niveauId: '',
      enabledParagrafen: ['p-1'],
      enabledContentBlocks: { 'p-1': ['b-1'] }
    },
    leerlingId: 'testleerling-h1k2',
    paragrafenById: { 'p-1': paragraaf('p-1') },
    blokkenPerParagraaf: { 'p-1': [blok('b-1', 'p-1'), blok('b-2', 'p-1')] }
  });

  assert.equal(beeld.lessen[0].aantalBlokken, 1);
  assert.equal(beeld.problemen[0].soort, 'blokselectie');
  assert.match(beeld.problemen[0].tekst, /1 van de 2/);
});

test('bouwTestdataOverzicht telt per paragraaf en vindt werk buiten de lesstof', () => {
  const lessen = [
    { id: 'p-1', label: '2.1 Invoer en uitvoer', aantalBlokken: 3 },
    { id: 'p-2', label: '2.2 Software', aantalBlokken: 2 }
  ];
  const records = [
    { paragraafId: 'p-1', completed: true, updatedAt: new Date('2026-09-21T10:00:00Z') },
    { paragraafId: 'p-1', completed: false, updatedAt: new Date('2026-09-21T11:00:00Z') },
    { paragraafId: 'p-oud', completed: true }
  ];

  const overzicht = bouwTestdataOverzicht({ records, lessen });

  assert.equal(overzicht.totaalRecords, 3);
  assert.deepEqual(overzicht.regels[0], {
    paragraafId: 'p-1',
    label: '2.1 Invoer en uitvoer',
    gemaakt: 2,
    afgerond: 1,
    totaal: 3,
    laatsteActiviteitMs: new Date('2026-09-21T11:00:00Z').getTime()
  });
  assert.equal(overzicht.regels[1].gemaakt, 0);
  assert.deepEqual(overzicht.losseParagrafen, ['p-oud']);
});

test('testbeeld: geen dubbel nummer, volgorde per hoofdstuk en het slot telt mee', async () => {
  const { paragraafLabel } = await import('./chapterOutline.js');
  assert.equal(paragraafLabel({ code: '1.1', title: '1.1 Natuurwetenschappen' }), '1.1 Natuurwetenschappen');
  assert.equal(paragraafLabel({ code: '1.0', title: 'Nulmeting' }), '1.0 Nulmeting');
  assert.equal(paragraafLabel({ title: 'Zonder nummer' }), 'Zonder nummer');

  const paragrafenById = {
    a1: { id: 'a1', hoofdstukId: 'h1', code: '1.1', title: '1.1 Een', order: 1 },
    a2: { id: 'a2', hoofdstukId: 'h1', code: '1.2', title: '1.2 Twee', order: 2 },
    b1: { id: 'b1', hoofdstukId: 'h2', code: '2.1', title: '2.1 Drie', order: 1 },
    b2: { id: 'b2', hoofdstukId: 'h2', code: '2.2', title: '2.2 Vier', order: 2 }
  };
  const beeld = bouwKlasTestbeeld({
    klasData: { id: 'klas-1', enabledParagrafen: ['a1', 'b1', 'a2', 'b2'], vergrendeldeHoofdstukken: ['h2'] },
    leerlingId: 'testleerling-x',
    paragrafenById,
    hoofdstukkenById: { h1: { id: 'h1', number: 1 }, h2: { id: 'h2', number: 2 } }
  });
  assert.deepEqual(beeld.lessen.map((les) => les.label), ['1.1 Een', '1.2 Twee', '2.1 Drie', '2.2 Vier']);
  assert.deepEqual(beeld.lessen.map((les) => les.opSlot), [false, false, true, true]);
  assert.equal(beeld.aantalZichtbaar, 2);
  assert.equal(beeld.aantalOpSlot, 2);
});
