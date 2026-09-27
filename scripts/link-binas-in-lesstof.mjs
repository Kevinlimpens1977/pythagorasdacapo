/**
 * Maakt van het woord "Binas" in de lestekst (html) van Binask H2 een link
 * (<a href="#binas">) die het boekje met dichtheden opent, hetzelfde als in het
 * dichtheidsspel (Kevin, 27 sep 2026).
 *
 *   node scripts/link-binas-in-lesstof.mjs            dry run
 *   node scripts/link-binas-in-lesstof.mjs --apply    schrijven
 *
 * Idempotent: een tekst waar al een Binas-link in staat, blijft ongemoeid.
 * De lijst met kernbegrippen (keyTerms) blijft gewone tekst.
 * Daarna: node scripts/backfill-public-content-snapshots.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --apply
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const HOOFDSTUK_ID = 'hoofdstuk-binask-eoa-1-h2';
const LINK = '<a href="#binas" class="binas-link" title="Open het boekje met dichtheden">Binas</a>';

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

// Alleen in html-velden, en nooit binnen een tag.
function vervang(waarde, teller, sleutel = '') {
  if (typeof waarde === 'string') {
    if (!/html/i.test(sleutel) || waarde.includes('href="#binas"')) return waarde;
    return waarde.replace(/(<[^>]*>)|\bBinas\b/g, (treffer, tag) => {
      if (tag) return tag;
      teller.n += 1;
      return LINK;
    });
  }
  if (Array.isArray(waarde)) return waarde.map((item) => vervang(item, teller, sleutel));
  if (waarde && typeof waarde === 'object' && !waarde.toDate) {
    return Object.fromEntries(Object.entries(waarde).map(([naam, item]) => [naam, vervang(item, teller, naam)]));
  }
  return waarde;
}

const blokken = (await db.collection('contentBlocks').where('hoofdstukId', '==', HOOFDSTUK_ID).get()).docs;
const wijzigingen = [];
for (const doc of blokken) {
  const data = doc.data();
  const teller = { n: 0 };
  const content = vervang(data.content, teller);
  const aantal = JSON.stringify(data.content || {}).match(/Binas/g)?.length || 0;
  if (aantal) console.log(`${teller.n ? 'LINK' : '    '}  ${doc.id}  (${data.title})  Binas ${aantal}x, link ${teller.n}x`);
  if (teller.n) wijzigingen.push({ id: doc.id, content });
}

if (!apply) {
  console.log(`\nDry run: ${wijzigingen.length} blok(ken) zouden wijzigen. Draai met --apply om te schrijven.`);
  process.exit(0);
}
for (const { id, content } of wijzigingen) {
  await db.collection('contentBlocks').doc(id).update({ content, updatedAt: FieldValue.serverTimestamp() });
}
console.log(`\nGeschreven: ${wijzigingen.length} blok(ken). Vergeet de snapshot niet.`);
