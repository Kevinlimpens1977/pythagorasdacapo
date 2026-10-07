/**
 * Zet de inclusieversie van een hoofdstuk klaar voor de inclusieklas(sen).
 *
 * Een inclusieversie bestaat uit eigen paragrafen in hetzelfde hoofdstuk, met
 * een id als `paragraaf-dv-klas1-incl-21` naast de basis `paragraaf-dv-klas1-21`
 * (bron-JSON met blokPrefix `<basis>-incl`, zie de skill helix-hoofdstuk-bouwen).
 * Dit script doet per hoofdstuk:
 *   1. elke inclusieparagraaf koppelen aan zijn basis: variantVan en
 *      variantProfiel 'inclusie' (docs/PLAN-INCLUSIEVARIANTEN.md);
 *   2. met --deel-presentatie: het deckblok van de basisparagraaf kopiëren naar
 *      de inclusieparagraaf, met hetzelfde pakket en dezelfde PDF. Niet opnieuw
 *      plaatsen met plaats-hoofdstuk-slidedecks.mjs: dat zet een nieuw
 *      downloadtoken op de PDF en breekt de presentatie van de basisklassen;
 *   3. de inclusieparagrafen toewijzen aan de inclusieklassen, en alleen daar;
 *   4. met --open of --op-slot het hoofdstuk voor die klassen open of op slot
 *      zetten (zonder vlag blijft het slot zoals het is);
 *   5. per leerling narekenen wat hij werkelijk ziet, met dezelfde functies als
 *      de app.
 * Andere klassen worden niet aangeraakt, alleen gecontroleerd.
 *
 *   node scripts/zet-inclusie-klaar.mjs --hoofdstuk hoofdstuk-dv-klas1-h2 --deel-presentatie --open
 *   node scripts/zet-inclusie-klaar.mjs --hoofdstuk hoofdstuk-dv-klas1-h2 --deel-presentatie --open --apply
 *
 * Vóór het schrijven gaat er een back-up van de inclusieklassen naar
 * exports/reset-backups/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { getEffectiveContentBlocks, getStudentEffectiveParagrafen } from '../src/lib/assignmentUtils.js';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from '../src/lib/klasRoute.js';
import { isBlokVergrendeld, isHoofdstukVergrendeld, isParagraafVergrendeld } from '../src/lib/hoofdstukSlot.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const SCRIPT_NAAM = 'scripts/zet-inclusie-klaar.mjs';
const PROFIEL = 'inclusie';
// Klassen met leerprofiel 'inclusie' tellen vanzelf mee. Zolang dat veld nog
// niet op de klas staat (fase 1 van het variantplan), noemen we ze hier.
const INCLUSIEKLASSEN = ['H1i1'];

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const deelPresentatie = argumenten.includes('--deel-presentatie');
const slot = argumenten.includes('--op-slot') ? 'op slot' : argumenten.includes('--open') ? 'open' : '';
const hoofdstukId = (() => {
  const index = argumenten.indexOf('--hoofdstuk');
  return index >= 0 ? argumenten[index + 1] || '' : '';
})();
if (!hoofdstukId) {
  console.error('Gebruik: node scripts/zet-inclusie-klaar.mjs --hoofdstuk <id> [--deel-presentatie] [--open | --op-slot] [--apply]');
  process.exit(1);
}
if (argumenten.includes('--open') && argumenten.includes('--op-slot')) {
  console.error('Kies --open of --op-slot, niet allebei.');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const isActiefBlok = (blok) => blok.isArchived !== true && (blok.status === 'published' || blok.status === undefined);
const blokkenVan = async (paragraafId) =>
  (await db.collection('contentBlocks').where('paragraafId', '==', paragraafId).get()).docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(isActiefBlok)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

console.log(`Inclusieversie van ${hoofdstukId} klaarzetten (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// 1. Paragrafen van het hoofdstuk, gepaard: inclusie naast basis.
const paragrafen = (await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get()).docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .filter((p) => p.isArchived !== true && p.published !== false);
const paren = paragrafen
  .filter((p) => p.id.includes('-incl-'))
  .map((incl) => ({ incl, basis: paragrafen.find((p) => p.id === incl.id.replace('-incl-', '-')) }))
  .sort((a, b) => (a.incl.order || 0) - (b.incl.order || 0));
if (!paren.length) {
  console.error(`Geen inclusieparagrafen (id met "-incl-") in ${hoofdstukId}. Importeer eerst de seed.`);
  process.exit(1);
}
const zonderBasis = paren.filter((paar) => !paar.basis);
if (zonderBasis.length) {
  console.error(`Geen basisparagraaf gevonden voor: ${zonderBasis.map((paar) => paar.incl.id).join(', ')}`);
  process.exit(1);
}
const inclusieIds = paren.map((paar) => paar.incl.id);
const basisIds = paren.map((paar) => paar.basis.id);

for (const { incl, basis } of paren) {
  const gekoppeld = incl.variantVan === basis.id && incl.variantProfiel === PROFIEL;
  console.log(`${incl.code} ${incl.id} -> variant van ${basis.id}: ${gekoppeld ? 'al gekoppeld' : 'wordt gekoppeld'}`);
}

// 2. Presentaties delen.
const deckKopieen = [];
if (deelPresentatie) {
  for (const { incl, basis } of paren) {
    const basisDeck = (await blokkenVan(basis.id)).find((b) => b.type === 'slidedeck');
    if (!basisDeck) continue;
    const id = basisDeck.id.replace(`block-${basis.id.replace(/^paragraaf-/, '')}-`, `block-${incl.id.replace(/^paragraaf-/, '')}-`);
    if (id === basisDeck.id) {
      console.error(`Kan geen eigen id afleiden voor het deck van ${incl.id} (${basisDeck.id}).`);
      process.exit(1);
    }
    const bestaat = (await db.collection('contentBlocks').doc(id).get()).exists;
    const eigenBlokken = await blokkenVan(incl.id);
    const plekBezet = eigenBlokken.some((b) => b.id !== id && (b.order || 0) === (basisDeck.order || 1));
    if (plekBezet) {
      console.error(`${incl.code}: volgnummer ${basisDeck.order} is al bezet; de tekstblokken horen bij 2 te beginnen.`);
      process.exit(1);
    }
    const { id: _id, updatedAt: _u, ...rest } = basisDeck;
    deckKopieen.push({ id, data: { ...rest, id, paragraafId: incl.id, createdBy: SCRIPT_NAAM } });
    console.log(`${incl.code}: presentatie ${bestaat ? 'bestaat al, wordt gelijkgetrokken' : 'wordt gedeeld'} (${id}, pakket ${basisDeck.content?.slidedeckPackageId})`);
  }
  if (!deckKopieen.length) console.log('Geen basisparagraaf met een presentatie gevonden.');
}

// 3. Klassen: inclusieklassen krijgen de inclusieparagrafen, de rest wordt alleen gecontroleerd.
const klassen = (await db.collection('klassen').get()).docs.map((d) => ({ ref: d.ref, id: d.id, data: d.data() }));
const naamVan = (k) => k.data.naam || k.data.name || k.id;
const isInclusieklas = (k) => k.data.leerprofiel === PROFIEL || INCLUSIEKLASSEN.includes(naamVan(k));
const inclusieklassen = klassen.filter(isInclusieklas);
if (!inclusieklassen.length) {
  console.error('Geen inclusieklas gevonden.');
  process.exit(1);
}

console.log('');
const plannen = [];
for (const klas of inclusieklassen) {
  const huidig = klas.data.enabledParagrafen || [];
  const nieuw = inclusieIds.filter((id) => !huidig.includes(id));
  const basisToegewezen = basisIds.filter((id) => huidig.includes(id));
  const nuOpSlot = isHoofdstukVergrendeld(klas.data, hoofdstukId);
  const slotWijzigt = (slot === 'open' && nuOpSlot) || (slot === 'op slot' && !nuOpSlot);
  plannen.push({ ...klas, nieuw, slotWijzigt });
  console.log(`${naamVan(klas)} (inclusie, route ${getKlasNiveauId(klas.data) || 'geen'})`);
  console.log(`  komt erbij:  ${nieuw.length ? nieuw.join(', ') : 'al toegewezen'}`);
  console.log(`  hoofdstuk:   ${nuOpSlot ? 'op slot' : 'open'}${slotWijzigt ? ` -> ${slot}` : ''}`);
  if (basisToegewezen.length) console.log(`  LET OP: ook de basisparagrafen zijn toegewezen: ${basisToegewezen.join(', ')}. Dit script haalt ze niet weg.`);
}
for (const klas of klassen.filter((k) => !isInclusieklas(k))) {
  const lek = inclusieIds.filter((id) => (klas.data.enabledParagrafen || []).includes(id));
  if (lek.length) console.log(`LET OP: ${naamVan(klas)} is geen inclusieklas maar heeft ${lek.join(', ')}. Dit script raakt die klas niet aan.`);
}

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}

// Back-up van de klassen die geraakt worden.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `klassen-voor-inclusie-${hoofdstukId}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(plannen.map((p) => ({ id: p.id, naam: naamVan(p), ...p.data })), null, 2));
console.log(`\nBack-up: ${backupPad}`);

const batch = db.batch();
for (const { incl, basis } of paren) {
  batch.set(db.collection('paragraaf').doc(incl.id), { variantVan: basis.id, variantProfiel: PROFIEL }, { merge: true });
}
for (const kopie of deckKopieen) {
  batch.set(db.collection('contentBlocks').doc(kopie.id), { ...kopie.data, updatedAt: FieldValue.serverTimestamp() });
}
for (const plan of plannen) {
  const update = { updatedAt: FieldValue.serverTimestamp(), laatsteKlaarzetting: { script: SCRIPT_NAAM, op: new Date().toISOString() } };
  if (plan.nieuw.length) update.enabledParagrafen = FieldValue.arrayUnion(...plan.nieuw);
  if (plan.slotWijzigt) {
    update.vergrendeldeHoofdstukken = slot === 'open' ? FieldValue.arrayRemove(hoofdstukId) : FieldValue.arrayUnion(hoofdstukId);
  }
  batch.update(plan.ref, update);
}
await batch.commit();
console.log(`Geschreven: ${paren.length} paragrafen gekoppeld, ${deckKopieen.length} presentatie(s) gedeeld, ${plannen.length} klas(sen) bijgewerkt.`);
if (deckKopieen.length) {
  console.log(`Vergeet de snapshots niet: node scripts/backfill-public-content-snapshots.mjs --hoofdstuk ${hoofdstukId} --apply`);
}

// 4. Narekenen per leerling, met dezelfde regels als de app.
console.log('\nControle: wat ziet elke leerling van dit hoofdstuk?');
let fouten = 0;
for (const plan of plannen) {
  const klasData = (await plan.ref.get()).data();
  const route = getKlasNiveauId(klasData);
  const opSlot = isHoofdstukVergrendeld(klasData, hoofdstukId);
  console.log(`\n  ${naamVan(plan)} (route: ${route || 'geen'}, hoofdstuk ${opSlot ? 'op slot' : 'open'})`);
  const leerlingen = await db.collection('users').where('klasId', '==', plan.id).get();
  for (const leerling of leerlingen.docs) {
    const ids = getStudentEffectiveParagrafen(klasData, leerling.id);
    const docs = await Promise.all(ids.map((id) => db.collection('paragraaf').doc(id).get()));
    const zichtbaar = filterLesstofOpKlasRoute(docs.filter((d) => d.exists).map((d) => ({ id: d.id, ...d.data() })), route)
      .filter((p) => p.hoofdstukId === hoofdstukId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    let blokken = 0;
    let dicht = 0;
    for (const paragraaf of zichtbaar) {
      if (isParagraafVergrendeld(klasData, paragraaf)) dicht += 1;
      const effectief = getEffectiveContentBlocks(klasData, leerling.id, paragraaf.id, await blokkenVan(paragraaf.id));
      blokken += effectief.length;
      dicht += effectief.filter((b) => isBlokVergrendeld(klasData, b.id)).length;
    }
    const ontbreekt = inclusieIds.filter((id) => !zichtbaar.some((p) => p.id === id));
    const basisZichtbaar = zichtbaar.filter((p) => basisIds.includes(p.id));
    if (ontbreekt.length || basisZichtbaar.length) fouten += 1;
    const naam = String(leerling.get('displayName') || leerling.id).padEnd(24);
    const staart = [
      ontbreekt.length ? `ONTBREEKT: ${ontbreekt.join(', ')}` : '',
      basisZichtbaar.length ? `OOK BASIS: ${basisZichtbaar.map((p) => p.code).join(', ')}` : '',
      dicht ? `${dicht} onderdeel/onderdelen op slot` : ''
    ].filter(Boolean).join('  ');
    console.log(`    ${naam} ${zichtbaar.map((p) => p.code).join(', ') || '-'}: ${blokken} lesblokken${staart ? `  ${staart}` : ''}`);
  }
}
console.log(fouten === 0 ? '\nKlaar. Elke leerling van de inclusieklas ziet precies de inclusieversie.' : `\nLET OP: bij ${fouten} leerling(en) klopt het niet.`);
process.exit(fouten === 0 ? 0 : 1);
