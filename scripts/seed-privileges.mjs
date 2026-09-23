/**
 * Zet de privileges van fase 4 als shopitems in Firestore
 * (SPELOPZET-FASE4-PRIVILEGES.md, §0).
 *
 *   node scripts/seed-privileges.mjs            dry run
 *   node scripts/seed-privileges.mjs --apply    schrijven
 *
 * Bestaat een privilege al, dan blijven prijs, voorraad, maximum en aan/uit
 * staan: die beheert Kevin in het tokenbeheer.
 */

import { createRequire } from 'node:module';
import { STANDAARD_PRIVILEGES } from '../src/lib/privileges.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}
const db = getFirestore();
const batch = db.batch();

for (const [index, privilege] of STANDAARD_PRIVILEGES.entries()) {
  const ref = db.doc(`tokenShopItems/${privilege.id}`);
  const bestaand = await ref.get();
  if (bestaand.exists) {
    console.log(`  bestaat al  ${privilege.id}  (niets veranderd)`);
    continue;
  }
  console.log(`  nieuw       ${privilege.id}  ${privilege.prijs} tokens, ${privilege.voorraadPerWeek} per week${privilege.maxPerSchooljaar ? `, hooguit ${privilege.maxPerSchooljaar} per schooljaar` : ''}`);
  batch.set(ref, {
    title: privilege.titel,
    description: privilege.beschrijving,
    price: privilege.prijs,
    itemType: 'privilege',
    targetSlot: 'privilege',
    rarity: privilege.prijs >= 1000 ? 'platinum' : privilege.prijs >= 500 ? 'epic' : 'rare',
    repeatable: true,
    enabled: true,
    sortOrder: 900 + index,
    voorraadPerWeek: privilege.voorraadPerWeek,
    maxPerSchooljaar: privilege.maxPerSchooljaar,
    imageUrl: '',
    imageStoragePath: '',
    previewStyle: {},
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
}

if (!apply) {
  console.log('Dry run. Draai met --apply om te schrijven.');
  process.exit(0);
}
await batch.commit();
console.log('Geschreven.');
