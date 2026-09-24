import test from 'node:test';
import assert from 'node:assert/strict';
import { cijferUitTelling, geldigeTelling, groepsCijfer } from './spelCijfer.js';

test('cijfer: 10 bij alles goed, 1 bij alles een keer fout, lineair ertussen', () => {
  assert.equal(cijferUitTelling({ onderdelen: 52, minpunten: 0 }), 10);
  assert.equal(cijferUitTelling({ onderdelen: 52, minpunten: 52 }), 1);
  assert.equal(cijferUitTelling({ onderdelen: 52, minpunten: 10 }), 8.3);
  assert.equal(cijferUitTelling({ onderdelen: 52, minpunten: 80 }), 1, 'nooit onder de 1');
  assert.equal(cijferUitTelling({ onderdelen: 0, minpunten: 0 }), null);
});

test('groepscijfer pas als alle spellen een ronde hebben', () => {
  const ids = ['a', 'b', 'c'];
  const half = groepsCijfer({ a: { onderdelen: 20, minpunten: 2 } }, ids);
  assert.equal(half.cijfer, null);
  assert.equal(half.aantalAf, 1);
  const heel = groepsCijfer({ a: { onderdelen: 20, minpunten: 2 }, b: { onderdelen: 16, minpunten: 1 }, c: { onderdelen: 16, minpunten: 3 } }, ids);
  assert.equal(heel.onderdelen, 52);
  assert.equal(heel.cijfer, 9, '10 - 9 × 6/52 = 8,96, afgerond 9,0');
});

test('telling: onzin wordt geweigerd', () => {
  assert.equal(geldigeTelling({ onderdelen: 20, minpunten: 3 }), true);
  assert.equal(geldigeTelling({ onderdelen: 0, minpunten: 0 }), false);
  assert.equal(geldigeTelling({ onderdelen: 5, minpunten: 11 }), false);
  assert.equal(geldigeTelling({ onderdelen: 2.5, minpunten: 0 }), false);
});
