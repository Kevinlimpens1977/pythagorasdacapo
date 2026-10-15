import test from 'node:test';
import assert from 'node:assert/strict';

import {
  beoordeelDomein,
  beoordeelLeerling,
  isGoed,
  niveauVanItem,
  sorteerDomeinen
} from './diffRekenenNulmeting.mjs';

const UID = 'leerling-a';

// Twaalf vragen zoals in docs/seeds/diff-rekenen.seed.json: 1-4 basis, 5-8 plus,
// 9-12 verdieping; vraag 2 is meerkeuze, de rest numeriek.
const maakItems = () => Array.from({ length: 12 }, (_, index) => {
  const niveau = ['basis', 'plus', 'verdieping'][Math.floor(index / 4)];
  const id = `quiz-${index + 1}`;
  if (index === 1) {
    const options = [
      { id: 'optie-1', text: '0,8', correct: true },
      { id: 'optie-2', text: '0,75', correct: false }
    ];
    return { id, type: 'meerkeuze', prompt: 'Welk getal is het grootst?', answer: { type: 'meerkeuze', options }, options, taxonomy: { masteryLevel: niveau } };
  }
  return { id, type: 'numeriek', prompt: `Vraag ${index + 1}`, answer: { type: 'numeriek', expected: 10 }, options: [], taxonomy: { masteryLevel: niveau } };
});

// Itemrecord in het formaat van buildAssessmentItemVoortgangUpdate.
const record = (blockId, nummer, { goed = true, antwoord = 10, userId = UID, ronde1 } = {}) => ({
  id: `quiz-${nummer}`,
  userId,
  blockId,
  itemId: `quiz-${nummer}`,
  itemIndex: nummer - 1,
  paragraafId: 'paragraaf-diff-rekenen-2-11',
  klasId: 'klas_1792053696147',
  progressType: 'assessmentItem',
  completed: true,
  isCorrect: goed,
  attempts: 1,
  maxAttempts: 1,
  attemptStatus: 'completed',
  lastAnswer: { value: antwoord },
  score: goed ? 1 : 0,
  maxScore: 1,
  ...(ronde1 ? { ronde1 } : {})
});

const BLOK = 'block-diff-rekenen-2-11-quiz-3';

test('niveau komt uit de taxonomie, anders uit de plek', () => {
  assert.equal(niveauVanItem({ taxonomy: { masteryLevel: 'plus' } }, 0), 'plus');
  assert.equal(niveauVanItem({}, 0), 'basis');
  assert.equal(niveauVanItem({}, 5), 'plus');
  assert.equal(niveauVanItem({}, 11), 'verdieping');
});

test('leeg domein: niets gemaakt, geen fout', () => {
  const uit = beoordeelDomein({ code: '1.1', blockId: BLOK, blockItems: maakItems(), itemRecords: [] });
  assert.equal(uit.gemaakt, 0);
  assert.equal(uit.goed, 0);
  assert.equal(uit.percentage, 0);
  assert.equal(uit.geschatNiveau, 'niet gemaakt');
  assert.equal(uit.vragen[0].goed, null);
});

test('telt per niveau en schat het niveau', () => {
  // Basis 4/4, plus 3/4, verdieping 2/4.
  const fout = new Set([8, 11, 12]);
  const records = Array.from({ length: 12 }, (_, i) => record(BLOK, i + 1, { goed: !fout.has(i + 1), antwoord: i === 1 ? 'optie-1' : 10 }));
  const uit = beoordeelDomein({ code: '1.1', blockId: BLOK, blockItems: maakItems(), itemRecords: records, userId: UID });
  assert.equal(uit.gemaakt, 12);
  assert.equal(uit.goed, 9);
  assert.equal(uit.percentage, 75);
  assert.deepEqual(uit.perNiveau.basis, { totaal: 4, gemaakt: 4, goed: 4 });
  assert.equal(uit.perNiveau.plus.goed, 3);
  assert.equal(uit.perNiveau.verdieping.goed, 2);
  assert.equal(uit.geschatNiveau, 'plus');
  assert.equal(uit.volledig, true);
  assert.equal(uit.vragen[1].antwoord, '0,8');
  assert.equal(uit.vragen[0].antwoord, '10');
});

test('onder basis en een half gemaakt domein', () => {
  const records = [record(BLOK, 1, { goed: true }), record(BLOK, 2, { goed: false, antwoord: 'optie-2' }), record(BLOK, 3, { goed: false })];
  const uit = beoordeelDomein({ code: '1.1', blockId: BLOK, blockItems: maakItems(), itemRecords: records });
  assert.equal(uit.geschatNiveau, 'onder basis');
  assert.equal(uit.volledig, false);
  assert.equal(uit.vragen[1].antwoord, '0,75');
  assert.equal(uit.vragen[1].goed, false);
  assert.equal(uit.vragen[5].gemaakt, false);
});

test('records van een andere leerling of ander blok tellen niet', () => {
  const records = [record(BLOK, 1, { userId: 'iemand-anders' }), record('ander-blok', 2)];
  const uit = beoordeelDomein({ blockId: BLOK, blockItems: maakItems(), itemRecords: records, userId: UID });
  assert.equal(uit.gemaakt, 0);
});

test('de eerste ronde telt boven een herkansing', () => {
  assert.equal(isGoed(record(BLOK, 1, { goed: true, ronde1: { isCorrect: false } })), false);
  assert.equal(isGoed({ attempts: 0, isCorrect: true, lastAnswer: null }), false);
});

test('volgorde: percentage, daarna hoger niveau goed', () => {
  const d = (code, percentage, basis, plus, verdieping) => ({
    code, percentage, perNiveau: { basis: { goed: basis }, plus: { goed: plus }, verdieping: { goed: verdieping } }
  });
  const volgorde = sorteerDomeinen([
    d('1.1', 50, 4, 2, 0),
    d('1.2', 50, 2, 2, 2),
    d('1.3', 75, 4, 3, 2),
    d('1.4', 50, 3, 3, 0)
  ]).map((x) => x.code);
  assert.deepEqual(volgorde, ['1.3', '1.2', '1.4', '1.1']);
});

test('leerling: volgorde alleen over gemaakte domeinen', () => {
  const items = maakItems();
  const domeinen = [
    { code: '1.1', titel: 'Getallen', blockId: 'b11', blockItems: items },
    { code: '1.2', titel: 'Verhoudingen', blockId: 'b12', blockItems: items },
    { code: '1.3', titel: 'Meten', blockId: 'b13', blockItems: items }
  ];
  const recordsPerBlok = {
    b11: [1, 2, 3].map((n) => record('b11', n, { goed: n !== 2 })),
    b12: [1, 2, 3, 4].map((n) => record('b12', n))
  };
  const uit = beoordeelLeerling({ domeinen, recordsPerBlok, userId: UID });
  assert.deepEqual(uit.volgorde, ['1.2', '1.1']);
  assert.deepEqual(uit.nietGemaakt, ['1.3']);
  assert.equal(uit.gemaakt, 7);
  assert.equal(uit.goed, 6);
  assert.equal(uit.domeinen[1].geschatNiveau, 'basis');
});
