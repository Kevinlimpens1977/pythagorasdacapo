/**
 * Zet een explainervideo in HELIX: MP4, ondertitels (ondertitels.nl.vtt plus
 * elke ondertitels.<taal>.vtt van de taalknop in de bronmap) en poster naar Storage,
 * het media-blok direct vóór de Samenvatting van de gekozen paragraaf, de
 * Samenvatting en alles erna één plek op, plus de leerlingkopie.
 *
 *   node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id>            # dry run
 *   node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> --apply    # uploaden + schrijven
 *
 * Opties:
 *   --bron <map>     standaard exports/video/<hoofdstukId>
 *   --maker <uid>    standaard deze scriptnaam
 *
 * Titel en kijkvraag komen uit video/public/hoofdstukken/<id>/draaiboek.json.
 * Opnieuw draaien overschrijft het blok en schuift niets dubbel op.
 * Een nieuw videoblok telt mee in de voortgang; de dry run waarschuwt daarvoor.
 */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import { bouwExplainerPlan, explainerTitel, ondertitelSporen, verouderdeOndertitels } from './lib/explainerPlaatsing.mjs';
import { PROJECT_ID, STORAGE_BUCKET, cleanForFirestore, megabytes } from './lib/slidedeckPlaatsing.mjs';

const SCRIPT_NAAM = 'scripts/plaats-explainer-video.mjs';
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const optie = (naam, standaard = '') => {
  const i = args.indexOf(naam);
  return i >= 0 && args[i + 1] ? args[i + 1] : standaard;
};

const hoofdstukId = optie('--hoofdstuk');
const paragraafId = optie('--paragraaf');
if (!hoofdstukId || !paragraafId) {
  console.error('Gebruik: node scripts/plaats-explainer-video.mjs --hoofdstuk <id> --paragraaf <id> [--apply]');
  process.exit(1);
}
const bron = path.resolve(optie('--bron', path.join('exports/video', hoofdstukId)));
const maker = optie('--maker', SCRIPT_NAAM);
const draaiboek = JSON.parse(fs.readFileSync(path.resolve('video/public/hoofdstukken', hoofdstukId, 'draaiboek.json'), 'utf8'));
if (draaiboek.doelParagraafId !== paragraafId) {
  console.error(`Let op: het draaiboek noemt ${draaiboek.doelParagraafId} als doelparagraaf, niet ${paragraafId}. Stop.`);
  process.exit(1);
}

// Alle ondertitels.<taal>.vtt in de bronmap: nl verplicht, verder alleen de talen van de taalknop.
let ondertitelKeuze;
try {
  ondertitelKeuze = ondertitelSporen(fs.existsSync(bron) ? fs.readdirSync(bron) : []);
} catch (err) {
  console.error(`${err.message} (bronmap ${bron})`);
  process.exit(1);
}
for (const naam of ondertitelKeuze.overgeslagen) console.log(`Overgeslagen: ${naam} (geen taal van de taalknop).`);

const BESTANDEN = [
  { sleutel: 'video', naam: 'explainer.mp4', type: 'video/mp4' },
  { sleutel: 'poster', naam: 'poster.png', type: 'image/png' },
  ...ondertitelKeuze.sporen.map((spoor) => ({ sleutel: 'ondertitels', taal: spoor.taal, label: spoor.label, naam: spoor.naam, type: 'text/vtt' }))
];
for (const bestand of BESTANDEN) {
  bestand.pad = path.join(bron, bestand.naam);
  if (!fs.existsSync(bestand.pad)) {
    console.error(`Bestand ontbreekt: ${bestand.pad}`);
    process.exit(1);
  }
  const stat = fs.statSync(bestand.pad);
  bestand.grootte = stat.size;
  bestand.mtimeMs = stat.mtimeMs;
  bestand.token = randomUUID();
}
// Een vertaald spoor dat ouder is dan ondertitels.nl.vtt is gemaakt voor een
// eerdere tijdlijn. Alleen een waarschuwing (in de dry run én vóór de writes):
// Kevin beslist of dat klopt of dat maak-ondertitels.mjs opnieuw moet draaien.
const verouderd = verouderdeOndertitels(BESTANDEN.filter((b) => b.taal).map((b) => ({ taal: b.taal, mtimeMs: b.mtimeMs })));
if (verouderd.length) {
  console.log(`\nLet op, ondertitels: ${verouderd.map((taal) => `ondertitels.${taal}.vtt`).join(', ')} ${verouderd.length === 1 ? 'is' : 'zijn'} ouder dan ondertitels.nl.vtt. De timing van die vertaling kan niet meer kloppen met de stem. Draai maak-ondertitels.mjs opnieuw voor je plaatst.\n`);
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');
if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
}
const db = getFirestore();

const paragraafSnap = await db.collection('paragraaf').doc(paragraafId).get();
if (!paragraafSnap.exists) {
  console.error(`Paragraaf ${paragraafId} bestaat niet.`);
  process.exit(1);
}
const paragraaf = { id: paragraafSnap.id, ...paragraafSnap.data() };
const blokken = (await db.collection('contentBlocks').where('paragraafId', '==', paragraafId).get())
  .docs.map((d) => ({ id: d.id, ...d.data() })).filter((b) => b.isArchived !== true);

const ondertitelBestanden = BESTANDEN.filter((b) => b.taal);
const plan = bouwExplainerPlan({
  hoofdstukId,
  paragraaf,
  blokken,
  titel: explainerTitel(draaiboek.titel),
  kijkvraag: draaiboek.kijkvraag,
  tokens: Object.fromEntries(BESTANDEN.filter((b) => !b.taal).map((b) => [b.sleutel, b.token])),
  ondertitels: ondertitelBestanden.map((b) => ({ taal: b.taal, label: b.label, token: b.token })),
  maker
});
// Waar elk bestand in Storage komt: video en poster op hun eigen pad, ondertitels per taal.
const doelPad = (bestand) => (bestand.taal ? plan.paden.ondertitels[bestand.taal] : plan.paden[bestand.sleutel]);
if (plan.fouten.length) {
  console.error(plan.fouten.join('\n'));
  process.exit(1);
}

console.log(`Paragraaf ${paragraaf.code || ''} ${paragraaf.title || paragraaf.titel || ''} (${paragraafId}), ${blokken.length} blokken:`);
for (const b of [...blokken].sort((a, c) => (a.order || 0) - (c.order || 0))) {
  const schuif = plan.verschuivingen.find((v) => v.id === b.id);
  console.log(`  ${String(b.order).padStart(3)}${schuif ? ` -> ${schuif.naar}` : '     '}  ${b.type.padEnd(8)} ${b.title}`);
}
console.log(`Nieuw of bijgewerkt: ${String(plan.blok.order).padStart(3)}  media    ${plan.blok.title}  [${plan.blok.id}]`);
for (const bestand of BESTANDEN) console.log(`Upload ${bestand.naam} (${megabytes(bestand.grootte)}) -> ${doelPad(bestand)}`);
console.log(`Ondertitels in ${ondertitelBestanden.length} ${ondertitelBestanden.length === 1 ? 'taal' : 'talen'}: ${plan.blok.content.ondertitels.map((s) => `${s.taal} (${s.label})`).join(', ')}`);

const klassen = (await db.collection('klassen').where('enabledParagrafen', 'array-contains', paragraafId).get()).docs;
const klasUpdates = [];
for (const klas of klassen) {
  const data = klas.data() || {};
  const selectie = data.enabledContentBlocks?.[paragraafId];
  const eigen = Array.isArray(selectie);
  const klasNaam = data.naam || data.name || klas.id;
  // Een lege eigen selectie betekent bewust: alle blokken verborgen. Daar voegen we niets aan toe.
  if (eigen && selectie.length === 0) {
    console.log(`Klas ${klasNaam}: eigen blokselectie is leeg (alles verborgen); video niet toegevoegd.`);
    continue;
  }
  console.log(`Klas ${klasNaam}: ${eigen ? `eigen blokselectie (${selectie.length}), video ${selectie.includes(plan.blok.id) ? 'staat er al in' : 'wordt toegevoegd'}` : 'ziet alle blokken'}`);
  if (eigen && !selectie.includes(plan.blok.id)) klasUpdates.push(klas.id);
}

// Een media-blok vraagt om een bevestiging en telt mee in de voortgang (READING_BLOCK_TYPES in
// src/lib/studyRouteState.js). Een nieuw blok zet de paragraaf dus terug op "niet af" voor wie
// hem al af had. Kevin moet dat weten vóór zijn ja: daarom staat het in de dry run én vóór de writes.
if (plan.nieuw) {
  console.log('\nLet op, voortgang: het nieuwe videoblok telt mee in de voortgang. Leerlingen die deze paragraaf al af hadden, zien hem weer als niet af tot ze de video bevestigd hebben.');
} else {
  console.log('\nVoortgang: het videoblok staat er al. Opnieuw plaatsen is geen nieuwe stap en zet de paragraaf voor niemand terug op niet af; wie de video al bevestigd had, houdt dat.');
}

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te uploaden en te schrijven.');
  process.exit(0);
}

// Back-up van alles wat verandert, vóór de eerste schrijfactie.
const backupMap = path.resolve('exports/reset-backups');
fs.mkdirSync(backupMap, { recursive: true });
const raakt = [plan.blok.id, ...plan.verschuivingen.map((v) => v.id)];
const backup = { gemaakt: new Date().toISOString(), contentBlocks: {}, publicContentBlocks: {}, klassen: {} };
for (const id of raakt) {
  const prive = await db.collection('contentBlocks').doc(id).get();
  const publiek = await db.collection('publicContentBlocks').doc(id).get();
  if (prive.exists) backup.contentBlocks[id] = prive.data();
  if (publiek.exists) backup.publicContentBlocks[id] = publiek.data();
}
for (const klasId of klasUpdates) {
  backup.klassen[klasId] = (await db.collection('klassen').doc(klasId).get()).data()?.enabledContentBlocks?.[paragraafId] || null;
}
const backupPad = path.join(backupMap, `explainer-${hoofdstukId}-${Date.now()}.json`);
fs.writeFileSync(backupPad, JSON.stringify(backup, null, 2));
console.log(`\nBack-up: ${backupPad}`);

const bucket = getStorage().bucket();
for (const bestand of BESTANDEN) {
  process.stdout.write(`Uploaden ${bestand.naam}... `);
  await bucket.file(doelPad(bestand)).save(fs.readFileSync(bestand.pad), {
    resumable: true,
    contentType: bestand.type,
    metadata: { cacheControl: 'public, max-age=86400', metadata: { firebaseStorageDownloadTokens: bestand.token } }
  });
  console.log('klaar');
}

const batch = db.batch();
batch.set(db.collection('contentBlocks').doc(plan.blok.id), cleanForFirestore({
  ...plan.blok, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
}));
batch.set(db.collection('publicContentBlocks').doc(plan.snapshot.id), cleanForFirestore({
  ...plan.snapshot, updatedAt: FieldValue.serverTimestamp()
}));
for (const schuif of plan.verschuivingen) {
  batch.update(db.collection('contentBlocks').doc(schuif.id), { order: schuif.naar, updatedAt: FieldValue.serverTimestamp() });
  if (backup.publicContentBlocks[schuif.id]) {
    batch.update(db.collection('publicContentBlocks').doc(schuif.id), { order: schuif.naar, updatedAt: FieldValue.serverTimestamp() });
  }
}
for (const klasId of klasUpdates) {
  batch.update(db.collection('klassen').doc(klasId), {
    [`enabledContentBlocks.${paragraafId}`]: FieldValue.arrayUnion(plan.blok.id),
    updatedAt: FieldValue.serverTimestamp()
  });
}

try {
  await batch.commit();
  console.log(`Geschreven: 1 videoblok, 1 leerlingkopie, ${plan.verschuivingen.length} verschuiving(en), ${klasUpdates.length} klasselectie(s).`);
  process.exit(0);
} catch (err) {
  console.error(`\nFout bij schrijven naar Firestore: ${err.message}`);
  console.error(`\nDe bestanden zijn geüpload, maar Firestore-update is mislukt. Het bestaande videoblok kan naar vorige (nu ongeldige) links wijzen.`);
  console.error(`Back-up: ${backupPad}`);
  console.error(`\nHerstel: draai dezelfde opdracht opnieuw met --apply.`);
  process.exit(1);
}
