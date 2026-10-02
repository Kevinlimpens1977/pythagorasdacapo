import test from 'node:test';
import assert from 'node:assert/strict';
import { bouwTiming } from './timing.mjs';

test('bouwTiming neemt elke regel uit het draaiboek over', () => {
  const draaiboek = { scenes: [{ regels: [{ id: 'a' }, { id: 'b' }] }] };
  const duren = { a: { bestand: 'audio/a.mp3', duur: 2.0414 }, b: { bestand: 'audio/b.mp3', duur: 1 } };
  assert.deepEqual(bouwTiming(draaiboek, duren), {
    fps: 30,
    regels: { a: { bestand: 'audio/a.mp3', duur: 2.041 }, b: { bestand: 'audio/b.mp3', duur: 1 } }
  });
  assert.throws(() => bouwTiming(draaiboek, { a: duren.a }), /Geen opname voor regel b/);
});
