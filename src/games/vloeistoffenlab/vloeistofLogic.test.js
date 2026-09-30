import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KIJK_OPGAVE, maakWeegOpgaven, plekInToren, plekKeuzes, TOREN, TOREN_VOORWERPEN, VLOEISTOFFEN, vloeistof, zoekVloeistof
} from './vloeistofLogic.js';

const zaad = (start) => {
  let s = start;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

test('vloeistoffen: op één decimaal allemaal verschillend', () => {
  const afgerond = VLOEISTOFFEN.map((v) => Math.round(v.rho * 10) / 10);
  assert.equal(new Set(afgerond).size, VLOEISTOFFEN.length);
  assert.equal(zoekVloeistof(0.92).id, 'olie');
  assert.equal(zoekVloeistof(0.9).id, 'olie');
  assert.equal(zoekVloeistof(1.4).id, 'honing');
  assert.equal(zoekVloeistof(3), null);
});

test('weegopgaven: de berekende dichtheid wijst terug naar de goede vloeistof', () => {
  for (let i = 1; i <= 500; i += 1) {
    const opgaven = maakWeegOpgaven(zaad(i));
    assert.deepEqual(opgaven.map((o) => o.methode), ['aftrekken', 'tarra', 'tarra']);
    assert.equal(new Set(opgaven.map((o) => o.vloeistof)).size, 3);
    for (const o of opgaven) {
      assert.ok(o.V >= 30 && o.V <= 80 && Number.isInteger(o.V));
      assert.ok(Math.abs(o.mVol - o.mLeeg - o.m) < 1e-9);
      const rho = o.m / o.V;
      assert.equal(zoekVloeistof(rho).id, o.vloeistof, JSON.stringify(o));
      assert.equal(zoekVloeistof(Math.round(rho * 10) / 10).id, o.vloeistof, `1 decimaal: ${JSON.stringify(o)}`);
      assert.ok(o.mVol < 2000);
    }
  }
  assert.equal(KIJK_OPGAVE.m / KIJK_OPGAVE.V, 0.92);
});

test('toren: lagen van zwaar naar licht, voorwerpen op de goede plek', () => {
  const rhos = TOREN.map((id) => vloeistof(id).rho);
  assert.deepEqual([...rhos].sort((a, b) => b - a), rhos);
  const plek = Object.fromEntries(TOREN_VOORWERPEN.map((v) => [v.id, plekInToren(v.rho).id]));
  assert.deepEqual(plek, { kurk: 'op-spiritus', ijs: 'zweeft-olie', druif: 'op-afwasmiddel', gum: 'op-honing', knikker: 'bodem' });
  for (let i = 1; i <= 100; i += 1) {
    for (const v of TOREN_VOORWERPEN) {
      const k = plekKeuzes(v, zaad(i));
      assert.equal(k.opties.length, 4);
      assert.ok(k.opties.some((o) => o.id === k.goed));
      assert.equal(new Set(k.opties.map((o) => o.tekst)).size, 4);
    }
  }
});
