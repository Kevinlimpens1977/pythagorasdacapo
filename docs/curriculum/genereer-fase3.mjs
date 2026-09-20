// Rekent per scenario uit hoe sterk de 45 vmbo-elementen in het curriculum zitten.
// Bron: dv-klas1-curriculum.json (basis van 22 lessen) en dv-scenarios.json.
//   node docs/curriculum/genereer-fase3.mjs <uitvoer.md>
import fs from 'node:fs';

const lees = (naam) => JSON.parse(fs.readFileSync(new URL(`./${naam}`, import.meta.url), 'utf8'));
const c = lees('dv-klas1-curriculum.json');
const s = lees('dv-scenarios.json');
const KD = Object.keys(c.kerndoelen);
const elementen = KD.flatMap((k) => Object.keys(c.kerndoelen[k].elementen));

const basis = c.lessen.map((l) => ({ bron: 'dv', elementen: l.elementen, blok: l.blok }));
const extra = s.extraLessen40.map((x) => ({ bron: 'dv', elementen: x.elementen }));
const vak = s.vakmomenten.map((v) => ({ bron: 'vak', elementen: v.elementen }));
// Oefenronde per blok: een terugblikvraag voor elk element dat in dat blok is geïntroduceerd.
const oefenrondes = Object.keys(c.blokken).map((b) => {
  const els = {};
  c.lessen.filter((l) => l.blok === b).forEach((l) => Object.entries(l.elementen).forEach(([e, r]) => { if (r.includes('I')) els[e] = ['h']; }));
  return { bron: 'helix', elementen: els };
});

const basis20 = c.lessen.filter((l) => ![20, 22].includes(l.nr)).map((l) => ({ bron: 'dv', elementen: l.elementen, blok: l.blok }));

const scenarios = [
  { code: 'A20', naam: '20 DV-lessen', eenheden: basis20, dvLessen: 20, extraTijd: 'geen' },
  { code: 'A', naam: '22 DV-lessen', eenheden: basis, dvLessen: 22, extraTijd: 'geen' },
  { code: 'B', naam: '40 DV-lessen in klas 1', eenheden: [...basis, ...extra], dvLessen: 40, extraTijd: '18 DV-lessen in klas 1' },
  { code: 'C', naam: '22 DV-lessen + 16 vakmomenten', eenheden: [...basis, ...vak], dvLessen: 22, extraTijd: '16 momenten binnen bestaande vaklessen' },
  { code: 'D', naam: '22 DV-lessen + oefenen in HELIX', eenheden: [...basis, ...oefenrondes], dvLessen: 22, extraTijd: '6 x 15 minuten zelfstandig in HELIX' },
  { code: 'E', naam: 'onderbouwlijn: 22 in klas 1 + 18 in klas 2', eenheden: [...basis, ...extra], dvLessen: 40, extraTijd: '18 DV-lessen in klas 2' },
  { code: 'C+D', naam: '22 DV-lessen + vakmomenten + HELIX', eenheden: [...basis, ...vak, ...oefenrondes], dvLessen: 22, extraTijd: 'vakmomenten en 6 x 15 minuten HELIX' }
];

const meet = (eenheden) => {
  const per = Object.fromEntries(elementen.map((e) => [e, { inhoud: 0, h: 0, E: 0, vak: 0 }]));
  eenheden.forEach((u) => Object.entries(u.elementen).forEach(([e, rollen]) => {
    const m = per[e];
    if (!m) throw new Error(`onbekend element ${e}`);
    if (rollen.some((r) => ['O', 'H', 'T'].includes(r))) m.inhoud += 1;
    if (rollen.includes('h')) m.h += 1;
    if (rollen.includes('E')) m.E += 1;
    if (u.bron === 'vak') m.vak += 1;
  }));
  const tel = (f) => elementen.filter((e) => f(per[e])).length;
  return {
    per,
    terug: tel((m) => m.inhoud >= 1),
    stevig: tel((m) => m.inhoud >= 2),
    alleenIntro: tel((m) => m.inhoud === 0),
    evidence: tel((m) => m.E >= 1),
    vak: tel((m) => m.vak >= 1),
    gemiddeld: (elementen.reduce((som, e) => som + per[e].inhoud, 0) / elementen.length).toFixed(1),
    metTerugblik: (elementen.reduce((som, e) => som + per[e].inhoud + per[e].h, 0) / elementen.length).toFixed(1)
  };
};

const uit = [];
const p = (t = '') => uit.push(t);
const res = scenarios.map((sc) => ({ ...sc, m: meet(sc.eenheden) }));

p('| Maatstaf (van de 45 elementen) | ' + res.map((r) => `${r.code}`).join(' | ') + ' |');
p('| --- | ' + res.map(() => '---').join(' | ') + ' |');
p('| DV-lessen | ' + res.map((r) => r.dvLessen).join(' | ') + ' |');
p('| Extra tijd buiten de 22 lessen | ' + res.map((r) => r.extraTijd).join(' | ') + ' |');
p('| Geïntroduceerd | ' + res.map(() => 45).join(' | ') + ' |');
p('| Daarna minstens één keer inhoudelijk terug | ' + res.map((r) => r.m.terug).join(' | ') + ' |');
p('| Stevig verankerd: twee keer of vaker inhoudelijk terug | ' + res.map((r) => r.m.stevig).join(' | ') + ' |');
p('| Alleen introductie of terugblikvraag | ' + res.map((r) => r.m.alleenIntro).join(' | ') + ' |');
p('| Met een product als evidence | ' + res.map((r) => r.m.evidence).join(' | ') + ' |');
p('| Toegepast in een ander vak | ' + res.map((r) => r.m.vak).join(' | ') + ' |');
p('| Gemiddeld aantal inhoudelijke herhalingen per element | ' + res.map((r) => r.m.gemiddeld).join(' | ') + ' |');
p('| Gemiddeld aantal herhalingen per element, terugblikvragen meegeteld | ' + res.map((r) => r.m.metTerugblik).join(' | ') + ' |');
p();

// Per kerndoel: stevig verankerde elementen (van de 5).
p('Stevig verankerde elementen per kerndoel (van de vijf):');
p();
p('| Kerndoel | ' + res.map((r) => r.code).join(' | ') + ' |');
p('| --- | ' + res.map(() => '---').join(' | ') + ' |');
KD.forEach((k) => {
  const els = Object.keys(c.kerndoelen[k].elementen);
  p(`| ${k} ${c.kerndoelen[k].naam} | ` + res.map((r) => els.filter((e) => r.m.per[e].inhoud >= 2).length).join(' | ') + ' |');
});
p();

fs.writeFileSync(process.argv[2], uit.join('\n'));
console.log(res.map((r) => `${r.code}: terug ${r.m.terug}, stevig ${r.m.stevig}, alleenIntro ${r.m.alleenIntro}, E ${r.m.evidence}, vak ${r.m.vak}, gem ${r.m.gemiddeld}, metH ${r.m.metTerugblik}`).join('\n'));
