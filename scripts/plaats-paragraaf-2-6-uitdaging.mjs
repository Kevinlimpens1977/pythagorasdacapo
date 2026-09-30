/**
 * Zet Binask 2.6 "Uitdaging: drijven en zinken" in de bibliotheek (Kevin, 30 sep
 * 2026): de paragraaf (optioneel, niet verplicht), de tekstblokken uit
 * docs/seeds/binask-h2-2.6-uitdaging.json, het spel Vloeistoffenlab, een quiz
 * die de server nakijkt en de samenvatting. Met de publieke snapshots en de
 * tokenregel van het spel.
 *
 *   node scripts/plaats-paragraaf-2-6-uitdaging.mjs            dry run
 *   node scripts/plaats-paragraaf-2-6-uitdaging.mjs --apply    schrijven
 *
 * Waarom niet via bouw-hoofdstuk-seed: dat vervangt heel H2 in de seed, en het
 * H2-bronbestand loopt achter op wat live staat (eindcheck-quiz, Binas-links,
 * de driehoektekening). Dit script raakt alleen paragraaf 2.6.
 *
 * Het deck (volgnummer 1) komt apart:
 *   node scripts/plaats-hoofdstuk-slidedecks.mjs --bron docs/seeds/binask-h2-2.6-uitdaging.json --apply
 * Toewijzen aan de klassen daarna met scripts/zet-klas-lesstof-klaar.mjs --vak binask.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwToetsitems, telTypes } from './lib/toetsitems-uit-seed.mjs';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const SCRIPT_NAAM = 'scripts/plaats-paragraaf-2-6-uitdaging.mjs';
const BRON = 'docs/seeds/binask-h2-2.6-uitdaging.json';

const bron = JSON.parse(fs.readFileSync(path.resolve(BRON), 'utf8'));
const { meta } = bron;
const par = bron.paragrafen[0];
const hoofdstukId = bron.hoofdstuk.id;
const gedeeld = { vakId: meta.vakId, leerjaarId: meta.leerjaarId, niveauId: meta.niveauId, hoofdstukId, paragraafId: par.id };
const blokId = (type, nr) => `block-${meta.blokPrefix}-26-${type}-${nr}`;

const escapeHtml = (tekst = '') => String(tekst).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kernbegrippenHtml = (lijst = []) => (lijst.length
  ? `<h3>Kernbegrippen</h3><dl>${lijst.map(({ begrip, uitleg }) => `<dt>${escapeHtml(begrip)}</dt><dd>${escapeHtml(uitleg)}</dd>`).join('')}</dl>`
  : '');

// ---------- de paragraaf ----------

const paragraaf = {
  id: par.id,
  vakId: meta.vakId,
  leerjaarId: meta.leerjaarId,
  niveauId: meta.niveauId,
  hoofdstukId,
  code: par.code,
  title: `${par.code} ${par.titel}`,
  beschrijving: par.beschrijving,
  order: 6,
  published: true,
  aiCompanionEnabled: true,
  cropCount: 0,
  isArchived: false,
  // Vrijwillige plusparagraaf: ster in de lijst, telt niet mee in het percentage.
  optioneel: true,
  verplicht: false,
  learningGoals: par.leerdoelen,
  leerdoelen: par.leerdoelen
};

// ---------- de blokken ----------

const tekstblok = (blok, nr) => ({
  id: blokId(blok.type, nr),
  ...gedeeld,
  type: blok.type,
  order: nr,
  title: blok.titel,
  status: 'published',
  content: {
    html: `${blok.html}${kernbegrippenHtml(blok.kernbegrippen)}`,
    ...(blok.kernbegrippen?.length ? { keyTerms: blok.kernbegrippen.map((item) => item.begrip) } : {}),
    crops: [],
    sourceBasis: ['docent-bron'],
    sourceNotes: `Bron: ${meta.bron}.`
  },
  settings: normalizeContentBlockSettings({}, blok.type),
  linkedVraagId: null,
  createdBy: SCRIPT_NAAM,
  isArchived: false
});

const [theorie1, voorbeeld1, theorie2, voorbeeld2, samenvatting] = par.blokken;

const spelblok = {
  id: `block-${meta.blokPrefix}-26-game-vloeistoffenlab`,
  ...gedeeld,
  type: 'game',
  order: 6,
  title: 'Spel: Vloeistoffenlab',
  status: 'published',
  linkedVraagId: null,
  settings: { allowMathToolbox: false, allowAiHelp: false },
  content: {
    gameId: 'binask-vloeistoffenlab',
    gameTitle: 'Vloeistoffenlab',
    html: '<p>Weeg vloeistoffen door af te trekken en met tarra (NUL). Bouw een dichtheidstoren en voorspel waar voorwerpen blijven drijven, zweven of zinken. Het boekje met dichtheden zit rechtsboven.</p>',
    settings: { estimatedMinutes: 20 }
  },
  createdBy: SCRIPT_NAAM,
  isArchived: false
};

// De quiz: leerstof, toepassing en denkvragen. De server kijkt na.
const VRAGEN = [
  { type: 'waar-niet-waar', vraag: 'Een zwaar voorwerp zinkt altijd.', juist: false, uitleg: 'Het gaat om de dichtheid, niet om het gewicht. Een zware boomstam drijft ook.', vaardigheid: 'begrijpen' },
  { type: 'waar-niet-waar', vraag: 'Een voorwerp met dezelfde dichtheid als de vloeistof zweeft.', juist: true, uitleg: 'Klopt: even groot betekent zweven. Het blijft ergens in de vloeistof hangen.' },
  {
    type: 'meerkeuze', vraag: 'Een blokje heeft een dichtheid van 0,95 g/cm³. Wat gebeurt er in olie (0,92) en in water (1,00)?',
    opties: [
      { tekst: 'Het drijft in olie en in water.' },
      { tekst: 'Het zinkt in olie en drijft op water.', juist: true },
      { tekst: 'Het zinkt in olie en in water.' },
      { tekst: 'Het drijft in olie en zinkt in water.' }
    ],
    uitleg: '0,95 is groter dan 0,92: in olie zinkt het. 0,95 is kleiner dan 1,00: op water drijft het.', vaardigheid: 'toepassen'
  },
  { type: 'numeriek', vraag: 'Een lege maatcilinder weegt 58,0 g. Met 40 ml vloeistof erin weegt hij 108,4 g. Bereken de dichtheid van de vloeistof. Rond af op twee decimalen.', antwoord: 1.26, tolerantie: 0.01, eenheid: 'g/cm³', hint: 'm = 108,4 - 58,0 = 50,4 g. ρ = m / V = 50,4 / 40.', uitleg: 'm = 50,4 g, ρ = 50,4 / 40 = 1,26 g/cm³. Dat is glycerine.', vaardigheid: 'toepassen' },
  {
    type: 'meerkeuze', vraag: 'Je schenkt honing (1,42), water (1,00) en olie (0,92) voorzichtig in één glas. Welke volgorde krijg je van onder naar boven?',
    opties: [
      { tekst: 'olie - water - honing' },
      { tekst: 'water - honing - olie' },
      { tekst: 'honing - water - olie', juist: true },
      { tekst: 'honing - olie - water' }
    ],
    uitleg: 'De grootste dichtheid ligt onderop: honing, dan water, dan olie bovenop.', vaardigheid: 'toepassen'
  },
  { type: 'numeriek', vraag: 'Een ijsblokje van 10 cm³ heeft een massa van 9,2 g. Bereken de dichtheid.', antwoord: 0.92, tolerantie: 0.01, eenheid: 'g/cm³', hint: 'ρ = m / V = 9,2 / 10.', uitleg: 'ρ = 9,2 / 10 = 0,92 g/cm³. Kleiner dan water, dus ijs drijft.', vaardigheid: 'toepassen' },
  {
    type: 'meerkeuze', vraag: 'Waarom drijft ijs op water?',
    opties: [
      { tekst: 'Omdat ijs kouder is dan water.' },
      { tekst: 'Omdat er lucht onder het ijs zit.' },
      { tekst: 'Omdat een ijsblokje minder weegt dan een glas water.' },
      { tekst: 'Omdat de dichtheid van ijs (0,92) kleiner is dan die van water (1,00).', juist: true }
    ],
    uitleg: 'Drijven hangt af van de dichtheid: 0,92 is kleiner dan 1,00.', vaardigheid: 'uitleggen'
  },
  { type: 'numeriek', vraag: 'Een stalen bootje weegt 400 g. Het totale volume, met de lucht erin, is 800 cm³. Bereken de gemiddelde dichtheid.', antwoord: 0.5, tolerantie: 0.01, eenheid: 'g/cm³', hint: 'Gemiddelde dichtheid = totale massa / totaal volume = 400 / 800.', uitleg: 'ρ = 400 / 800 = 0,5 g/cm³. Kleiner dan 1,00: het bootje drijft.', vaardigheid: 'toepassen' },
  {
    type: 'meerkeuze', vraag: 'Staal heeft een dichtheid van 7,90 g/cm³. Toch drijft een groot stalen schip. Welke uitleg klopt?',
    opties: [
      { tekst: 'Het schip is hol. Door de lucht is de gemiddelde dichtheid kleiner dan die van water.', juist: true },
      { tekst: 'Zeewater is zwaarder dan staal.' },
      { tekst: 'Een groot schip is lichter dan een klein schip.' },
      { tekst: 'De motor houdt het schip omhoog.' }
    ],
    uitleg: 'Je rekent met de gemiddelde dichtheid van staal en lucht samen. Die is kleiner dan 1,00 g/cm³.', vaardigheid: 'uitleggen'
  },
  { type: 'waar-niet-waar', vraag: 'In zout water drijf je makkelijker dan in gewoon water.', juist: true, uitleg: 'Zout water heeft een grotere dichtheid (1,20). Het verschil met jouw dichtheid is dan groter.' },
  { type: 'numeriek', vraag: 'Een voorwerp zweeft in zout water (1,20 g/cm³). Het volume is 25 cm³. Bereken de massa.', antwoord: 30, tolerantie: 0.01, eenheid: 'g', hint: 'Zweven: ρ voorwerp = 1,20. m = ρ × V = 1,20 × 25.', uitleg: 'm = 1,20 × 25 = 30 g.', vaardigheid: 'toepassen' },
  {
    type: 'meerkeuze', vraag: 'Je zet een lege maatcilinder op de weegschaal en drukt op NUL. Daarna schenk je er 30 ml spiritus (0,79 g/cm³) in. Wat staat er ongeveer op het scherm?',
    opties: [
      { tekst: '0,79 g' },
      { tekst: '30 g' },
      { tekst: '23,7 g', juist: true },
      { tekst: '83,7 g' }
    ],
    uitleg: 'Na NUL telt alleen de spiritus: m = 0,79 × 30 = 23,7 g.', vaardigheid: 'toepassen'
  }
];
const items = bouwToetsitems(VRAGEN.map((vraag, index) => ({ nr: index + 1, ...vraag })), {
  slug: 'binask-h2-uitdaging', leerdoel: 'Drijven, zweven en zinken met dichtheden voorspellen en berekenen'
});
const quizblok = {
  id: blokId('quiz', 7),
  ...gedeeld,
  type: 'quiz',
  order: 7,
  title: 'Toets jezelf - drijven en zinken',
  status: 'published',
  tokenTotal: 20,
  content: {
    html: '<p>Twaalf vragen. Je ziet meteen of je antwoord goed is. Bij een rekenvraag vul je alleen het getal in: de eenheid staat er al achter. Reken eerst uit op papier.</p>',
    assessmentType: 'quiz',
    items,
    attemptPolicy: { maxAttempts: 2, scoring: 'best', allowTeacherReset: true },
    tokenConfig: { enabled: true, totalTokens: 20 },
    crops: [],
    sourceBasis: ['docent-bron'],
    sourceNotes: `Bron: ${meta.bron}.`
  },
  settings: normalizeContentBlockSettings({ allowAiHelp: false }, 'quiz'),
  linkedVraagId: null,
  createdBy: SCRIPT_NAAM,
  isArchived: false
};

const blokken = [
  tekstblok(theorie1, 2),
  tekstblok(voorbeeld1, 3),
  tekstblok(theorie2, 4),
  tekstblok(voorbeeld2, 5),
  spelblok,
  quizblok,
  tekstblok(samenvatting, 8)
];

// ---------- controles ----------

const fouten = [];
for (const tekst of meta.controleerTeksten || []) {
  if (!blokken.some((blok) => (blok.content.html || '').includes(tekst))) fouten.push(`"${tekst}" komt niet letterlijk voor.`);
}
for (const blok of blokken) {
  const readiness = validateContentBlockReadiness(blok);
  if (readiness.ready === false) fouten.push(`${blok.id}: niet klaar (${(readiness.issues || []).join('; ')})`);
  if (/Antwoord:|Uitwerking:/i.test(blok.content.html || '')) fouten.push(`${blok.id}: antwoord in de leerlingtekst.`);
}
const goedePlekken = items.filter((item) => item.answer.options).map((item) => item.answer.options.findIndex((o) => o.correct));
if (goedePlekken.length >= 3 && new Set(goedePlekken).size === 1) fouten.push('Het goede antwoord staat bij elke vraag op dezelfde plek.');
if (fouten.length) {
  console.error('Niet geplaatst:');
  fouten.forEach((fout) => console.error(`- ${fout}`));
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const bestaat = (await db.collection('paragraaf').doc(par.id).get()).exists;
const zelfdeCode = (await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get()).docs
  .filter((doc) => doc.id !== par.id && (doc.get('code') === par.code || doc.get('order') === 6));
if (zelfdeCode.length) {
  console.error(`Er staat al een paragraaf ${par.code} of met volgnummer 6 in H2: ${zelfdeCode.map((d) => d.id).join(', ')}`);
  process.exit(1);
}
const oudeBlokken = (await db.collection('contentBlocks').where('paragraafId', '==', par.id).get()).docs.map((d) => d.id);

console.log(`Paragraaf ${par.id} "${paragraaf.title}" (optioneel): ${bestaat ? 'bijwerken' : 'nieuw'}.`);
console.log(`Bestaande blokken in deze paragraaf: ${oudeBlokken.length ? oudeBlokken.join(', ') : 'geen'}.`);
for (const blok of blokken) console.log(`  ${blok.order}  ${blok.id}  (${blok.type}) ${blok.title}`);
console.log(`Quiz: ${items.length} vragen (${telTypes(items)}), goede antwoorden op plek ${goedePlekken.map((i) => i + 1).join(', ')}.`);
const regel = await db.collection('tokenGameRewardRules').doc('binask-vloeistoffenlab').get();
console.log(`Tokenregel binask-vloeistoffenlab: ${regel.exists ? JSON.stringify(regel.data()) : 'nog geen'} -> 0-100, replayDecay 0.5.`);

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}

const schoon = (waarde) => JSON.parse(JSON.stringify(waarde));
const batch = db.batch();
batch.set(db.collection('paragraaf').doc(par.id), { ...schoon(paragraaf), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
for (const blok of blokken) {
  batch.set(db.collection('contentBlocks').doc(blok.id), { ...schoon(blok), updatedAt: FieldValue.serverTimestamp() });
  const snapshot = buildPublicContentBlockSnapshot(blok);
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), { ...schoon(snapshot), updatedAt: FieldValue.serverTimestamp() });
}
batch.set(db.collection('tokenGameRewardRules').doc('binask-vloeistoffenlab'), {
  enabled: true, min: 0, max: 100, basis: 'score_accuracy_completion', replayDecay: 0.5, maxPlays: 0,
  updatedAt: FieldValue.serverTimestamp()
}, { merge: true });
await batch.commit();
console.log(`\nGeschreven: paragraaf, ${blokken.length} blokken met snapshot en de tokenregel.`);
