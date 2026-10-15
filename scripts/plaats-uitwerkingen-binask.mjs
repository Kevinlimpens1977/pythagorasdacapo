/**
 * Zet de uitwerkingen van de schriftvragen van Binask H1 en H2 in de
 * bibliotheek (Kevin, 8 okt 2026): per hoofdstuk een laatste paragraaf "1.A" en
 * "2.A" met één tekstblok vol antwoorden.
 *
 *   node scripts/plaats-uitwerkingen-binask.mjs            dry run
 *   node scripts/plaats-uitwerkingen-binask.mjs --apply    schrijven
 *
 * - De paragraaf krijgt `ontgrendelNaHoofdstuk: true`: de leerling ziet hem in
 *   het hoofdstuk, met een slot, tot alle andere paragrafen af zijn
 *   (src/lib/antwoordenSlot.js). Plusparagrafen tellen niet mee.
 * - Het blok krijgt `minimaleTijdSeconden` en `bevestigLabel`: afvinken kan pas
 *   na die tijd (src/lib/minimaleLeestijd.js), want nakijken kost tijd.
 * - Elke rekenvraag heeft gegeven, gevraagd, formule, berekening en antwoord
 *   met eenheid. De antwoorden staan in docs/seeds/binask-uitwerkingen.json.
 *
 * Toewijzen aan ER3L1A en ER3L2A daarna met scripts/zet-klas-lesstof-klaar.mjs --vak binask.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const SCRIPT_NAAM = 'scripts/plaats-uitwerkingen-binask.mjs';
const BRON = 'docs/seeds/binask-uitwerkingen.json';
const bron = JSON.parse(fs.readFileSync(path.resolve(BRON), 'utf8'));
const { meta } = bron;

// De vijf gevarensymbolen uit paragraaf 1.3, al in Storage.
const AFBEELDINGEN = {
  gevarensymbolen: '<img src="https://firebasestorage.googleapis.com/v0/b/pythagoras-eoa.firebasestorage.app/o/pythagoras%2Fquestion-crops%2Fpara-1-2b-gevarensymbolen-1788717522639%2Fblock-para-1-2b-gevarensymbolen-1788717522639-theory-1788717529854%2Fcrop_001_2026-09-06T18_00_17.jpg?alt=media&amp;token=7b170d91-2c3d-443f-9ab3-9d9bcb855c30" alt="De gevarensymbolen ontvlambaar, schadelijk, explosief, corrosief en giftig">'
};

const escapeHtml = (tekst = '') => String(tekst).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const stapLijst = (s) => `<ul>${[
  ['Gegeven', s.gegeven], ['Gevraagd', s.gevraagd], ['Formule', s.formule], ['Berekening', s.berekening], ['Antwoord', s.antwoord]
].map(([label, waarde]) => `<li><strong>${label}:</strong> ${escapeHtml(waarde)}</li>`).join('')}</ul>`;

function vraagHtml(v) {
  let html = `<p><strong>${escapeHtml(v.nr)}.</strong> <em>${escapeHtml(v.vraag)}</em></p>`;
  if (v.reken) html += stapLijst(v.reken);
  if (v.stappen) html += v.stappen.map((s) => `<p>${escapeHtml(s.kop)}</p>${stapLijst(s)}`).join('');
  if (v.antwoord) html += `<p>${v.antwoord}</p>`; // mag <strong> bevatten, staat zo in de bron
  if (v.afbeelding) html += AFBEELDINGEN[v.afbeelding];
  if (v.slot) html += `<p>${v.slot}</p>`;
  return html;
}

const fouten = [];
const paragrafen = [];
const blokken = [];

for (const h of bron.hoofdstukken) {
  const html = `<p>${escapeHtml(h.intro)}</p>${h.opdrachten.map((o) => `<h3>${escapeHtml(o.titel)}</h3>${o.vragen.map(vraagHtml).join('')}`).join('')}`;
  paragrafen.push({
    id: h.paragraafId,
    vakId: meta.vakId,
    leerjaarId: meta.leerjaarId,
    niveauId: meta.niveauId,
    hoofdstukId: h.hoofdstukId,
    code: h.code,
    title: `${h.code} ${h.titel}`,
    beschrijving: 'Kijk je schriftvragen na. Gaat open als je alle andere paragrafen van dit hoofdstuk af hebt.',
    order: h.order,
    published: true,
    aiCompanionEnabled: false,
    cropCount: 0,
    isArchived: false,
    optioneel: false,
    verplicht: true,
    ontgrendelNaHoofdstuk: true,
    learningGoals: ['Je kunt je eigen werk nakijken en verbeteren.'],
    leerdoelen: ['Je kunt je eigen werk nakijken en verbeteren.']
  });
  blokken.push({
    id: h.blokId,
    vakId: meta.vakId,
    leerjaarId: meta.leerjaarId,
    niveauId: meta.niveauId,
    hoofdstukId: h.hoofdstukId,
    paragraafId: h.paragraafId,
    type: 'theory',
    order: 1,
    title: `Uitwerkingen hoofdstuk ${h.code.split('.')[0]}`,
    status: 'published',
    content: {
      html,
      crops: [],
      minimaleTijdSeconden: meta.minimaleTijdSeconden,
      bevestigLabel: meta.bevestigLabel,
      sourceBasis: ['docent-bron'],
      sourceNotes: `Bron: ${meta.bron}`
    },
    settings: normalizeContentBlockSettings({ allowAiHelp: false }, 'theory'),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  });

  // Elke rekenvraag moet alle vijf de stappen hebben.
  for (const o of h.opdrachten) {
    for (const v of o.vragen) {
      for (const s of [v.reken, ...(v.stappen || [])].filter(Boolean)) {
        for (const veld of ['gegeven', 'gevraagd', 'formule', 'berekening', 'antwoord']) {
          if (!String(s[veld] || '').trim()) fouten.push(`${o.titel} vraag ${v.nr}: ${veld} ontbreekt.`);
        }
        if (!/\b(g|kg|ml|L|dm³|cm³|g\/cm³)\b|cm³|g\/cm³|dm³/.test(s.antwoord)) fouten.push(`${o.titel} vraag ${v.nr}: antwoord zonder eenheid.`);
      }
      if (!v.reken && !v.stappen && !v.antwoord) fouten.push(`${o.titel} vraag ${v.nr}: geen antwoord.`);
    }
  }
}

for (const blok of blokken) {
  const readiness = validateContentBlockReadiness(blok);
  if (readiness.ready === false) fouten.push(`${blok.id}: niet klaar (${(readiness.issues || []).join('; ')})`);
}
if (fouten.length) {
  console.error('Niet geplaatst:');
  fouten.forEach((fout) => console.error(`- ${fout}`));
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

for (const par of paragrafen) {
  const bestaat = (await db.collection('paragraaf').doc(par.id).get()).exists;
  const botsing = (await db.collection('paragraaf').where('hoofdstukId', '==', par.hoofdstukId).get()).docs
    .filter((doc) => doc.id !== par.id && doc.get('code') === par.code);
  if (botsing.length) { console.error(`Code ${par.code} bestaat al: ${botsing.map((d) => d.id).join(', ')}`); process.exit(1); }
  const blok = blokken.find((b) => b.paragraafId === par.id);
  const vragen = (blok.content.html.match(/<p><strong>/g) || []).length;
  console.log(`${bestaat ? 'Bijwerken' : 'Nieuw'}: ${par.id} "${par.title}" (volgnummer ${par.order}, slot tot hoofdstuk af)`);
  console.log(`  blok ${blok.id}: ${vragen} antwoorden, ${blok.content.html.length} tekens, afvinken na ${meta.minimaleTijdSeconden} s ("${meta.bevestigLabel}")`);
}

if (!apply) {
  fs.writeFileSync('.tmp-diag/uitwerkingen-voorbeeld.html', blokken.map((b) => `<h1>${b.title}</h1>${b.content.html}`).join('<hr>'));
  console.log('\nDry run: niets geschreven. Voorbeeld in .tmp-diag/uitwerkingen-voorbeeld.html. Draai met --apply om te schrijven.');
  process.exit(0);
}

const schoon = (waarde) => JSON.parse(JSON.stringify(waarde));
const batch = db.batch();
for (const par of paragrafen) {
  batch.set(db.collection('paragraaf').doc(par.id), { ...schoon(par), updatedAt: FieldValue.serverTimestamp(), createdAt: FieldValue.serverTimestamp() }, { merge: true });
}
for (const blok of blokken) {
  batch.set(db.collection('contentBlocks').doc(blok.id), { ...schoon(blok), updatedAt: FieldValue.serverTimestamp() });
  const snapshot = buildPublicContentBlockSnapshot(blok);
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), { ...schoon(snapshot), updatedAt: FieldValue.serverTimestamp() });
}
await batch.commit();
console.log(`\nGeschreven: ${paragrafen.length} paragrafen en ${blokken.length} blokken met snapshot.`);
