/**
 * Verwijdert de oude lesblokken die naar een gepland DV-spel verwijzen. Die
 * placeholders zijn op 23 sep 2026 uit GAME_REGISTRY gehaald; de blokken zijn
 * daarmee resten zonder spel.
 *
 *   node scripts/verwijder-geplande-spelblokken.mjs            dry run
 *   node scripts/verwijder-geplande-spelblokken.mjs --apply    verwijderen
 *
 * Een gameblok komt alleen in aanmerking als zijn gameId met "dv-" begint en
 * niet (meer) in GAME_REGISTRY staat. Weigert als een blok in een toegewezen
 * paragraaf staat, in een klasselectie zit of in voortgang voorkomt. Schrijft
 * vóór het verwijderen een back-up naar exports/reset-backups/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { GAME_REGISTRY } from '../src/lib/gameRegistry.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}
const db = getFirestore();

const bekend = new Set(GAME_REGISTRY.map((game) => game.gameId));
const gameBlokken = (await db.collection('contentBlocks').where('type', '==', 'game').get())
  .docs.map((d) => ({ id: d.id, ...d.data() }));
const doelen = gameBlokken.filter((b) => {
  const gameId = b.content?.gameId || '';
  return gameId.startsWith('dv-') && !bekend.has(gameId);
});

console.log(`Gameblokken totaal: ${gameBlokken.length}. Te verwijderen: ${doelen.length}.`);
for (const b of doelen) console.log(`  ${b.id}  (${b.content?.gameId})  in ${b.paragraafId}`);

// Veiligheidscontroles
const problemen = [];
const ids = new Set(doelen.map((b) => b.id));
const paragrafen = new Set(doelen.map((b) => b.paragraafId));

const klassen = (await db.collection('klassen').get()).docs.map((d) => ({ id: d.id, ...d.data() }));
for (const klas of klassen) {
  const toegewezen = new Set([
    ...(klas.enabledParagrafen || []),
    ...Object.values(klas.studentOverrides || {}).flatMap((o) => o.extraParagrafen || [])
  ]);
  for (const p of paragrafen) if (toegewezen.has(p)) problemen.push(`klas ${klas.id} heeft paragraaf ${p} toegewezen`);
  const selecties = [
    ...Object.values(klas.enabledContentBlocks || {}).flat(),
    ...Object.values(klas.studentOverrides || {}).flatMap((o) => Object.values(o.extraContentBlocks || {}).flat())
  ];
  for (const id of selecties) if (ids.has(id)) problemen.push(`klas ${klas.id} noemt blok ${id} in een selectie`);
}

let voortgangTreffers = 0;
for (const p of paragrafen) {
  const voortgang = await db.collection('voortgang').where('paragraafId', '==', p).get();
  for (const doc of voortgang.docs) {
    const tekst = JSON.stringify(doc.data());
    if ([...ids].some((id) => tekst.includes(id))) {
      voortgangTreffers += 1;
      problemen.push(`voortgang ${doc.id} verwijst naar een van de blokken`);
    }
  }
}

const snapshots = [];
for (const id of ids) {
  const snap = await db.collection('publicContentBlocks').doc(id).get();
  if (snap.exists) snapshots.push({ id, ...snap.data() });
}

console.log(`Publieke snapshots: ${snapshots.length}. Voortgang met een verwijzing: ${voortgangTreffers}.`);

if (problemen.length) {
  console.log('\nGEWEIGERD:');
  for (const p of problemen) console.log(`  - ${p}`);
  process.exit(1);
}

if (!apply) {
  console.log('\nDry run: niets verwijderd. Draai met --apply om te verwijderen.');
  process.exit(0);
}

const map = path.resolve('exports/reset-backups');
fs.mkdirSync(map, { recursive: true });
const backup = path.join(map, `geplande-spelblokken-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backup, JSON.stringify({ contentBlocks: doelen, publicContentBlocks: snapshots }, null, 2));
console.log(`\nBack-up: ${backup}`);

const batch = db.batch();
for (const b of doelen) batch.delete(db.collection('contentBlocks').doc(b.id));
for (const s of snapshots) batch.delete(db.collection('publicContentBlocks').doc(s.id));
await batch.commit();
console.log(`Verwijderd: ${doelen.length} lesblokken en ${snapshots.length} snapshots.`);
