// Seed de standaard tokenshop-catalogus (avatars, frames, pins, banners, titels,
// victory-effects) naar Firestore. Zelfde payloadvorm als createOrUpdateTokenShopItemCore.
// Dry-run zonder vlag; schrijf met: node scripts/seed-token-shop-catalog.mjs --apply
import { createRequire } from 'node:module';

import { buildShopSeedPayload, DEFAULT_TOKEN_SHOP_ITEMS } from '../src/lib/tokenShopRewards.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SEED_ACTOR = 'seed-token-shop-catalog-script';
const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID
  });
}

const db = getFirestore();

let created = 0;
let updated = 0;

for (const item of DEFAULT_TOKEN_SHOP_ITEMS) {
  const seedPayload = buildShopSeedPayload(item);
  const { itemId, ...fields } = seedPayload;
  const itemRef = db.doc(`tokenShopItems/${itemId}`);
  const existing = await itemRef.get();
  const payload = {
    ...fields,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: SEED_ACTOR,
    ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp(), createdBy: SEED_ACTOR })
  };

  if (apply) {
    await itemRef.set(payload, { merge: true });
  }

  if (existing.exists) {
    updated += 1;
    console.log(`${apply ? 'BIJGEWERKT' : 'zou bijwerken'}: ${itemId} (${item.itemType}, ${item.price} tokens)`);
  } else {
    created += 1;
    console.log(`${apply ? 'AANGEMAAKT' : 'zou aanmaken'}: ${itemId} (${item.itemType}, ${item.price} tokens)`);
  }
}

console.log(`\n${apply ? 'Klaar' : 'Dry-run klaar'}: ${created} nieuw, ${updated} bijgewerkt (totaal ${DEFAULT_TOKEN_SHOP_ITEMS.length}).`);
if (!apply) {
  console.log('Voer opnieuw uit met --apply om echt te schrijven.');
}
