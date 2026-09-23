import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVATAR_DELEN, AVATAR_SETS, completeSets, magDeelDragen, normaliseerAvatar, shopItemIdVoorDeel, STANDAARD_AVATAR
} from './avatarDelen.js';

test('elk slot heeft minstens één gratis onderdeel, ook een hoofddoek', () => {
  for (const slot of ['kapsel', 'kleding', 'accessoire', 'achtergrond']) {
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
