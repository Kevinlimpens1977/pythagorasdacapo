import test from 'node:test';
import assert from 'node:assert/strict';
import {
  beoordeelUitkomst, driehoekWaarden, KIJK_DRIEHOEK, KIJK_METEN, maakDriehoekOpgaven, maakKurk, maakMeetOpgaven,
  maakPracticum, reken, stof, STOFFEN, zoekStof
} from './dichtheidLogic.js';

const zaad = (start) => {
  let s = start;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};
const rond1 = (x) => Math.round(x * 10) / 10;

test('boekje: 24 stoffen, antwoord-stoffen minstens 0,3 uit elkaar', () => {
  assert.equal(STOFFEN.length, 24);
  const antwoorden = STOFFEN.filter((item) => item.antwoord).map((item) => item.rho).sort((a, b) => a - b);
  for (let i = 1; i < antwoorden.length; i += 1) {
    assert.ok(antwoorden[i] - antwoorden[i - 1] >= 0.3 - 1e-9, `${antwoorden[i - 1]} en ${antwoorden[i]}`);
  }
  assert.equal(stof('ijzer').rho, 7.9);
  assert.equal(zoekStof(8.9).id, 'koper');
  assert.equal(zoekStof(0.9).id, 'ijs');
  assert.equal(zoekStof(3.3), null);
});

test('afronden: één decimaal, of twee mits goed afgerond', () => {
  assert.equal(beoordeelUitkomst('0,6', 21 / 36).goed, true);
  assert.equal(beoordeelUitkomst('0,58', 21 / 36).goed, true);
  assert.equal(beoordeelUitkomst('0,5833', 21 / 36).soort, 'nietAfgerond');
  assert.equal(beoordeelUitkomst('0,5', 21 / 36).goed, false);
  assert.equal(beoordeelUitkomst('8,9', 106.8 / 12).goed, true);
  assert.equal(beoordeelUitkomst('19,3', 144.7 / 7.5).goed, true);
  assert.equal(beoordeelUitkomst('', 1).soort, 'leeg');
});

test('meetopgaven rekenen altijd terug naar de goede stof', () => {
  for (let i = 1; i <= 400; i += 1) {
    const opgaven = maakMeetOpgaven(zaad(i));
    assert.equal(opgaven.length, 3);
    assert.equal(new Set(opgaven.map((o) => o.stof)).size, 3);
    for (const o of opgaven) {
      assert.equal(o.V, Math.round(o.l * o.b * o.h * 1000) / 1000);
      assert.equal(rond1(o.m / o.V), stof(o.stof).rho, JSON.stringify(o));
      assert.ok(o.l <= 7 && o.b <= 4 && o.h <= 3);
    }
    assert.equal(opgaven[2].l % 1, 0.5, 'de laatste meet je in halve centimeters');
  }
  for (const k of KIJK_METEN) assert.equal(rond1(k.m / (k.l * k.b * k.h)), stof(k.stof).rho);
});

test('driehoekopgaven: 2x massa, 2x volume, antwoorden kloppen', () => {
  for (let i = 1; i <= 200; i += 1) {
    const opgaven = maakDriehoekOpgaven(zaad(i));
    assert.deepEqual(opgaven.map((o) => o.gezocht), ['m', 'V', 'm', 'V']);
    for (const o of opgaven) {
      const w = driehoekWaarden(o);
      const uitkomst = reken(o.gezocht, w);
      assert.ok(Number.isFinite(uitkomst) && uitkomst > 0);
      if (o.gezocht === 'V') assert.ok(Math.abs(uitkomst - Math.round(uitkomst)) < 0.05, JSON.stringify(o));
    }
  }
  assert.equal(reken('m', driehoekWaarden(KIJK_DRIEHOEK[0])), 27);
  assert.equal(rond1(reken('V', driehoekWaarden(KIJK_DRIEHOEK[1]))), 10);
  assert.equal(rond1(reken('rho', driehoekWaarden(KIJK_DRIEHOEK[2]))), 8.9);
});

test('practicum en kurk: past in de maatcilinder en rekent terug', () => {
  for (let i = 1; i <= 200; i += 1) {
    const p = maakPracticum(zaad(i));
    assert.ok(p.V >= 4 && p.V <= 22);
    assert.equal(rond1(p.m / p.V), stof(p.stof).rho);
    assert.ok(stof(p.stof).rho > 1, 'het voorwerp zinkt');
    const k = maakKurk(zaad(i));
    assert.equal(rond1(k.m / k.V), 0.2);
    assert.equal(k.drijfVerplaatsing, k.m);
    assert.equal(k.V % 5, 0);
  }
  assert.equal(maakPracticum(zaad(3), 'messing').stof, 'messing');
});
