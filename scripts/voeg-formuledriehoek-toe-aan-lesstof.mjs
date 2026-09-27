/**
 * Zet de tekening van de formuledriehoek (public/lesstof/formuledriehoek.svg)
 * in het lesblok "De formuledriehoek gebruiken" van Binask 2.3, na de alinea
 * over de hand (Kevin, 27 sep 2026). Een <img>, zodat de tekstopmaak en de
 * vertaling er niet aankomen.
 *
 *   node scripts/voeg-formuledriehoek-toe-aan-lesstof.mjs            dry run
 *   node scripts/voeg-formuledriehoek-toe-aan-lesstof.mjs --apply    schrijven
 *
 * Idempotent. Daarna: node scripts/backfill-public-content-snapshots.mjs --hoofdstuk hoofdstuk-binask-eoa-1-h2 --apply
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const BLOK_ID = 'block-binask-eoa-1-23-theory-4';
const FIGUUR = '<figure class="formuledriehoek"><img src="/lesstof/formuledriehoek.svg" alt="De formuledriehoek. Hand op ρ: ρ = m / V. Hand op m: m = ρ × V. Hand op V: V = m / ρ." style="width:100%;max-width:640px;height:auto;margin:0 auto;display:block" /></figure>';
const ANKER = 'Dan blijft m boven ρ over: V = m / ρ.</p>';

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const doc = await db.collection('contentBlocks').doc(BLOK_ID).get();
const html = doc.data()?.content?.html || '';
if (html.includes('formuledriehoek.svg')) { console.log('Staat er al in. Niets te doen.'); process.exit(0); }
if (!html.includes(ANKER)) throw new Error('De alinea over de hand is niet gevonden; de tekst is veranderd.');
const nieuw = html.replace(ANKER, `${ANKER}${FIGUUR}`);
console.log(`${BLOK_ID}: tekening komt na "${ANKER.slice(0, 40)}..."`);

if (!apply) { console.log('Dry run: niets geschreven.'); process.exit(0); }
await db.collection('contentBlocks').doc(BLOK_ID).update({ 'content.html': nieuw, updatedAt: FieldValue.serverTimestamp() });
console.log('Geschreven. Vergeet de snapshot niet.');
