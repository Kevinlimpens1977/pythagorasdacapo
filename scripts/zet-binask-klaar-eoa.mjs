/**
 * Binask klaarzetten voor de twee EOA-klassen ER3L1A en ER3L2A.
 *
 * De lesstof 1.1 t/m 1.4 (hoofdstuk "h1 Stoffen") staat onder de route
 * "Leerroute 3 - leerjaar 1". ER3L1A volgt die route en ziet hem dus al.
 * ER3L2A volgt "Leerroute 3 - leerjaar 2" en zag de vier paragrafen niet:
 * een klas met een route toont alleen lesstof van dat niveau
 * (`isLesstofInKlasRoute`), ook als de paragraaf wel is toegewezen.
 *
 * Kevin koos op 10 september 2026: de route van ER3L2A gaat eraf, zodat die
 * klas alles ziet wat hem is toegewezen. Geen kopieen van de lesstof, en
 * "Ga van start..." blijft staan met de voortgang die er al in zit.
 *
 * Wat het script doet, per klas:
 *   1. alle gepubliceerde paragrafen van de lesstofroute toewijzen;
 *   2. paragrafen van de eigen route die al toegewezen waren laten staan;
 *   3. toewijzingen die bij geen van beide horen weghalen (de losse
 *      legacy-paragraaf uit de allereerste import, zonder voortgang);
 *   4. de route zetten zoals hierboven beschreven;
 *   5. een expliciete blokselectie opruimen wanneer die alle gepubliceerde
 *      blokken al bevat, zodat later toegevoegde blokken vanzelf meelopen.
 *
 * Daarna rekent het script met dezelfde functies als de app na wat elke
 * leerling werkelijk ziet, zodat "klaar voor alle leerlingen" niet op goed
 * vertrouwen staat.
 *
 *   node scripts/zet-binask-klaar-eoa.mjs            # dry run
 *   node scripts/zet-binask-klaar-eoa.mjs --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { getEffectiveContentBlocks, getStudentEffectiveParagrafen } from '../src/lib/assignmentUtils.js';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from '../src/lib/klasRoute.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/zet-binask-klaar-eoa.mjs';
const NIVEAU_LESSTOF = 'niveau-binask-eoa-1-lr3';
// eigenNiveau: de route waar de klas oorspronkelijk onder viel. Daarmee blijft
// "Ga van start..." van ER3L2A ook staan nu die klas geen route meer heeft;
// anders zou een tweede run hem als overbodig weghalen, mét de voortgang erin.
const KLASSEN = [
  { id: 'klas_1787768387441_7', naam: 'ER3L1A', routeNa: NIVEAU_LESSTOF, eigenNiveau: NIVEAU_LESSTOF },
  { id: 'klas_1787768387528_8', naam: 'ER3L2A', routeNa: '', eigenNiveau: 'niveau-binask-eoa-2-lr3' }
];

const apply = process.argv.slice(2).includes('--apply');

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const isActiefBlok = (blok) =>
  blok.isArchived !== true && (blok.status === 'published' || blok.status === undefined);

const gepubliceerdeBlokken = async (paragraafId) => {
  const snap = await db.collection('contentBlocks').where('paragraafId', '==', paragraafId).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(isActiefBlok)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

console.log(`Binask klaarzetten voor de EOA-klassen (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// 1. De lesstof zelf, uit Firestore en niet hardgecodeerd.
const lesstofSnap = await db.collection('paragraaf').where('niveauId', '==', NIVEAU_LESSTOF).get();
const lesstof = lesstofSnap.docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .filter((p) => p.isArchived !== true && p.published !== false)
  .sort((a, b) => (a.order || 0) - (b.order || 0));

if (lesstof.length === 0) {
  console.error(`Geen gepubliceerde paragrafen gevonden onder ${NIVEAU_LESSTOF}.`);
  process.exit(1);
}

const blokkenPerParagraaf = new Map();
console.log('Lesstof die klaargezet wordt:');
for (const paragraaf of lesstof) {
  const blokken = await gepubliceerdeBlokken(paragraaf.id);
  blokkenPerParagraaf.set(paragraaf.id, blokken);
  console.log(`  ${paragraaf.code}  ${paragraaf.title}  (${blokken.length} lesblokken)  ${paragraaf.id}`);
}

// 2. Per klas het plan opstellen.
const plannen = [];
for (const klas of KLASSEN) {
  const snap = await db.collection('klassen').doc(klas.id).get();
  if (!snap.exists) {
    console.error(`\nKlas ${klas.naam} (${klas.id}) bestaat niet.`);
    process.exit(1);
  }
  const data = snap.data();
  const huidigeRoute = getKlasNiveauId(data);
  const huidig = Array.isArray(data.enabledParagrafen) ? data.enabledParagrafen : [];

  // Paragrafen van de eigen route die al toegewezen waren blijven staan.
  const eigenNiveau = klas.eigenNiveau || huidigeRoute;
  const eigen = [];
  const overbodig = [];
  for (const paragraafId of huidig) {
    if (lesstof.some((p) => p.id === paragraafId)) continue;
    const doc = await db.collection('paragraaf').doc(paragraafId).get();
    const niveauId = doc.exists ? getKlasNiveauId(doc.data()) : '';
    if (doc.exists && eigenNiveau && niveauId === eigenNiveau) {
      eigen.push({ id: paragraafId, title: doc.get('title') || doc.get('titel') || '' });
    } else {
      overbodig.push({
        id: paragraafId,
        title: doc.exists ? doc.get('title') || '' : '(paragraaf bestaat niet)',
        niveauId
      });
    }
  }

  const doelParagrafen = [...eigen.map((p) => p.id), ...lesstof.map((p) => p.id)];

  // Een expliciete blokselectie die alles al bevat mag weg: dan lopen later
  // toegevoegde blokken vanzelf mee.
  const blokselectieWeg = [];
  for (const [paragraafId, ids] of Object.entries(data.enabledContentBlocks || {})) {
    if (!Array.isArray(ids)) continue;
    const blokken = blokkenPerParagraaf.get(paragraafId) || (await gepubliceerdeBlokken(paragraafId));
    if (blokken.every((blok) => ids.includes(blok.id))) blokselectieWeg.push(paragraafId);
  }

  const leerlingen = await db.collection('users').where('klasId', '==', klas.id).get();
  const overrides = Object.keys(data.studentOverrides || {});

  plannen.push({ ...klas, data, huidigeRoute, doelParagrafen, eigen, overbodig, blokselectieWeg, leerlingen, overrides });

  console.log(`\nKlas ${klas.naam} (${klas.id})`);
  console.log(`  route:            ${huidigeRoute || '(geen)'} -> ${klas.routeNa || '(geen)'}`);
  console.log(`  blijft staan:     ${eigen.length ? eigen.map((p) => p.title).join(', ') : '-'}`);
  console.log(`  komt erbij:       ${lesstof.map((p) => p.code).join(', ')}`);
  overbodig.forEach((p) => console.log(`  gaat eraf:        ${p.id} "${p.title}" (niveau ${p.niveauId || 'onbekend'})`));
  blokselectieWeg.forEach((p) => console.log(`  blokselectie weg: ${p} (bevat alle gepubliceerde blokken)`));
  console.log(`  leerlingen:       ${leerlingen.size}`);
  console.log(`  studentOverrides: ${overrides.length ? overrides.join(', ') : 'geen (iedereen krijgt de klastoewijzing)'}`);
}

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

// 3. Back-up van de klasdocumenten die geraakt worden.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `klassen-voor-binask-eoa-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(plannen.map((p) => ({ id: p.id, naam: p.naam, ...p.data })), null, 2));
console.log(`\nBack-up: ${backupPad}`);

// 4. Schrijven.
for (const plan of plannen) {
  const update = {
    enabledParagrafen: plan.doelParagrafen,
    niveauId: plan.routeNa,
    updatedAt: FieldValue.serverTimestamp(),
    laatsteKlaarzetting: { script: SCRIPT_NAAM, op: new Date().toISOString() }
  };
  plan.blokselectieWeg.forEach((paragraafId) => {
    update[`enabledContentBlocks.${paragraafId}`] = FieldValue.delete();
  });
  await db.collection('klassen').doc(plan.id).update(update);
  console.log(`Geschreven: ${plan.naam}`);
}

// 5. Narekenen met dezelfde regels als de app.
console.log('\nControle: wat ziet elke leerling?');
let fouten = 0;
for (const plan of plannen) {
  const snap = await db.collection('klassen').doc(plan.id).get();
  const klasData = snap.data();
  const route = getKlasNiveauId(klasData);
  console.log(`\n  ${plan.naam} (route: ${route || 'geen'})`);

  for (const leerling of plan.leerlingen.docs) {
    const paragraafIds = getStudentEffectiveParagrafen(klasData, leerling.id);
    const documenten = await Promise.all(paragraafIds.map((id) => db.collection('paragraaf').doc(id).get()));
    const zichtbaar = filterLesstofOpKlasRoute(
      documenten.filter((d) => d.exists).map((d) => ({ id: d.id, ...d.data() })),
      route
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    let blokTotaal = 0;
    for (const paragraaf of zichtbaar) {
      const blokken = blokkenPerParagraaf.get(paragraaf.id) || (await gepubliceerdeBlokken(paragraaf.id));
      blokTotaal += getEffectiveContentBlocks(klasData, leerling.id, paragraaf.id, blokken).length;
    }

    const ontbreekt = lesstof.filter((p) => !zichtbaar.some((z) => z.id === p.id));
    if (ontbreekt.length) fouten += 1;
    const naam = String(leerling.get('displayName') || leerling.id).padEnd(22);
    const codes = zichtbaar.map((p) => p.code).join(', ');
    const staart = ontbreekt.length ? `  ONTBREEKT: ${ontbreekt.map((p) => p.code).join(', ')}` : '';
    console.log(`    ${naam} ${String(zichtbaar.length).padStart(2)} paragrafen (${codes}), ${blokTotaal} lesblokken${staart}`);
  }
}

console.log(fouten === 0 ? '\nKlaar. Alle leerlingen zien de volledige lesstof.' : `\nLET OP: bij ${fouten} leerling(en) ontbreekt lesstof.`);
process.exit(fouten === 0 ? 0 : 1);
