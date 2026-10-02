import test from 'node:test';
import assert from 'node:assert/strict';
import { valideerDraaiboek } from './draaiboek.mjs';

const goed = () => ({
  hoofdstukId: 'hoofdstuk-x',
  doelParagraafId: 'paragraaf-x',
  titel: 'Massa',
  kijkvraag: 'Hoe meet je massa?',
  meta: 'Binask H2',
  scenes: [{
    id: 's1', kop: 'MASSA', fase: 'KIJK', indeling: 'SPLIT',
    shot: { naam: 'massa-rijst', frames: 1 },
    kernwoorden: [{ tekst: 'massa', bij: 'r1' }],
    getekend: [{ type: 'weegschaal', items: [{ label: 'pak rijst', waarde: 750 }], eenheid: 'g', bij: 'r1' }],
    regels: [{ id: 'r1', spreker: 'docent', tekst: 'Massa is 750 g.', uitspraak: 'Massa is zevenhonderdvijftig gram.' }]
  }]
});

test('valideerDraaiboek keurt een goed draaiboek goed', () => {
  assert.deepEqual(valideerDraaiboek(goed()), []);
});

test('valideerDraaiboek meldt een lege of ontbrekende kop', () => {
  const leeg = goed();
  leeg.scenes[0].kop = '';
  assert.match(valideerDraaiboek(leeg).join('\n'), /Scène s1: kop ontbreekt\./);

  const ontbreekt = goed();
  delete ontbreekt.scenes[0].kop;
  assert.match(valideerDraaiboek(ontbreekt).join('\n'), /Scène s1: kop ontbreekt\./);

  const spaties = goed();
  spaties.scenes[0].kop = '   ';
  assert.match(valideerDraaiboek(spaties).join('\n'), /Scène s1: kop ontbreekt\./);
});

test('valideerDraaiboek keurt een volledige driehoek goed', () => {
  const d = goed();
  d.scenes[0].getekend.push({
    type: 'driehoek', bij: 'r1', boven: 'm', linksOnder: 'ρ', rechtsOnder: 'V',
    formules: ['ρ = m / V', 'm = ρ × V', 'V = m / ρ']
  });
  assert.deepEqual(valideerDraaiboek(d), []);
});

test('valideerDraaiboek eist de symbolen en drie formules bij een driehoek', () => {
  const kaal = goed();
  kaal.scenes[0].getekend.push({ type: 'driehoek', bij: 'r1' });
  const fouten = valideerDraaiboek(kaal).join('\n');
  assert.match(fouten, /Scène s1: driehoek mist boven\./);
  assert.match(fouten, /Scène s1: driehoek mist linksOnder\./);
  assert.match(fouten, /Scène s1: driehoek mist rechtsOnder\./);
  assert.match(fouten, /Scène s1: driehoek heeft precies drie formules nodig\./);

  const twee = goed();
  twee.scenes[0].getekend.push({ type: 'driehoek', bij: 'r1', boven: 'm', linksOnder: 'ρ', rechtsOnder: 'V', formules: ['ρ = m / V', 'm = ρ × V'] });
  assert.match(valideerDraaiboek(twee).join('\n'), /Scène s1: driehoek heeft precies drie formules nodig\./);

  const leeg = goed();
  leeg.scenes[0].getekend.push({ type: 'driehoek', bij: 'r1', boven: ' ', linksOnder: 'ρ', rechtsOnder: 'V', formules: ['ρ = m / V', '', 'V = m / ρ'] });
  const leegFouten = valideerDraaiboek(leeg).join('\n');
  assert.match(leegFouten, /Scène s1: driehoek mist boven\./);
  assert.match(leegFouten, /Scène s1: driehoek heeft precies drie formules nodig\./);
});

test('valideerDraaiboek kent alleen bekende voorwerpen in de maatcilinder', () => {
  const metSteen = goed();
  metSteen.scenes[0].getekend.push({ type: 'maatcilinder', van: 15, naar: 25, max: 30, stap: 5, eenheid: 'ml', bij: 'r1', stijgBij: 'r1', voorwerp: 'steen' });
  assert.deepEqual(valideerDraaiboek(metSteen), []);

  const zonder = goed();
  zonder.scenes[0].getekend.push({ type: 'maatcilinder', van: 15, naar: 25, max: 30, stap: 5, eenheid: 'ml', bij: 'r1', stijgBij: 'r1' });
  assert.deepEqual(valideerDraaiboek(zonder), []);

  const onbekend = goed();
  onbekend.scenes[0].getekend.push({ type: 'maatcilinder', van: 15, naar: 25, max: 30, stap: 5, eenheid: 'ml', bij: 'r1', stijgBij: 'r1', voorwerp: 'blokje' });
  assert.match(valideerDraaiboek(onbekend).join('\n'), /Scène s1: voorwerp "blokje" bestaat niet in de maatcilinder\./);
});

test('valideerDraaiboek vindt de bekende fouten', () => {
  const d = goed();
  d.scenes[0].kop = 'EEN KOP VAN VEEL TE VEEL WOORDEN HIER';
  d.scenes[0].fase = 'DOE';
  d.scenes[0].regels.push({ id: 'r1', spreker: 'juf', tekst: 'Top! \u{1F600}', uitspraak: 'Bij BiNaSk zeggen we massa.' });
  d.scenes[0].getekend[0].bij = 'r9';
  const fouten = valideerDraaiboek(d).join('\n');
  assert.match(fouten, /kop heeft meer dan zes woorden/);
  assert.match(fouten, /fase "DOE"/);
  assert.match(fouten, /regel-id r1 komt dubbel voor/);
  assert.match(fouten, /spreker "juf"/);
  assert.match(fouten, /emoji/);
  assert.match(fouten, /BiNaSk/);
  assert.match(fouten, /verwijst naar onbekende regel r9/);
});
