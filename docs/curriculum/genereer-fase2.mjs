import fs from 'node:fs';

const bron = new URL('./dv-klas1-curriculum.json', import.meta.url);
const c = JSON.parse(fs.readFileSync(bron, 'utf8'));
const L = c.lessen;
const KD = Object.keys(c.kerndoelen);
const alleElementen = KD.flatMap((k) => Object.keys(c.kerndoelen[k].elementen));
const volgorde = ['I', 'O', 'H', 'h', 'T', 'E'];
const sorteer = (rollen) => [...new Set(rollen)].sort((a, b) => volgorde.indexOf(a) - volgorde.indexOf(b)).join('');

// Controle: elk element minstens één I.
const fouten = [];
alleElementen.forEach((el) => {
  if (!L.some((l) => (l.elementen[el] || []).includes('I'))) fouten.push(`${el} heeft geen introductie`);
});
L.forEach((l) => Object.keys(l.elementen).forEach((el) => { if (!alleElementen.includes(el)) fouten.push(`les ${l.nr}: onbekend element ${el}`); }));
if (fouten.length) { console.error(fouten.join('\n')); process.exit(1); }

const out = [];
const p = (s = '') => out.push(s);

// Overzicht
p('## 2. Overzicht van de lessen');
p();
p('| Les | HELIX | Blok | Titel | Primair | Secundair | Startscore nulmeting |');
p('| --- | --- | --- | --- | --- | --- | --- |');
L.forEach((l) => {
  const sec = [...new Set(Object.keys(l.elementen).map((e) => e.slice(0, 3)).filter((k) => k !== l.primair))].join(', ');
  p(`| ${l.nr} | H${l.hoofdstuk} | ${l.blok} | ${l.titel} | ${l.primair} | ${sec || '-'} | ${l.nulmeting} |`);
});
p();

// Per les
p('## 3. De lessen in detail');
p();
p('Per les: de inhoud, de leerdoelen en de SLO-koppeling. Hoe een les als HELIX-hoofdstuk wordt opgebouwd, volgt later uit `/helix-hoofdstuk-bouwen`. De "deelonderwerpen" zijn de inhoudelijke indeling in paragrafen, geen blokstructuur.');
p();
let blok = '';
L.forEach((l) => {
  if (l.blok !== blok) { blok = l.blok; p(`### Blok ${blok}: ${c.blokken[blok]}`); p(); }
  p(`#### Les ${l.nr} (HELIX-hoofdstuk ${l.hoofdstuk}): ${l.titel}`);
  p();
  p(l.focus);
  p();
  p(`- **Deelonderwerpen:** ${l.paragrafen.join('; ')}.`);
  p('- **Leerdoelen:**');
  l.leerdoelen.forEach((d) => p(`  - ${d}`));
  const els = Object.entries(l.elementen).map(([e, r]) => `${e} (${sorteer(r)})`).join(', ');
  p(`- **SLO:** primair ${l.primair} ${c.kerndoelen[l.primair].naam}. Elementen: ${els}.`);
  const eerder = new Set(); const later = new Set();
  Object.keys(l.elementen).forEach((e) => L.forEach((m) => {
    if (m.nr === l.nr || !m.elementen[e]) return;
    (m.nr < l.nr ? eerder : later).add(m.nr);
  }));
  p(`- **Relatie:** bouwt voort op ${eerder.size ? [...eerder].sort((a, b) => a - b).map((n) => `les ${n}`).join(', ') : 'hoofdstuk 1 en voorkennis'}; komt terug in ${later.size ? [...later].sort((a, b) => a - b).map((n) => `les ${n}`).join(', ') : 'klas 2'}.`);
  p(`- **Evidence:** ${l.evidence}.`);
  if (l.routine) p(`- **Vaste routine:** ${l.routine}.`);
  if (l.officeMiddel) p(`- **Software als middel:** ${l.officeMiddel}.`);
  p(`- **Vakintegratie:** ${l.vakintegratie.join(', ')}.`);
  p(`- **Differentiatie:** basis: ${l.basis} GL/TL-plus: ${l.tlPlus}`);
  p(`- **Startscore:** bij de start ziet de leerling zijn nulmetingsscore voor "${l.nulmeting}".`);
  if (l.spel) p(`- **Spel om te oefenen:** ${l.spel}.`);
  if (l.opmerking) p(`- **Let op:** ${l.opmerking}`);
  p();
});

// Matrix kerndoel x les
p('## 4. Dekkingsmatrix: kerndoel x les');
p();
p('Codering: **I** introductie, **O** oefenen, **H** herhalen in een nieuwe context, **h** terugblikvraag, **T** toepassen in een grotere opdracht, **E** evidence. Een sterretje (*) betekent: dit kerndoel is in deze les primair.');
p();
p(`| | ${L.map((l) => l.nr).join(' | ')} |`);
p(`| --- | ${L.map(() => '---').join(' | ')} |`);
KD.forEach((k) => {
  const cellen = L.map((l) => {
    const r = Object.entries(l.elementen).filter(([e]) => e.startsWith(k)).flatMap(([, v]) => v);
    if (!r.length) return '';
    return sorteer(r) + (l.primair === k ? '*' : '');
  });
  p(`| **${k}** | ${cellen.join(' | ')} |`);
});
p();

// Elementcontrole
p('## 5. Controle op de 45 elementen');
p();
p('| Element | Introductie | Oefenen / herhalen / toepassen | Evidence | Aantal lessen | Signaal |');
p('| --- | --- | --- | --- | --- | --- |');
const signalen = {};
alleElementen.forEach((el) => {
  const met = (rol) => L.filter((l) => (l.elementen[el] || []).includes(rol)).map((l) => l.nr);
  const I = met('I'); const E = met('E');
  const ohtt = L.filter((l) => (l.elementen[el] || []).some((r) => ['O', 'H', 'T'].includes(r))).map((l) => l.nr);
  const hh = met('h');
  const n = L.filter((l) => l.elementen[el]).length;
  const s = [];
  if (!ohtt.length && !hh.length) s.push('alleen geïntroduceerd');
  else if (!ohtt.length) s.push('alleen terugblikvraag');
  if (!E.length) s.push('geen product-evidence');
  signalen[el] = s;
  const oh = [...ohtt.map(String), ...hh.map((x) => `${x}h`)].join(', ');
  p(`| ${el} | ${I.join(', ')} | ${oh || '-'} | ${E.join(', ') || '-'} | ${n} | ${s.join('; ') || 'in orde'} |`);
});
p();
const alleenI = alleElementen.filter((e) => signalen[e].includes('alleen geïntroduceerd'));
const alleenh = alleElementen.filter((e) => signalen[e].includes('alleen terugblikvraag'));
const geenE = alleElementen.filter((e) => signalen[e].includes('geen product-evidence'));
p(`Samenvatting: alle 45 elementen worden geïntroduceerd. ${alleElementen.length - alleenI.length - alleenh.length} komen daarna inhoudelijk terug; ${alleenh.length} alleen via een terugblikvraag (${alleenh.join(', ') || '-'}); ${alleenI.length} worden alleen geïntroduceerd (${alleenI.join(', ') || '-'}). ${alleElementen.length - geenE.length} elementen hebben een product als evidence; de andere ${geenE.length} alleen de afsluitcheck van de les.`);
p();

// Per kerndoel
p('## 6. Per kerndoel');
p();
p('| Kerndoel | Eerste introductie | Primaire lessen | Oefenen | Herhalen | Toepassen | Evidence | Zwakke plekken |');
p('| --- | --- | --- | --- | --- | --- | --- | --- |');
KD.forEach((k) => {
  const els = Object.keys(c.kerndoelen[k].elementen);
  const lessenMet = (rollen) => [...new Set(L.filter((l) => els.some((e) => (l.elementen[e] || []).some((r) => rollen.includes(r)))).map((l) => l.nr))];
  const eerste = Math.min(...lessenMet(['I']));
  const prim = L.filter((l) => l.primair === k).map((l) => l.nr);
  const zwak = els.filter((e) => signalen[e].includes('alleen geïntroduceerd') || signalen[e].includes('alleen terugblikvraag'));
  p(`| ${k} ${c.kerndoelen[k].naam} | les ${eerste} | ${prim.join(', ') || '-'} | ${lessenMet(['O']).join(', ') || '-'} | ${lessenMet(['H', 'h']).join(', ') || '-'} | ${lessenMet(['T']).join(', ') || '-'} | ${lessenMet(['E']).join(', ') || 'afsluitchecks'} | ${zwak.length ? `maar één keer inhoudelijk: ${zwak.join(', ')}` : '-'} |`);
});
p();

fs.writeFileSync(process.argv[2], out.join('\n'));
console.log('ok', alleElementen.length, 'elementen;', 'alleen I:', alleenI.join(','), '| alleen h:', alleenh.join(','), '| geen E:', geenE.length);
