/**
 * Vraag 3 van nulmeting deel B (data en informatie) wordt een opzoekvraag.
 *
 * Kevin, 18 september 2026: het juiste antwoord komt in een stukje tekst boven
 * de vraag, en wie de vraag al gemaakt heeft krijgt hem goed. Niemand hoeft
 * hem opnieuw te maken.
 *
 * Wat het script doet:
 * 1. De vraagtekst van item `nulmeting-digitale-vaardigheden-b-03` krijgt het
 *    opzoekstukje, in elk toetsblok waar het item in zit (de drie routes), en
 *    de publieke snapshot wordt opnieuw opgebouwd. De H1i1-versie heeft geen
 *    invulvragen en blijft dus buiten beeld.
 * 2. Elk afgerond itemrecord dat fout staat, wordt goed gerekend. Het
 *    oorspronkelijke antwoord en de pogingen blijven staan; de ronde-1-stand
 *    wordt ook goed, zodat de eerste score meetelt.
 * 3. De blokstand van die leerlingen wordt uit de itemvoortgang herberekend,
 *    met dezelfde gedeelde laag als de app.
 * 4. Heeft de leerling al een startprofiel, dan wordt dat opnieuw berekend
 *    met dezelfde regels als de Cloud Function buildNulmetingProfiel.
 *
 * Een record met alleen een concept (niet ingeleverd) blijft staan: die
 * leerling ziet straks de nieuwe vraag met het antwoord erboven.
 *
 *   node scripts/nulmeting-b03-opzoekvraag.mjs            # dry run
 *   node scripts/nulmeting-b03-opzoekvraag.mjs --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { summarizeAssessmentItemProgress } from '../src/lib/voortgangPayload.js';
import { buildNulmetingProfiel } from '../src/lib/nulmetingProfiel.js';

const SCRIPT_NAAM = 'scripts/nulmeting-b03-opzoekvraag.mjs';
const ITEM_ID = 'nulmeting-digitale-vaardigheden-b-03';
const NIEUWE_PROMPT =
  'Lees eerst dit stukje. Losse gegevens, zoals cijfers, namen of metingen, noemen we data. ' +
  'Als je data verwerkt en uitlegt, krijgen ze betekenis. Dan worden ze informatie. ' +
  'Vul nu de zin aan.';
const apply = process.argv.slice(2).includes('--apply');

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldPath, FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const cleanForFirestore = (value) => {
  if (Array.isArray(value)) return value.map(cleanForFirestore);
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, cleanForFirestore(child)])
    );
  }
  return value;
};

console.log(`Nulmeting B vraag 3 als opzoekvraag (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// 1. Blokken met dit item.
const blokken = (await db.collection('contentBlocks').where('type', '==', 'toets').get()).docs
  .map((doc) => ({ id: doc.id, ...doc.data() }))
  .filter((blok) => (blok.content?.items || []).some((item) => item.id === ITEM_ID));
if (!blokken.length) {
  console.error('Geen blok gevonden met dit item.');
  process.exit(1);
}
console.log(`Blokken met ${ITEM_ID}: ${blokken.length}`);
blokken.forEach((blok) => {
  const item = blok.content.items.find((i) => i.id === ITEM_ID);
  console.log(`- ${blok.id}: ${item.prompt === NIEUWE_PROMPT ? 'vraagtekst al aangepast' : `"${item.prompt}" -> opzoekstukje`}`);
});

const vertalingen = [];
for (const blok of blokken) {
  const snap = await db.collection('vertalingen')
    .where(FieldPath.documentId(), '>=', `${blok.id}__`)
    .where(FieldPath.documentId(), '<', `${blok.id}__`)
    .get();
  snap.docs.forEach((doc) => vertalingen.push({ id: doc.id, bron: doc.get('bron') }));
}
console.log(`Opgeslagen vertalingen van deze blokken: ${vertalingen.length}` +
  (vertalingen.length ? ` (${vertalingen.map((v) => `${v.id}: ${v.bron || 'model'}`).join(', ')})` : ''));
if (vertalingen.some((v) => v.bron === 'docent')) console.log('  Let op: een docentvertaling wordt niet vanzelf ververst.');

// 2. Itemrecords.
const blokIds = blokken.map((blok) => blok.id);
const blokrecords = (await db.collection('voortgang').where('blockId', 'in', blokIds).get()).docs;
const teRekenen = [];
let alGoed = 0;
let nietIngeleverd = 0;
for (const blokrecord of blokrecords) {
  const itemDoc = await blokrecord.ref.collection('items').doc(ITEM_ID).get();
  if (!itemDoc.exists) continue;
  const data = itemDoc.data();
  if (data.completed !== true) { nietIngeleverd += 1; continue; }
  if (data.isCorrect === true) { alGoed += 1; continue; }
  teRekenen.push({ blokrecord, itemDoc, data });
}
console.log(`\nItemrecords: ${teRekenen.length} goed te rekenen, ${alGoed} al goed, ${nietIngeleverd} nog niet ingeleverd.`);

const goedgerekend = (data) => {
  const maxScore = Number(data.maxScore) || 2;
  const parts = (Array.isArray(data.parts) ? data.parts : []).map((part) => ({ ...part, isCorrect: true }));
  return {
    isCorrect: true,
    score: maxScore,
    scoreWeight: 1,
    completionReason: 'correct',
    attemptStatus: 'completed',
    resultTier: 'independent',
    helpTier: 'independent',
    resultLabel: 'Zelfstandig goed',
    teacherSignal: '',
    parts,
    ronde1: data.ronde1
      ? { ...data.ronde1, isCorrect: true, score: maxScore, attemptStatus: 'completed', resultTier: 'independent' }
      : data.ronde1,
    lastAssessment: {
      ...(data.lastAssessment || {}),
      status: 'correct',
      feedback: 'Goed gerekend: deze vraag is omgezet in een opzoekvraag.'
    },
    goedgerekend: { reden: 'nulmeting-b03-opzoekvraag', script: SCRIPT_NAAM }
  };
};

// 3. Blokstand per geraakt blokrecord.
const blokItemsPerId = Object.fromEntries(blokken.map((blok) => [blok.id, blok.content.items]));
const blokUpdates = [];
for (const { blokrecord, itemDoc, data } of teRekenen) {
  const items = await blokrecord.ref.collection('items').get();
  const records = Object.fromEntries(items.docs.map((doc) => [doc.id, { id: doc.id, ...doc.data() }]));
  records[ITEM_ID] = { ...records[ITEM_ID], ...goedgerekend(data) };
  const samenvatting = summarizeAssessmentItemProgress({ items: blokItemsPerId[blokrecord.get('blockId')], records });
  blokUpdates.push({ blokrecord, itemDoc, data, samenvatting });
}

const users = new Map();
const userVan = async (uid) => {
  if (!users.has(uid)) {
    const doc = await db.collection('users').doc(uid).get();
    users.set(uid, doc.exists ? doc.data() : {});
  }
  return users.get(uid);
};
for (const x of blokUpdates) {
  const uid = x.blokrecord.get('userId');
  const route = x.blokrecord.get('blockId').replace('block-dv-', '').replace('-nulmeting-dv-toets-b', '');
  console.log(`- ${(await userVan(uid)).displayName || uid} (${route}): ` +
    `${x.blokrecord.get('itemsCorrect') ?? '?'} -> ${x.samenvatting.itemsCorrect} goed, ` +
    `score ${x.blokrecord.get('score') ?? '?'} -> ${x.samenvatting.score}/${x.samenvatting.maxScore}, ` +
    `afgerond ${x.samenvatting.completed}`);
}

// 4. Startprofielen die al bestaan.
const uids = [...new Set(blokUpdates.map((x) => x.blokrecord.get('userId')))];
const metProfiel = [];
for (const uid of uids) {
  const profiel = await db.collection('nulmetingProfielen').doc(uid).get();
  if (profiel.exists) metProfiel.push({ uid, oud: profiel.data() });
}
console.log(`\nStartprofielen opnieuw te berekenen: ${metProfiel.length} van ${uids.length} leerlingen.`);

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

// Back-up.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `nulmeting-b03-opzoekvraag-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify({
  blokken: blokken.map((blok) => ({ id: blok.id, item: blok.content.items.find((i) => i.id === ITEM_ID) })),
  items: blokUpdates.map((x) => ({ pad: x.itemDoc.ref.path, data: x.data })),
  blokrecords: blokUpdates.map((x) => ({ pad: x.blokrecord.ref.path, data: x.blokrecord.data() })),
  profielen: metProfiel
}, null, 2));
console.log(`\nBack-up: ${backupPad}`);

// 1. Vraagtekst en snapshot.
for (const blok of blokken) {
  const items = blok.content.items.map((item) => (item.id === ITEM_ID ? { ...item, prompt: NIEUWE_PROMPT } : item));
  const nieuw = { ...blok, content: { ...blok.content, items } };
  await db.collection('contentBlocks').doc(blok.id).update({ 'content.items': cleanForFirestore(items), updatedAt: FieldValue.serverTimestamp() });
  const snapshot = buildPublicContentBlockSnapshot(nieuw);
  await db.collection('publicContentBlocks').doc(snapshot.id).set(cleanForFirestore({ ...snapshot, updatedAt: FieldValue.serverTimestamp() }));
  console.log(`Vraagtekst aangepast: ${blok.id}`);
}

// 2 en 3. Items en blokstand.
for (const x of blokUpdates) {
  await x.itemDoc.ref.set(cleanForFirestore({
    ...goedgerekend(x.data),
    goedgerekendOp: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }), { merge: true });
  const s = x.samenvatting;
  await x.blokrecord.ref.set(cleanForFirestore({
    itemCount: s.itemCount,
    itemsCompleted: s.itemsCompleted,
    itemsCorrect: s.itemsCorrect,
    score: s.score,
    maxScore: s.maxScore,
    eersteScore: s.eersteScore,
    completed: s.completed,
    isCorrect: s.isCorrect,
    resultTier: s.resultTier,
    attemptStatus: s.attemptStatus,
    updatedAt: FieldValue.serverTimestamp()
  }), { merge: true });
}
console.log(`Goed gerekend: ${blokUpdates.length} leerlingen.`);

// 4. Startprofielen, zelfde regels als computeNulmetingProfielForStudent.
for (const { uid } of metProfiel) {
  const userData = await userVan(uid);
  const klas = await db.collection('klassen').doc(String(userData.klasId || '-')).get();
  const paragraafIds = (klas.exists ? klas.get('enabledParagrafen') || [] : []).map(String);
  const nulmetingBlokken = [];
  for (let i = 0; i < paragraafIds.length; i += 30) {
    const snap = await db.collection('contentBlocks').where('paragraafId', 'in', paragraafIds.slice(i, i + 30)).get();
    snap.docs.forEach((doc) => {
      const data = doc.data();
      if (data.type === 'toets' && data.content?.nulmeting?.mapping && data.isArchived !== true) nulmetingBlokken.push({ id: doc.id, ...data });
    });
  }
  nulmetingBlokken.sort((a, b) => String(a.content.nulmeting.deel).localeCompare(String(b.content.nulmeting.deel)));
  if (!nulmetingBlokken.length) {
    console.log(`  Geen nulmeting bij de klas van ${uid}, profiel overgeslagen.`);
    continue;
  }
  const mapping = {};
  nulmetingBlokken.forEach((blok) => Object.assign(mapping, blok.content.nulmeting.mapping || {}));
  const analysemodel = nulmetingBlokken.find((blok) => blok.content.nulmeting.analysemodel)?.content.nulmeting.analysemodel || {};
  const itemRecords = {};
  let laatste = null;
  for (const blok of nulmetingBlokken) {
    const items = await db.collection('voortgang').doc(`${uid}_${blok.id}`).collection('items').get();
    items.docs.forEach((doc) => {
      const data = doc.data();
      itemRecords[doc.id] = { completed: data.completed === true, isCorrect: data.isCorrect === true };
      const moment = data.completedAt?.toDate ? data.completedAt.toDate() : null;
      if (moment && (!laatste || moment > laatste)) laatste = moment;
    });
  }
  const nu = new Date();
  const profiel = buildNulmetingProfiel({
    analysemodel,
    mapping,
    itemRecords,
    leerlingId: uid,
    naam: String(userData.displayName || ''),
    afgenomenOp: (laatste || nu).toISOString().slice(0, 10)
  });
  await db.collection('nulmetingProfielen').doc(uid).set(cleanForFirestore({
    ...profiel,
    userId: uid,
    klasId: String(userData.klasId || ''),
    blokIds: nulmetingBlokken.map((blok) => blok.id),
    berekendOp: nu.toISOString()
  }), { merge: false });
}
console.log(`Startprofielen opnieuw berekend: ${metProfiel.length}.`);

console.log('\nKlaar.');
process.exit(0);
