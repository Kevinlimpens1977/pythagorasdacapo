import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwTijdlijn, controleerLengte, SCENE_AANLOOP, SCENE_UITLOOP, PAUZE_TUSSEN_REGELS } from './tijdlijn.mjs';

const draaiboek = {
  scenes: [
    { id: 's0', regels: [{ id: 'a', spreker: 'sami' }, { id: 'b', spreker: 'docent', pauzeNa: 4 }] },
    { id: 's1', regels: [{ id: 'c', spreker: 'docent' }] }
  ]
};
const timing = { fps: 30, regels: { a: { bestand: 'audio/a.mp3', duur: 2 }, b: { bestand: 'audio/b.mp3', duur: 3 }, c: { bestand: 'audio/c.mp3', duur: 1 } } };

test('bouwTijdlijn zet regels achter elkaar met pauzes', () => {
  const t = bouwTijdlijn(draaiboek, timing, 30);
  const [s0, s1] = t.scenes;
  assert.equal(s0.start, 0);
  assert.equal(s0.regels[0].start, SCENE_AANLOOP);
  assert.equal(s0.regels[1].start, SCENE_AANLOOP + 2 + PAUZE_TUSSEN_REGELS);
  const eindS0 = SCENE_AANLOOP + 2 + PAUZE_TUSSEN_REGELS + 3 + 4 + SCENE_UITLOOP;
  assert.ok(Math.abs(s0.eind - eindS0) < 1e-9);
  assert.ok(Math.abs(s1.start - eindS0) < 1e-9);
  assert.equal(t.totaalFrames, Math.round((eindS0 + SCENE_AANLOOP + 1 + SCENE_UITLOOP) * 30));
  assert.equal(s0.startFrame, 0);
  assert.equal(s1.startFrame, Math.round(eindS0 * 30));
});

test('bouwTijdlijn meldt een ontbrekende opname', () => {
  assert.throws(() => bouwTijdlijn(draaiboek, { regels: {} }), /Geen opname voor regel a/);
});

test('controleerLengte bewaakt de drie minuten', () => {
  assert.deepEqual(controleerLengte({ totaalSeconden: 179.9 }), { ok: true, seconden: 179.9 });
  assert.equal(controleerLengte({ totaalSeconden: 180.1 }).ok, false);
});
