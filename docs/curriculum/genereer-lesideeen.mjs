// Maakt lesideeen-h4-h23.md uit dv-klas1-curriculum.json (paragrafen, leerdoelen,
// elementen) en lesideeen-h4-h23.json (de lesideeën). Draai na elke wijziging:
//   node docs/curriculum/genereer-lesideeen.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const hier = (naam) => new URL(naam, import.meta.url);
const curriculum = JSON.parse(readFileSync(hier('dv-klas1-curriculum.json'), 'utf8'));
const ideeen = JSON.parse(readFileSync(hier('lesideeen-h4-h23.json'), 'utf8'));
const FASE = { I: 'introductie', O: 'oefenen', H: 'herhalen', E: 'evidence', T: 'toepassen', h: 'kort herhalen' };

const regels = [`# ${ideeen.meta.titel}`, '', `Gegenereerd op ${ideeen.meta.datum} uit \`dv-klas1-curriculum.json\` en \`lesideeen-h4-h23.json\`. Pas die bestanden aan, niet dit document.`, '', ideeen.meta.uitleg, ''];
for (const les of curriculum.lessen.filter((l) => l.hoofdstuk >= 4)) {
  const idee = ideeen.hoofdstukken[String(les.hoofdstuk)];
  if (!idee) throw new Error(`Geen lesidee voor hoofdstuk ${les.hoofdstuk}`);
  const elementen = Object.entries(les.elementen || {})
    .map(([el, fasen]) => `${el} (${fasen.map((f) => FASE[f] || f).join(', ')})`).join('; ');
  regels.push(`## H${les.hoofdstuk} ${les.titel}`, '');
  regels.push(`**Paragrafen:** ${les.paragrafen.map((p, i) => `${les.hoofdstuk}.${i + 1} ${p}`).join(' / ')}`, '');
  regels.push('**Leerdoelen**', ...les.leerdoelen.map((d) => `- ${d}`), '');
  regels.push(`**Kerndoelelementen:** ${elementen}`, '');
  if (les.routine) regels.push(`**Routine:** ${les.routine}`, '');
  regels.push(`**Opening.** ${idee.opening}`, '', `**Beeldspraak.** ${idee.beeldspraak}`, '', '**Werkvormen**', ...idee.werkvormen.map((w) => `- ${w}`), '');
  regels.push(`**Basis.** ${idee.basis}`, '', `**TL-plus.** ${idee.tlPlus}`, '', `**Inclusie (H1i1).** ${idee.inclusie}`, '', `*Inspiratie: ${idee.inspiratie}*`, '');
}
writeFileSync(hier('lesideeen-h4-h23.md'), `${regels.join('\n')}\n`, 'utf8');
console.log('lesideeen-h4-h23.md geschreven');
