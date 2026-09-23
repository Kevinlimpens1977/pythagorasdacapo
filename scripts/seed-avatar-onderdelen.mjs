/**
 * Zet de betaalde avatar-onderdelen (Shop 2.0, deel 2B) als shopitems in
 * Firestore. Gratis onderdelen en setbonussen krijgen geen shopitem: gratis mag
 * altijd, een bonus komt als aankoop van nul tokens bij een complete set.
 *
 *   node scripts/seed-avatar-onderdelen.mjs            dry run
 *   node scripts/seed-avatar-onderdelen.mjs --apply    schrijven
 *
 * Id per item: avatar-{deelId}. Bestaande items worden bijgewerkt (merge);
 * enabled en een door de docent aangepaste prijs blijven staan.
 */

import { createRequire } from 'node:module';
import { AVATAR_DELEN, AVATAR_SETS, shopItemIdVoorDeel } from '../src/lib/avatarDelen.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}
const db = getFirestore();

const SLOT_VOLGORDE = { kapsel: 0, kleding: 1, accessoire: 2, achtergrond: 3 };
const SLOT_NAAM = { kapsel: 'Kapsel', kleding: 'Kleding', accessoire: 'Accessoire', achtergrond: 'Achtergrond' };

const teKoop = AVATAR_DELEN.filter((deel) => deel.prijs > 0);
let nieuw = 0;
let bijgewerkt = 0;
const batch = db.batch();

for (const [index, deel] of teKoop.entries()) {
  const id = shopItemIdVoorDeel(deel.id);
  const ref = db.doc(`tokenShopItems/${id}`);
  const bestaand = await ref.get();
  const set = AVATAR_SETS.find((kandidaat) => kandidaat.id === deel.set);
  const payload = {
    title: deel.titel,
    description: set
      ? `${SLOT_NAAM[deel.slot]} uit de ${set.titel}. Heb je alle drie, dan krijg je een bonus.`
      : `${SLOT_NAAM[deel.slot]} voor je avatar.`,
    itemType: 'avatarOnderdeel',
    targetSlot: 'avatar',
    rarity: deel.zeldzaam,
    repeatable: false,
    sortOrder: 500 + SLOT_VOLGORDE[deel.slot] * 50 + index,
    previewStyle: { avatarDeel: deel.id, avatarSlot: deel.slot, ...(set ? { avatarSet: set.id } : {}) },
    imageUrl: '',
    imageStoragePath: '',
    updatedAt: FieldValue.serverTimestamp()
  };
  if (bestaand.exists) {
    bijgewerkt += 1;
    console.log(`  bijwerken  ${id}  (prijs blijft ${bestaand.data().price})`);
  } else {
    nieuw += 1;
    payload.price = deel.prijs;
    payload.enabled = true;
    payload.createdAt = FieldValue.serverTimestamp();
    console.log(`  nieuw      ${id}  ${deel.prijs} tokens`);
  }
  batch.set(ref, payload, { merge: true });
}

console.log(`\nAvatar-onderdelen te koop: ${teKoop.length}. Nieuw: ${nieuw}. Bijwerken: ${bijgewerkt}.`);
if (!apply) {
  console.log('Dry run. Draai met --apply om te schrijven.');
  process.exit(0);
}
await batch.commit();
console.log('Geschreven.');
