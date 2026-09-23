import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVATAR_DELEN, AVATAR_SETS, completeSets, dagenTotEindeSeizoen, deelTeKoop, magDeelDragen, normaliseerAvatar,
  seizoenOp, SEIZOENEN, shopItemIdVoorDeel, STANDAARD_AVATAR
} from './avatarDelen.js';

test('elk slot heeft minstens één gratis onderdeel, ook een hoofddoek', () => {
  for (const slot of ['kapsel', 'kleding', 'accessoire', 'achtergrond', 'emote']) {
    assert.ok(AVATAR_DELEN.some((deel) => deel.slot === slot && deel.prijs === 0), slot);
  }
  assert.equal(AVATAR_DELEN.find((deel) => deel.id === 'kapsel-hoofddoek').prijs, 0);
  assert.equal(new Set(AVATAR_DELEN.map((deel) => deel.id)).size, AVATAR_DELEN.length);
});

test('normaliseerAvatar zet onbekende of verkeerde waarden terug', () => {
  assert.deepEqual(normaliseerAvatar({}), STANDAARD_AVATAR);
  const avatar = normaliseerAvatar({ huid: 'huid-5', kapsel: 'kleding-hoodie', accessoire: 'accessoire-bril', haarkleur: 'onzin' });
  assert.equal(avatar.huid, 'huid-5');
  assert.equal(avatar.kapsel, STANDAARD_AVATAR.kapsel, 'een kledingstuk kan geen kapsel zijn');
  assert.equal(avatar.accessoire, 'accessoire-bril');
  assert.equal(avatar.haarkleur, STANDAARD_AVATAR.haarkleur);
});

test('dragen: gratis altijd, betaald alleen na aankoop, setbonus alleen na toekenning', () => {
  assert.equal(magDeelDragen('kapsel-hoofddoek'), true);
  assert.equal(magDeelDragen('kapsel-krullen'), false);
  assert.equal(magDeelDragen('kapsel-krullen', new Set([shopItemIdVoorDeel('kapsel-krullen')])), true);
  assert.equal(magDeelDragen('accessoire-erlenmeyer'), false);
  assert.equal(magDeelDragen('accessoire-erlenmeyer', new Set(['avatar-accessoire-erlenmeyer'])), true);
  assert.equal(magDeelDragen('bestaat-niet'), false);
});

test('sets: compleet als alle drie de delen gekocht zijn', () => {
  const lab = AVATAR_DELEN.filter((deel) => deel.set === 'labset').map((deel) => shopItemIdVoorDeel(deel.id));
  assert.equal(lab.length, 3);
  assert.deepEqual(completeSets(new Set(lab.slice(0, 2))), []);
  assert.deepEqual(completeSets(new Set(lab)).map((set) => set.id), ['labset']);
  assert.equal(AVATAR_SETS.length, 2);
});

test('seizoenen: de juiste op elke datum, ook over de jaarwisseling', () => {
  assert.equal(seizoenOp(new Date('2026-09-23T10:00:00Z')).id, 'herfst');
  assert.equal(seizoenOp(new Date('2026-12-05T10:00:00Z')).id, 'winter');
  assert.equal(seizoenOp(new Date('2027-01-20T10:00:00Z')).id, 'winter');
  assert.equal(seizoenOp(new Date('2027-02-14T10:00:00Z')).id, 'carnaval');
  assert.equal(seizoenOp(new Date('2027-06-01T10:00:00Z')).id, 'lente');
  assert.equal(seizoenOp(new Date('2027-08-10T10:00:00Z')), null, 'zomervakantie: geen seizoen');
  // 15 november 23:30 UTC is in Nederland al 16 november.
  assert.equal(seizoenOp(new Date('2026-11-15T23:30:00Z')).id, 'winter');
  assert.equal(dagenTotEindeSeizoen(new Date('2026-11-15T10:00:00Z')), 1);
});

test('seizoensitems: alleen in hun seizoen te koop, elk seizoen heeft er twee', () => {
  const herfst = new Date('2026-10-10T10:00:00Z');
  assert.equal(deelTeKoop('accessoire-heksenhoed', herfst), true);
  assert.equal(deelTeKoop('accessoire-muts', herfst), false);
  assert.equal(deelTeKoop('kapsel-krullen', herfst), true);
  for (const seizoen of SEIZOENEN) {
    assert.equal(AVATAR_DELEN.filter((deel) => deel.seizoen === seizoen.id).length, 2, seizoen.id);
  }
  assert.equal(normaliseerAvatar({}).emote, 'emote-spring');
});
