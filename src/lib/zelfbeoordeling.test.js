import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_SERIEUZE_DENKTIJD_MS,
  berekenSerieusSignalen,
  buildZelfbeoordelingRecord,
  isGeldigZelfoordeel,
  magInleveren
} from './zelfbeoordeling.js';

test('inleveren vereist een echt antwoord, geen toetsaanslag', () => {
  assert.equal(magInleveren('rds'), false);
  assert.equal(magInleveren('   '), false);
  assert.equal(magInleveren('Mijn gebruikersnaam is 204871.'), true);
});

test('record bewaart oordeel, tijden en denktijd', () => {
  const record = buildZelfbeoordelingRecord({
    fieldId: 'check-1',
    antwoord: '  204871, dat staat op mijn pasje  ',
    zelfoordeel: 'bijna',
    aiCorrect: true,
    gestartOpMs: 1000,
    ingeleverdOpMs: 31000,
    beoordeeldOpMs: 40000
  });
  assert.equal(record.zelfoordeel, 'bijna');
  assert.equal(record.denktijdMs, 30000);
  assert.equal(record.antwoord, '204871, dat staat op mijn pasje');
  assert.equal(record.aiCorrect, true);
});

test('een ongeldig zelfoordeel wordt geweigerd', () => {
  assert.throws(() => buildZelfbeoordelingRecord({ zelfoordeel: 'prima' }));
  assert.equal(isGeldigZelfoordeel('goed'), true);
  assert.equal(isGeldigZelfoordeel('prima'), false);
});

const record = (extra = {}) => buildZelfbeoordelingRecord({
  fieldId: 'f',
  antwoord: 'een net antwoord van voldoende lengte',
  zelfoordeel: 'goed',
  aiCorrect: true,
  gestartOpMs: 0,
  ingeleverdOpMs: MIN_SERIEUZE_DENKTIJD_MS + 5000,
  beoordeeldOpMs: MIN_SERIEUZE_DENKTIJD_MS + 9000,
  ...extra
});

test('serieus werk krijgt geen vlaggen', () => {
  const uitkomst = berekenSerieusSignalen([record(), record({ zelfoordeel: 'nog_niet', aiCorrect: false })]);
  assert.equal(uitkomst.serieus, true);
  assert.deepEqual(uitkomst.vlaggen, []);
});

test('eerlijk "nog niet" bij een afgekeurd antwoord is geen vlag', () => {
  const uitkomst = berekenSerieusSignalen([record({ zelfoordeel: 'nog_niet', aiCorrect: false })]);
  assert.equal(uitkomst.serieus, true);
});

test('"goed" kiezen waar de AI afkeurde geeft de afwijkingsvlag', () => {
  const uitkomst = berekenSerieusSignalen([record({ zelfoordeel: 'goed', aiCorrect: false })]);
  assert.equal(uitkomst.serieus, false);
  assert.equal(uitkomst.vlaggen[0].code, 'oordeel_wijkt_af');
});

test('structureel te snel inleveren geeft de snelheidsvlag', () => {
  const snel = { ingeleverdOpMs: 3000, beoordeeldOpMs: 4000 };
  const uitkomst = berekenSerieusSignalen([record(snel), record(snel)]);
  assert.equal(uitkomst.serieus, false);
  assert.equal(uitkomst.vlaggen[0].code, 'te_snel');
});

test('overal korte antwoorden geeft de kort-vlag', () => {
  const kort = { antwoord: 'ja toch' };
  const uitkomst = berekenSerieusSignalen([record(kort), record(kort), record()]);
  assert.equal(uitkomst.vlaggen.some((v) => v.code === 'korte_antwoorden'), true);
});

test('zonder zelfbeoordeelde records geen oordeel over serieus werken', () => {
  assert.deepEqual(berekenSerieusSignalen([]), { serieus: true, vlaggen: [] });
});
