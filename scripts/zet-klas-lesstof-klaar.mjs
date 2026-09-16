/**
 * Zet de lesstof van een vak klaar voor de klassen die hem moeten zien, en
 * rekent daarna met dezelfde functies als de app na wat elke leerling
 * werkelijk ziet. Dat narekenen is het punt van dit script: een klas kan een
 * paragraaf toegewezen krijgen en hem tóch niet zien, omdat haar leerroute
 * alleen lesstof van één niveau doorlaat.
 *
 *   node scripts/zet-klas-lesstof-klaar.mjs --vak binask
 *   node scripts/zet-klas-lesstof-klaar.mjs --vak binask --apply
 *   node scripts/zet-klas-lesstof-klaar.mjs --vak dv --apply
 *
 * Per klas gebeurt er dit:
 *   1. alle gepubliceerde paragrafen van haar lesstofniveaus toewijzen;
 *   2. paragrafen van haar eigen route die al toegewezen waren laten staan;
 *   3. toewijzingen die bij geen van beide horen weghalen;
 *   4. de route zetten zoals in de tabel hieronder;
 *   5. een expliciete blokselectie opruimen wanneer die alle gepubliceerde
 *      blokken al bevat, zodat later toegevoegde blokken vanzelf meelopen.
 *
 * Vóór het schrijven gaat er een back-up van de klasdocumenten naar
 * exports/reset-backups/.
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
const SCRIPT_NAAM = 'scripts/zet-klas-lesstof-klaar.mjs';

// Per klas:
//   routeNa        de leerroute die de klas na afloop heeft. Leeg betekent geen
//                  route: dan ziet de klas alles wat aan haar is toegewezen,
//                  ongeacht onder welk niveau dat hangt.
//   eigenNiveau    de route waar de klas oorspronkelijk onder viel. Beschermt
//                  paragrafen met voortgang erin tegen opruimen zodra de route
//                  eraf is.
//   lesstofNiveaus de niveaus waarvan deze klas de gepubliceerde paragrafen
//                  krijgt. Meestal één; meerdere mag.
//   uitsluiten     paragrafen die deze klas niet moet krijgen, ook al horen ze
//                  bij haar niveau.
const VAKKEN = {
  binask: {
    omschrijving: 'Binask voor de twee EOA-klassen',
    backupNaam: 'binask-eoa',
    klassen: [
      {
        id: 'klas_1787768387441_7',
        naam: 'ER3L1A',
        routeNa: 'niveau-binask-eoa-1-lr3',
        eigenNiveau: 'niveau-binask-eoa-1-lr3',
        lesstofNiveaus: ['niveau-binask-eoa-1-lr3']
      },
      {
        // ER3L2A staat bewust zonder route, zodat zij dezelfde lesstof van
        // leerjaar 1 ziet. eigenNiveau houdt "Ga van start..." overeind, de
        // paragraaf van haar oorspronkelijke route met voortgang erin.
        id: 'klas_1787768387528_8',
        naam: 'ER3L2A',
        routeNa: '',
        eigenNiveau: 'niveau-binask-eoa-2-lr3',
        lesstofNiveaus: ['niveau-binask-eoa-1-lr3']
      }
    ]
  },

  dv: {
    omschrijving: 'Digitale vaardigheden voor de H1-klassen: alleen de routes eraf',
    backupNaam: 'dv-h1',
    // Kevin bouwt Digitale vaardigheden opnieuw op met één gedeelde versie.
    // Daarvoor moeten de leerroutes eraf: een klas met een route ziet alleen
    // lesstof van dat ene niveau, dus een gedeeld hoofdstuk zou onzichtbaar
    // blijven.
    //
    // De toewijzingen blijven staan zoals ze zijn (lesstofNiveaus leeg). Elke
    // klas houdt dus haar eigen nulmeting, met de resultaten die de leerlingen
    // daarop hebben staan. Er komt op dit moment niets bij: wat de leerling
    // ziet verandert niet.
    klassen: [
      { id: 'klas_1787767044660', naam: 'H1B1', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-bb', lesstofNiveaus: [] },
      { id: 'klas_1787767053890', naam: 'H1B2', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-bb', lesstofNiveaus: [] },
      { id: 'klas_1787768386819_0', naam: 'H1K1', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-kb', lesstofNiveaus: [] },
      { id: 'klas_1787768386908_1', naam: 'H1K2', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-kb', lesstofNiveaus: [] },
      { id: 'klas_1787768387011_2', naam: 'H1K3', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-kb', lesstofNiveaus: [] },
      { id: 'klas_1787768387188_4', naam: 'H1TL1', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-tl', lesstofNiveaus: [] },
      { id: 'klas_1787768387289_5', naam: 'H1TL2', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-tl', lesstofNiveaus: [] },
      { id: 'klas_1787768387366_6', naam: 'H1TL3', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-tl', lesstofNiveaus: [] },
      { id: 'klas_1787768387105_3', naam: 'H1i1', routeNa: '', eigenNiveau: 'niveau-dv-vmbo1-bb', lesstofNiveaus: [] }
    ]
  }
};

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const vakSleutel = (() => {
  const index = argumenten.indexOf('--vak');
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : '';
})();

const vak = VAKKEN[vakSleutel];
if (!vak) {
  console.error(`Kies een vak: --vak ${Object.keys(VAKKEN).join(' | --vak ')}`);
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const isActiefBlok = (blok) =>
  blok.isArchived !== true && (blok.status === 'published' || blok.status === undefined);

const blokkenPerParagraaf = new Map();
const gepubliceerdeBlokken = async (paragraafId) => {
  if (blokkenPerParagraaf.has(paragraafId)) return blokkenPerParagraaf.get(paragraafId);
  const snap = await db.collection('contentBlocks').where('paragraafId', '==', paragraafId).get();
  const blokken = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(isActiefBlok)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  blokkenPerParagraaf.set(paragraafId, blokken);
  return blokken;
};

const paragrafenVanNiveau = new Map();
const lesstofVanNiveau = async (niveauId) => {
  if (paragrafenVanNiveau.has(niveauId)) return paragrafenVanNiveau.get(niveauId);
  const snap = await db.collection('paragraaf').where('niveauId', '==', niveauId).get();
  const paragrafen = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.isArchived !== true && p.published !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  paragrafenVanNiveau.set(niveauId, paragrafen);
  return paragrafen;
};

console.log(`${vak.omschrijving} klaarzetten (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// 1. Per klas het plan opstellen.
const plannen = [];
for (const klas of vak.klassen) {
  const snap = await db.collection('klassen').doc(klas.id).get();
  if (!snap.exists) {
    console.error(`Klas ${klas.naam} (${klas.id}) bestaat niet.`);
    process.exit(1);
  }
  const data = snap.data();
  const huidigeRoute = getKlasNiveauId(data);
  const huidig = Array.isArray(data.enabledParagrafen) ? data.enabledParagrafen : [];
  const uitsluiten = new Set(klas.uitsluiten || []);

  // Een lege lijst lesstofNiveaus betekent: alleen de route bijwerken en de
  // toewijzing laten staan zoals hij is. Handig bij een opruiming waarbij de
  // leerling niets nieuws hoort te zien.
  const alleenRoute = klas.lesstofNiveaus.length === 0;

  const lesstof = [];
  for (const niveauId of klas.lesstofNiveaus) {
    for (const paragraaf of await lesstofVanNiveau(niveauId)) {
      if (!uitsluiten.has(paragraaf.id)) lesstof.push(paragraaf);
    }
  }
  if (!alleenRoute && lesstof.length === 0) {
    console.error(`Geen gepubliceerde paragrafen gevonden voor ${klas.naam} (${klas.lesstofNiveaus.join(', ')}).`);
    process.exit(1);
  }
  for (const paragraaf of lesstof) await gepubliceerdeBlokken(paragraaf.id);

  // Paragrafen van de eigen route die al toegewezen waren blijven staan.
  const eigenNiveau = klas.eigenNiveau || huidigeRoute;
  const eigen = [];
  const overbodig = [];
  for (const paragraafId of alleenRoute ? [] : huidig) {
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

  const doelParagrafen = alleenRoute ? [...huidig] : [...eigen.map((p) => p.id), ...lesstof.map((p) => p.id)];

  // Een expliciete blokselectie die alles al bevat mag weg: dan lopen later
  // toegevoegde blokken vanzelf mee.
  const blokselectieWeg = [];
  for (const [paragraafId, ids] of Object.entries(data.enabledContentBlocks || {})) {
    if (!Array.isArray(ids)) continue;
    const blokken = await gepubliceerdeBlokken(paragraafId);
    if (blokken.every((blok) => ids.includes(blok.id))) blokselectieWeg.push(paragraafId);
  }

  const leerlingen = await db.collection('users').where('klasId', '==', klas.id).get();
  const overrides = Object.keys(data.studentOverrides || {});

  plannen.push({ ...klas, data, huidigeRoute, lesstof, doelParagrafen, eigen, overbodig, blokselectieWeg, leerlingen, overrides });

  console.log(`Klas ${klas.naam} (${klas.id})`);
  console.log(`  route:            ${huidigeRoute || '(geen)'} -> ${klas.routeNa || '(geen)'}`);
  if (alleenRoute) {
    const titels = await Promise.all(
      doelParagrafen.map(async (id) => {
        const doc = await db.collection('paragraaf').doc(id).get();
        return doc.exists ? `${doc.get('code')} "${doc.get('title')}"` : `${id} (bestaat niet)`;
      })
    );
    console.log(`  toewijzing:       ongewijzigd (${titels.join(', ') || 'niets'})`);
  } else {
    console.log(`  blijft staan:     ${eigen.length ? eigen.map((p) => p.title).join(', ') : '-'}`);
    console.log(`  komt erbij:       ${lesstof.map((p) => p.code).join(', ')}`);
  }
  overbodig.forEach((p) => console.log(`  gaat eraf:        ${p.id} "${p.title}" (niveau ${p.niveauId || 'onbekend'})`));
  blokselectieWeg.forEach((p) => console.log(`  blokselectie weg: ${p} (bevat alle gepubliceerde blokken)`));
  console.log(`  leerlingen:       ${leerlingen.size}`);
  console.log(`  studentOverrides: ${overrides.length ? overrides.join(', ') : 'geen (iedereen krijgt de klastoewijzing)'}`);
  console.log('');
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

// 2. Back-up van de klasdocumenten die geraakt worden.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `klassen-voor-${vak.backupNaam}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(plannen.map((p) => ({ id: p.id, naam: p.naam, ...p.data })), null, 2));
console.log(`Back-up: ${backupPad}`);

// 3. Schrijven.
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

// 4. Narekenen met dezelfde regels als de app.
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
      const blokken = await gepubliceerdeBlokken(paragraaf.id);
      blokTotaal += getEffectiveContentBlocks(klasData, leerling.id, paragraaf.id, blokken).length;
    }

    const ontbreekt = plan.lesstof.filter((p) => !zichtbaar.some((z) => z.id === p.id));
    if (ontbreekt.length) fouten += 1;
    const naam = String(leerling.get('displayName') || leerling.id).padEnd(22);
    const codes = zichtbaar.map((p) => p.code).join(', ');
    const staart = ontbreekt.length ? `  ONTBREEKT: ${ontbreekt.map((p) => p.code).join(', ')}` : '';
    console.log(`    ${naam} ${String(zichtbaar.length).padStart(2)} paragrafen (${codes}), ${blokTotaal} lesblokken${staart}`);
  }
}

console.log(fouten === 0 ? '\nKlaar. Alle leerlingen zien de volledige lesstof.' : `\nLET OP: bij ${fouten} leerling(en) ontbreekt lesstof.`);
process.exit(fouten === 0 ? 0 : 1);
