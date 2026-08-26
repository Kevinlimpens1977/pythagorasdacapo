import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OEFEN_FASEN,
  createOefenFlow,
  huidigeOpgave,
  isLaatsteOpgave,
  kiesZelfoordeel,
  magOefenInleveren,
  verwerkInlevering,
  volgendeOpgave
} from './oefenFlow.js';

const velden = [
  { id: 'veld-1', label: 'Wat is een wachtwoordzin?' },
  { id: 'veld-2', label: 'Noem twee kenmerken van phishing.' }
];

const geslaagd = { success: true, isCorrect: true, feedback: 'Netjes uitgelegd.', modelAnswer: 'Een lange zin als wachtwoord.', explanation: 'Langer is sterker.' };

test('een nieuwe flow start bij opgave 1 in de probeerfase', () => {
  const flow = createOefenFlow(velden, 1000);
  assert.equal(flow.fase, OEFEN_FASEN.PROBEREN);
  assert.equal(flow.index, 0);
  assert.equal(flow.gestartOpMs, 1000);
  assert.equal(flow.afgerond, false);
  assert.equal(huidigeOpgave(flow).id, 'veld-1');
});

test('zonder opgaven is de flow direct afgerond', () => {
  assert.equal(createOefenFlow([]).afgerond, true);
});

test('inleveren mag alleen met een echt antwoord en alleen in de probeerfase', () => {
  const flow = createOefenFlow(velden, 1000);
  assert.equal(magOefenInleveren(flow, 'kort'), false);
  assert.equal(magOefenInleveren(flow, 'Een zin met genoeg tekens.'), true);

  const vergelijkend = verwerkInlevering(flow, { antwoord: 'Een zin met genoeg tekens.', assessment: geslaagd, nowMs: 5000 });
  assert.equal(magOefenInleveren(vergelijkend, 'Een zin met genoeg tekens.'), false);
});

test('een geslaagde beoordeling opent de vergelijkfase zonder record', () => {
  const flow = verwerkInlevering(createOefenFlow(velden, 1000), {
    antwoord: 'Mijn antwoord staat hier.',
    assessment: geslaagd,
    nowMs: 31000
  });
  assert.equal(flow.fase, OEFEN_FASEN.VERGELIJKEN);
  assert.equal(flow.ingeleverdOpMs, 31000);
  assert.equal(flow.assessment.modelAnswer, 'Een lange zin als wachtwoord.');
  assert.equal(flow.records.length, 0);
});

test('een gefaalde Digidocent slaat de zelfoordeelstap over met aiCorrect null', () => {
  const flow = verwerkInlevering(createOefenFlow(velden, 1000), {
    antwoord: 'Mijn antwoord staat hier.',
    assessment: { success: false, error: 'Digidocent kon je antwoord niet beoordelen.' },
    nowMs: 31000
  });
  assert.equal(flow.fase, OEFEN_FASEN.BEOORDEELD);
  assert.equal(flow.records.length, 1);
  const record = flow.records[0];
  assert.equal(record.fieldId, 'veld-1');
  assert.equal(record.aiCorrect, null);
  assert.equal(record.zelfoordeel, '');
  assert.equal(record.zelfoordeelOvergeslagen, true);
  assert.equal(record.denktijdMs, 30000);
});

test('het zelfoordeel is verplicht voordat de volgende opgave ontgrendelt', () => {
  const vergelijkend = verwerkInlevering(createOefenFlow(velden, 1000), {
    antwoord: 'Mijn antwoord staat hier.',
    assessment: geslaagd,
    nowMs: 31000
  });

  // Zonder oordeel geen stap vooruit.
  assert.equal(volgendeOpgave(vergelijkend, 32000), vergelijkend);
  // Een ongeldig oordeel verandert niets.
  assert.equal(kiesZelfoordeel(vergelijkend, { zelfoordeel: 'prima' }), vergelijkend);

  const beoordeeld = kiesZelfoordeel(vergelijkend, {
    zelfoordeel: 'nog_niet',
    antwoord: 'Mijn antwoord staat hier.',
    nowMs: 40000
  });
  assert.equal(beoordeeld.fase, OEFEN_FASEN.BEOORDEELD);
  assert.equal(beoordeeld.records.length, 1);
  assert.equal(beoordeeld.records[0].zelfoordeel, 'nog_niet');
  assert.equal(beoordeeld.records[0].aiCorrect, true);
  assert.equal(beoordeeld.records[0].beoordeeldOpMs, 40000);
});

test('volgende opgave reset de fase en de starttijd', () => {
  let flow = createOefenFlow(velden, 1000);
  flow = verwerkInlevering(flow, { antwoord: 'Mijn antwoord staat hier.', assessment: geslaagd, nowMs: 31000 });
  flow = kiesZelfoordeel(flow, { zelfoordeel: 'goed', antwoord: 'Mijn antwoord staat hier.', nowMs: 40000 });
  flow = volgendeOpgave(flow, 41000);

  assert.equal(flow.index, 1);
  assert.equal(flow.fase, OEFEN_FASEN.PROBEREN);
  assert.equal(flow.gestartOpMs, 41000);
  assert.equal(flow.assessment, null);
  assert.equal(flow.afgerond, false);
  assert.equal(isLaatsteOpgave(flow), true);
});

test('na de laatste opgave is de flow afgerond met een record per opgave', () => {
  let flow = createOefenFlow(velden, 1000);
  flow = verwerkInlevering(flow, { antwoord: 'Antwoord op opgave een.', assessment: geslaagd, nowMs: 20000 });
  flow = kiesZelfoordeel(flow, { zelfoordeel: 'goed', antwoord: 'Antwoord op opgave een.', nowMs: 21000 });
  flow = volgendeOpgave(flow, 22000);
  flow = verwerkInlevering(flow, { antwoord: 'Antwoord op opgave twee.', assessment: { ...geslaagd, isCorrect: false }, nowMs: 60000 });
  flow = kiesZelfoordeel(flow, { zelfoordeel: 'bijna', antwoord: 'Antwoord op opgave twee.', nowMs: 61000 });
  flow = volgendeOpgave(flow, 62000);

  assert.equal(flow.afgerond, true);
  assert.equal(flow.records.length, 2);
  assert.deepEqual(flow.records.map((r) => r.fieldId), ['veld-1', 'veld-2']);
  assert.equal(flow.records[1].aiCorrect, false);
  // Afgerond is afgerond: verdere overgangen veranderen niets meer.
  assert.equal(volgendeOpgave(flow, 63000), flow);
  assert.equal(magOefenInleveren(flow, 'Nog een antwoord.'), false);
});
