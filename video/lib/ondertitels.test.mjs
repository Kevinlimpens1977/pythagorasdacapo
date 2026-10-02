import test from 'node:test';
import assert from 'node:assert/strict';
import { tijdcode, breekTekst, maakVtt } from './ondertitels.mjs';

test('tijdcode schrijft uren, minuten, seconden en milliseconden', () => {
  assert.equal(tijdcode(0), '00:00:00.000');
  assert.equal(tijdcode(61.5), '00:01:01.500');
  assert.equal(tijdcode(3725.0274), '01:02:05.027');
});

test('breekTekst breekt op woorden, maximaal 42 tekens', () => {
  const regels = breekTekst('Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal.');
  assert.ok(regels.every((r) => r.length <= 42));
  assert.equal(regels.join(' '), 'Massa is hoeveel gram of kilogram iets is. Je meet massa met een weegschaal.');
});

test('maakVtt maakt cues met spreker en hooguit twee regels', () => {
  const tijdlijn = {
    scenes: [{
      regels: [
        { id: 'a', spreker: 'sami', tekst: 'En wat is volume?', start: 1, duur: 1.2, eind: 2.2 },
        { id: 'b', spreker: 'docent', tekst: 'Stap 3: reken het verschil uit. 25 − 15 = 10. De steen heeft een volume van 10 cm³ en dat is <precies> goed.', start: 3, duur: 6, eind: 9 }
      ]
    }]
  };
  const vtt = maakVtt(tijdlijn);
  assert.ok(vtt.startsWith('WEBVTT\n\n'));
  assert.match(vtt, /00:00:01\.000 --> 00:00:02\.200\n<v Sami>En wat is volume\?/);
  assert.match(vtt, /<v Docent>Stap 3/);
  assert.match(vtt, /&lt;precies&gt;/);
  const cues = vtt.trim().split('\n\n').slice(1);
  for (const cue of cues) {
    const tekstRegels = cue.split('\n').slice(1);
    assert.ok(tekstRegels.length <= 2, cue);
    tekstRegels.forEach((r) => assert.ok(r.replace(/^<v [^>]+>/, '').length <= 42, r));
  }
  const laatste = cues[cues.length - 1];
  assert.match(laatste, /--> 00:00:09\.000/);
});

// Een tijdlijn met twee regels, voor de tests met vertaalde teksten.
const tweeRegels = () => ({
  scenes: [{
    regels: [
      { id: 'a', spreker: 'sami', tekst: 'En wat is volume?', start: 1, duur: 1.2, eind: 2.2 },
      { id: 'b', spreker: 'docent', tekst: 'Volume is hoeveel ruimte iets inneemt. De letter is V. Water meet je met een maatcilinder.', start: 3, duur: 6, eind: 9 }
    ]
  }]
});

test('maakVtt zonder teksten is byte-gelijk aan maakVtt met lege teksten', () => {
  const tijdlijn = tweeRegels();
  const basis = maakVtt(tijdlijn);
  assert.equal(maakVtt(tijdlijn, {}), basis);
  assert.equal(maakVtt(tijdlijn, { teksten: {} }), basis);
  assert.equal(maakVtt(tijdlijn, { teksten: undefined }), basis);
});

test('maakVtt gebruikt een vertaalde tekst per regel met dezelfde tijden en sprekers', () => {
  const tijdlijn = tweeRegels();
  const teksten = {
    a: 'And what is volume (volume)?',
    b: 'Volume is how much space something takes up. The letter is V. You measure water with a measuring cylinder (maatcilinder).'
  };
  const nl = maakVtt(tijdlijn);
  const en = maakVtt(tijdlijn, { teksten });
  assert.match(en, /00:00:01\.000 --> 00:00:02\.200\n<v Sami>And what is volume \(volume\)\?/);
  assert.match(en, /<v Docent>Volume is how much space/);
  assert.doesNotMatch(en, /Water meet je/);
  const cues = en.trim().split('\n\n').slice(1);
  for (const cue of cues) {
    const tekstRegels = cue.split('\n').slice(1);
    assert.ok(tekstRegels.length <= 2, cue);
    tekstRegels.forEach((r) => assert.ok(r.replace(/^<v [^>]+>/, '').length <= 42, r));
  }
  // Begin en eind van elke regel blijven gelijk aan de Nederlandse versie.
  const grenzen = (vtt) => vtt.match(/\d\d:\d\d:\d\d\.\d{3}/g);
  assert.equal(grenzen(en)[0], grenzen(nl)[0]);
  assert.equal(grenzen(en).at(-1), grenzen(nl).at(-1));
  assert.ok(en.includes('--> 00:00:09.000'));
});

test('maakVtt valt per regel terug op de Nederlandse tekst als een vertaling ontbreekt', () => {
  const vtt = maakVtt(tweeRegels(), { teksten: { a: 'Ve hacim nedir?' } });
  assert.match(vtt, /<v Sami>Ve hacim nedir\?/);
  assert.match(vtt, /<v Docent>Volume is hoeveel ruimte/);
});

test('breekTekst breekt nooit binnen een bidi-isolaat (LRI ... PDI)', () => {
  const zinnen = [
    'Stap 3: reken het verschil uit, dus \u206625 − 15 = 10\u2069. Het volume is \u206610 cm³\u2069.',
    'احسب الآن الفرق بين القراءتين: \u206625 − 15 = 10\u2069. حجم الحجر هو \u206610 cm³\u2069.'
  ];
  for (const zin of zinnen) {
    const regels = breekTekst(zin);
    assert.equal(regels.join(' '), zin);
    assert.ok(regels.some((r) => r.includes('\u206625 − 15 = 10\u2069')), JSON.stringify(regels));
    for (const r of regels) {
      const open = (r.match(/\u2066/g) || []).length;
      const dicht = (r.match(/\u2069/g) || []).length;
      assert.equal(open, dicht, `isolaat gebroken in: ${JSON.stringify(r)}`);
    }
  }
});

test('breekTekst telt de isolaattekens mee in de regellengte', () => {
  const regels = breekTekst('Een heel lange zin met aan het eind \u2066750 g\u2069 rijst erin.');
  assert.equal(regels[0], 'Een heel lange zin met aan het eind');
  assert.equal(regels[1], '\u2066750 g\u2069 rijst erin.');
});

test('breekTekst splitst tekst zonder isolaten zoals voorheen op elke witruimte', () => {
  assert.deepEqual(breekTekst('  a  b\tc\nd\u00a0e  '), ['a b c d e']);
  assert.deepEqual(breekTekst(''), []);
});

test('maakVtt schrijft binnen een bidi-isolaat harde spaties, zodat de browser de formule niet afbreekt', () => {
  const tijdlijn = {
    scenes: [{
      regels: [{ id: 'a', spreker: 'docent', tekst: 'x', start: 0, duur: 4, eind: 4 }]
    }]
  };
  const vtt = maakVtt(tijdlijn, { teksten: { a: 'الفرق هو ⁦25 − 15 = 10⁩ والحجم ⁦10 cm³⁩ اليوم.' } });
  assert.ok(vtt.includes('⁦25 − 15 = 10⁩'), JSON.stringify(vtt));
  assert.ok(vtt.includes('⁦10 cm³⁩'), JSON.stringify(vtt));
  // Buiten het isolaat blijven het gewone spaties.
  assert.ok(vtt.includes('الفرق هو ⁦'), JSON.stringify(vtt));
  assert.ok(vtt.includes('⁩ والحجم ⁦'), JSON.stringify(vtt));
  // Een isolaat zonder spaties of zonder sluitteken blijft zoals het was.
  const open = maakVtt(tijdlijn, { teksten: { a: 'een ⁦niet gesloten isolaat' } });
  assert.ok(open.includes('een ⁦niet gesloten isolaat'), JSON.stringify(open));
});

test('maakVtt laat tekst zonder isolaten byte-gelijk', () => {
  const tijdlijn = tweeRegels();
  assert.equal(
    maakVtt(tijdlijn),
    'WEBVTT\n\n'
    + '00:00:01.000 --> 00:00:02.200\n<v Sami>En wat is volume?\n\n'
    + '00:00:03.000 --> 00:00:08.124\n<v Docent>Volume is hoeveel ruimte iets inneemt. De\nletter is V. Water meet je met een\n\n'
    + '00:00:08.124 --> 00:00:09.000\n<v Docent>maatcilinder.\n'
  );
});
