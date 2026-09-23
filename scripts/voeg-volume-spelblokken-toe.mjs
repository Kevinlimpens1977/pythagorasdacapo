/**
 * Zet de drie spellen "Volume berekenen" als lesblokken onderaan Binask
 * paragraaf 2.2 Volume (na blok 8), en zet hun tokenregel in Firestore.
 *
 *   node scripts/voeg-volume-spelblokken-toe.mjs            dry run
 *   node scripts/voeg-volume-spelblokken-toe.mjs --apply    schrijven
 *
 * - Idempotent: blokken hebben een vaste id; nog een keer draaien overschrijft
 *   ze met dezelfde inhoud.
 * - Heeft een klas voor deze paragraaf een eigen blokselectie
 *   (enabledContentBlocks), dan komen de nieuwe blokken daarbij; anders zou de
 *   leerling ze niet zien.
 * - Tokenregel: 0-100 per spel, replayDecay 0.5 (het beheerscherm schrijft
 *   replayDecay niet, daarom hier).
 * - Daarna nog: node scripts/backfill-public-content-snapshots.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --apply
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const PARAGRAAF_ID = 'paragraaf-binask-eoa-1-2-2';
const KLASSEN = ['klas_1787768387441_7', 'klas_1787768387528_8'];

const SPELLEN = [
  {
    gameId: 'binask-volume-maatcilinder',
    title: 'Spel: Lees de maatcilinder',
    html: '<p>Oefen het aflezen van maatcilinders van 10 ml tot 1 liter. Kijk goed naar de streepjes en lees af bij de onderkant van de meniscus.</p>'
  },
  {
    gameId: 'binask-volume-balk',
    title: 'Spel: Meet en bereken de balk',
    html: '<p>Meet blokken met de liniaal en bereken het volume met lengte × breedte × hoogte. Reken daarna om naar ml.</p>'
  },
  {
    gameId: 'binask-volume-onderdompelen',
    title: 'Spel: Dompel onder',
    html: '<p>Meet het volume van een steen, sleutel of knikker met de onderdompelmethode. Pas op voor de valkuilen.</p>'
  }
];

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}
const db = getFirestore();

const bestaand = (await db.collection('contentBlocks').where('paragraafId', '==', PARAGRAAF_ID).get())
  .docs.map((d) => ({ id: d.id, ...d.data() }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

if (bestaand.length === 0) throw new Error(`Geen blokken gevonden voor ${PARAGRAAF_ID}.`);
const basis = bestaand.find((b) => b.type !== 'game') || bestaand[0];
const nieuweIds = SPELLEN.map((spel) => `block-binask-eoa-1-22-game-${spel.gameId.replace('binask-volume-', '')}`);
const zonderSpellen = bestaand.filter((b) => !nieuweIds.includes(b.id));
const hoogste = Math.max(...zonderSpellen.map((b) => Number(b.order) || 0));

console.log(`Paragraaf ${PARAGRAAF_ID}: ${zonderSpellen.length} bestaande blokken, hoogste volgnummer ${hoogste}.`);
for (const b of bestaand) console.log(`  ${b.order}  ${b.id}  (${b.type}) ${b.title}`);

const blokken = SPELLEN.map((spel, i) => ({
  id: nieuweIds[i],
  type: 'game',
  title: spel.title,
  order: hoogste + 1 + i,
  status: 'published',
  isArchived: false,
  paragraafId: PARAGRAAF_ID,
  hoofdstukId: basis.hoofdstukId,
  niveauId: basis.niveauId,
  leerjaarId: basis.leerjaarId,
  vakId: basis.vakId,
  linkedVraagId: null,
  settings: { allowMathToolbox: false, allowAiHelp: false },
  content: {
    gameId: spel.gameId,
    gameTitle: spel.title.replace('Spel: ', ''),
    html: spel.html,
    settings: { estimatedMinutes: 8 }
  },
  createdBy: 'scripts/voeg-volume-spelblokken-toe.mjs'
}));

console.log('\nNieuwe of bijgewerkte blokken:');
for (const b of blokken) console.log(`  ${b.order}  ${b.id}  -> ${b.content.gameId}`);

const klasUpdates = [];
for (const klasId of KLASSEN) {
  const klas = await db.collection('klassen').doc(klasId).get();
  if (!klas.exists) { console.log(`\nKlas ${klasId} bestaat niet, overgeslagen.`); continue; }
  const data = klas.data() || {};
  const toegewezen = (data.enabledParagrafen || []).includes(PARAGRAAF_ID);
  const selectie = data.enabledContentBlocks?.[PARAGRAAF_ID];
  console.log(`\nKlas ${data.naam || data.name || klasId}: paragraaf toegewezen ${toegewezen ? 'ja' : 'NEE'}, eigen blokselectie ${Array.isArray(selectie) ? `ja (${selectie.length})` : 'nee (alle blokken zichtbaar)'}.`);
  if (Array.isArray(selectie)) {
    const erbij = nieuweIds.filter((id) => !selectie.includes(id));
    if (erbij.length) klasUpdates.push({ klasId, erbij });
    console.log(`  Toe te voegen aan de selectie: ${erbij.length ? erbij.join(', ') : 'niets'}`);
  }
}

console.log('\nTokenregels:');
for (const spel of SPELLEN) {
  const huidig = await db.collection('tokenGameRewardRules').doc(spel.gameId).get();
  console.log(`  ${spel.gameId}: ${huidig.exists ? JSON.stringify(huidig.data()) : 'nog geen regel'} -> 0-100, replayDecay 0.5`);
}

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}

const batch = db.batch();
for (const b of blokken) {
  batch.set(db.collection('contentBlocks').doc(b.id), { ...b, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
for (const { klasId, erbij } of klasUpdates) {
  batch.update(db.collection('klassen').doc(klasId), {
    [`enabledContentBlocks.${PARAGRAAF_ID}`]: FieldValue.arrayUnion(...erbij)
  });
}
for (const spel of SPELLEN) {
  batch.set(db.collection('tokenGameRewardRules').doc(spel.gameId), {
    enabled: true, min: 0, max: 100, basis: 'score_accuracy_completion', replayDecay: 0.5, maxPlays: 0,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}
await batch.commit();
console.log('\nGeschreven. Vergeet de snapshot niet:');
console.log('  node scripts/backfill-public-content-snapshots.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --apply');
