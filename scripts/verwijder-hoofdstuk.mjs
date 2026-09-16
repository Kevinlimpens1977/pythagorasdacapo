/**
 * Haalt één hoofdstuk uit de bibliotheek: het hoofdstuk zelf, zijn paragrafen,
 * hun lesblokken, de publieke snapshots daarvan en de badge die eraan hangt.
 *
 * Bedoeld voor een hoofdstuk dat je opnieuw gaat bouwen. Verwijderen kan niet
 * ongedaan gemaakt worden met één knop, dus het script weigert zodra er iets
 * aan vastzit dat je kwijt zou raken:
 *
 *   - voortgang van leerlingen op een van de paragrafen;
 *   - een klas die een van de paragrafen toegewezen heeft.
 *
 * Allebei zijn het tekenen dat leerlingen ermee gewerkt hebben of ermee gaan
 * werken. Los dat eerst op (voortgang bewaren, toewijzing weghalen) en draai
 * het script daarna opnieuw.
 *
 * Vóór het verwijderen gaat alles wat weggaat als JSON naar
 * exports/reset-backups/, zodat terugzetten neerkomt op opnieuw importeren.
 *
 *   node scripts/verwijder-hoofdstuk.mjs --hoofdstuk hoofdstuk-dv-kb-h2
 *   node scripts/verwijder-hoofdstuk.mjs --hoofdstuk hoofdstuk-dv-kb-h2 --apply
 *
 * Meerdere hoofdstukken in één keer mag ook, gescheiden door komma's.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const optie = (naam, standaard = '') => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};

const hoofdstukIds = optie('--hoofdstuk').split(',').map((id) => id.trim()).filter(Boolean);
if (hoofdstukIds.length === 0) {
  console.error('Geef op welk hoofdstuk weg mag: --hoofdstuk <id>[,<id>]');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

console.log(`Hoofdstuk verwijderen (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}\n`);

const teVerwijderen = { hoofdstuk: [], paragraaf: [], contentBlocks: [], publicContentBlocks: [], badges: [] };
const blokkades = [];

for (const hoofdstukId of hoofdstukIds) {
  const hoofdstuk = await db.collection('hoofdstuk').doc(hoofdstukId).get();
  if (!hoofdstuk.exists) {
    blokkades.push(`${hoofdstukId}: bestaat niet`);
    continue;
  }
  teVerwijderen.hoofdstuk.push(hoofdstuk);

  const paragrafen = await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get();
  console.log(`${hoofdstukId} "${hoofdstuk.get('title')}" (nr ${hoofdstuk.get('number') ?? '-'}, niveau ${hoofdstuk.get('niveauId') || '-'})`);
  console.log(`  paragrafen: ${paragrafen.size}`);

  let blokkenTotaal = 0;
  let snapshotsTotaal = 0;
  let voortgangTotaal = 0;

  for (const paragraaf of paragrafen.docs) {
    teVerwijderen.paragraaf.push(paragraaf);

    const blokken = await db.collection('contentBlocks').where('paragraafId', '==', paragraaf.id).get();
    blokkenTotaal += blokken.size;
    for (const blok of blokken.docs) {
      teVerwijderen.contentBlocks.push(blok);
      const snapshot = await db.collection('publicContentBlocks').doc(blok.id).get();
      if (snapshot.exists) {
        teVerwijderen.publicContentBlocks.push(snapshot);
        snapshotsTotaal += 1;
      }
    }

    // Voortgang is leerlingwerk. Weegt zwaarder dan welke opruiming ook.
    const voortgang = await db.collection('voortgang').where('paragraafId', '==', paragraaf.id).get();
    voortgangTotaal += voortgang.size;
    if (voortgang.size > 0) {
      const leerlingen = new Set(voortgang.docs.map((d) => d.get('userId') || d.id.split('_')[0]));
      blokkades.push(
        `${paragraaf.id} "${paragraaf.get('title')}" heeft ${voortgang.size} voortgangsrecord(s) van ${leerlingen.size} leerling(en)`
      );
    }
  }

  console.log(`  lesblokken: ${blokkenTotaal}, publieke snapshots: ${snapshotsTotaal}, voortgang: ${voortgangTotaal}`);
}

// Een klas die het hoofdstuk toegewezen heeft ziet na het verwijderen een gat.
const paragraafIds = new Set(teVerwijderen.paragraaf.map((d) => d.id));
const klassen = await db.collection('klassen').get();
for (const klas of klassen.docs) {
  const raak = (klas.get('enabledParagrafen') || []).filter((id) => paragraafIds.has(id));
  if (raak.length) {
    blokkades.push(`klas ${klas.get('name')} (${klas.id}) heeft nog ${raak.length} paragra(a)f(en) hiervan toegewezen: ${raak.join(', ')}`);
  }
}

// De badge van een hoofdstuk heeft zonder dat hoofdstuk geen betekenis meer.
const badges = await db.collection('badges').get();
for (const badge of badges.docs) {
  if (hoofdstukIds.includes(badge.get('hoofdstukId') || '')) teVerwijderen.badges.push(badge);
}

console.log('');
console.log('Wordt verwijderd:');
for (const [collectie, documenten] of Object.entries(teVerwijderen)) {
  if (documenten.length) console.log(`  ${collectie}: ${documenten.length}`);
}

if (blokkades.length) {
  console.error(`\nEr wordt niets verwijderd; ${blokkades.length} blokkade(s):`);
  blokkades.forEach((regel) => console.error(`- ${regel}`));
  process.exit(1);
}

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te verwijderen.');
  process.exit(0);
}

// Back-up van alles wat weggaat, met data en al.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `verwijderd-${hoofdstukIds.join('-')}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(
  backupPad,
  JSON.stringify(
    Object.fromEntries(
      Object.entries(teVerwijderen).map(([collectie, documenten]) => [
        collectie,
        documenten.map((d) => ({ id: d.id, ...d.data() }))
      ])
    ),
    null,
    2
  )
);
console.log(`\nBack-up: ${backupPad}`);

const collectieVan = {
  hoofdstuk: 'hoofdstuk',
  paragraaf: 'paragraaf',
  contentBlocks: 'contentBlocks',
  publicContentBlocks: 'publicContentBlocks',
  badges: 'badges'
};

let verwijderd = 0;
// Van klein naar groot: eerst de blokken, dan de paragrafen, dan het hoofdstuk.
// Zo staat er nooit een paragraaf zonder hoofdstuk in beeld als het halverwege
// misgaat.
for (const collectie of ['publicContentBlocks', 'contentBlocks', 'paragraaf', 'badges', 'hoofdstuk']) {
  const documenten = teVerwijderen[collectie];
  let batch = db.batch();
  let aantal = 0;
  for (const document of documenten) {
    batch.delete(db.collection(collectieVan[collectie]).doc(document.id));
    aantal += 1;
    if (aantal === 450) {
      await batch.commit();
      batch = db.batch();
      aantal = 0;
    }
  }
  if (aantal > 0) await batch.commit();
  if (documenten.length) {
    console.log(`Verwijderd uit ${collectie}: ${documenten.length}`);
    verwijderd += documenten.length;
  }
}

console.log(`\nKlaar. ${verwijderd} documenten verwijderd.`);
process.exit(0);
