/**
 * Leest de lesstof van één hoofdstuk uit Firestore. Alleen lezen.
 *
 *   node video/scripts/lees-hoofdstuk.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2
 *
 * Schrijft video/public/hoofdstukken/<id>/lesstof.json en toont per paragraaf
 * wat er staat, plus de voorgestelde doelparagraaf voor de video.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { vatLesstofSamen, stelDoelParagraafVoor } from '../lib/lesstof.mjs';

// De repo-root, afgeleid van dit bestand: het script werkt zo vanuit elke map.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const args = process.argv.slice(2);
const optie = (naam) => {
  const i = args.indexOf(naam);
  return i >= 0 && args[i + 1] ? args[i + 1] : '';
};
const hoofdstukId = optie('--hoofdstuk');
if (!hoofdstukId) {
  console.error('Gebruik: node video/scripts/lees-hoofdstuk.mjs --hoofdstuk <hoofdstukId>');
  process.exit(1);
}

const requireFromFunctions = createRequire(new URL('../../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const hoofdstukSnap = await db.collection('hoofdstuk').doc(hoofdstukId).get();
if (!hoofdstukSnap.exists) {
  console.error(`Hoofdstuk ${hoofdstukId} bestaat niet in Firestore.`);
  process.exit(1);
}
const paragrafen = (await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((p) => p.isArchived !== true);
const blokken = (await db.collection('contentBlocks').where('hoofdstukId', '==', hoofdstukId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((b) => b.isArchived !== true);

const lesstof = vatLesstofSamen({ hoofdstuk: { id: hoofdstukSnap.id, ...hoofdstukSnap.data() }, paragrafen, blokken });
const uitMap = path.join(ROOT, 'video/public/hoofdstukken', hoofdstukId);
fs.mkdirSync(uitMap, { recursive: true });
fs.writeFileSync(path.join(uitMap, 'lesstof.json'), `${JSON.stringify(lesstof, null, 2)}\n`);

console.log(`${lesstof.titel} (${hoofdstukId})`);
for (const p of lesstof.paragrafen) {
  console.log(`  ${p.code.padEnd(4)} ${p.titel.padEnd(28)} ${p.blokken.length} uitlegblok(ken)${p.heeftSamenvatting ? ', heeft Samenvatting' : ''}  [${p.id}]`);
}
console.log(`Voorgestelde doelparagraaf: ${stelDoelParagraafVoor(lesstof) || 'geen; vraag Kevin'}`);
console.log(`Geschreven: ${path.relative(process.cwd(), path.join(uitMap, 'lesstof.json'))}`);
process.exit(0);
