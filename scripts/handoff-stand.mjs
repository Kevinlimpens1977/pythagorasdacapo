/**
 * Toont de stand van het project: wat er in git staat, wat er live staat en wat
 * er in Firestore en Storage staat. Leest alleen, schrijft nooit.
 *
 * Bedoeld als eerste commando van een nieuwe sessie, in Claude Code of Codex.
 * docs/HANDOFF.md beschrijft wat blijvend waar is: de afspraken, de pijplijn en
 * de valkuilen. Dit script vertelt wat er vandaag werkelijk staat. Een document
 * veroudert stilletjes; dit niet.
 *
 * Gebruik:
 *
 *   node scripts/handoff-stand.mjs            # alles
 *   node scripts/handoff-stand.mjs --kort     # alleen git en de live site
 *
 * De Firestore-delen hebben Application Default Credentials nodig. Werkt dat
 * niet, dan meldt het script dat en gaat het door met de rest.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const kort = process.argv.includes('--kort');

// Mappen die nooit in git horen; die filteren we uit de lijst met losse wijzigingen.
const NOOIT_STAGEN = /^(exports|badges|sources|\.firebase|\.superpowers|\.tmp)/;

const kop = (tekst) => {
  console.log('');
  console.log(tekst);
  console.log('-'.repeat(tekst.length));
};

const sh = (commando) => {
  try {
    return execSync(commando, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
};

/* ---------- git ---------- */

kop('Git');
const tak = sh('git rev-parse --abbrev-ref HEAD');
console.log(`tak:            ${tak}`);
console.log(`laatste commit: ${sh('git log --oneline -1')}`);
sh('git fetch --quiet origin');
const voorAchter = sh(`git rev-list --left-right --count origin/${tak}...HEAD`);
if (voorAchter) {
  const [achter, voor] = voorAchter.split(/\s+/);
  console.log(`t.o.v. origin:  ${voor} commit(s) voor, ${achter} achter${voor === '0' && achter === '0' ? ' (gelijk)' : ''}`);
}

const losseRegels = sh('git status --porcelain')
  .split('\n')
  .filter(Boolean)
  .map((regel) => ({ status: regel.slice(0, 2).trim(), pad: regel.slice(2).trim().replace(/^"|"$/g, '') }));
const relevant = losseRegels.filter((item) => !NOOIT_STAGEN.test(item.pad));
const genegeerd = losseRegels.length - relevant.length;

if (relevant.length === 0) {
  console.log('werkmap:        schoon (afgezien van rommel die nooit gestaged wordt)');
} else {
  console.log(`werkmap:        ${relevant.length} wijziging(en) die in git horen:`);
  relevant.forEach((item) => console.log(`                  ${item.status.padEnd(2)} ${item.pad}`));
}
console.log(`                (${genegeerd} pad(en) genegeerd: exports, sources, badges, .firebase, .tmp*)`);

/* ---------- live site ---------- */

kop('Live site');
try {
  const html = await fetch('https://dvdacapo.vercel.app/').then((r) => r.text());
  const bundel = (html.match(/assets\/index-[A-Za-z0-9_-]+\.js/) || [])[0] || '(niet gevonden)';
  console.log(`dvdacapo.vercel.app draait op: ${bundel}`);
  // Vercel bouwt zelf, dus de naam van de live bundel is nooit die van een
  // lokale build. Vergelijk daarom de inhoud, niet de bestandsnaam: zoek een
  // stukje tekst dat je net hebt gewijzigd (grep in de bundel) als je wilt
  // weten of jouw wijziging er echt in zit.
  console.log('                              (Vercel bouwt zelf; de bundelnaam hoort niet bij een lokale build)');
} catch (fout) {
  console.log(`kon de live site niet bereiken: ${fout.message}`);
}

/* ---------- buiten de repo ---------- */

kop('Buiten de repo');
const skillMap = path.join(os.homedir(), '.claude', 'skills', 'helix-hoofdstuk-bouwen');
console.log(`skill helix-hoofdstuk-bouwen: ${fs.existsSync(skillMap) ? `aanwezig (${skillMap})` : 'NIET aanwezig; zie docs/HANDOFF.md'}`);
console.log('Firestore, Storage en de bucketinstelling staan per definitie buiten git. Zie hieronder.');

if (kort) {
  console.log('');
  console.log('(--kort: Firestore en Storage overgeslagen)');
  process.exit(0);
}

/* ---------- Firestore en Storage ---------- */

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
let db;
let bucket;
try {
  const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
  const { getFirestore } = requireFromFunctions('firebase-admin/firestore');
  const { getStorage } = requireFromFunctions('firebase-admin/storage');
  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault(),
      projectId: 'pythagoras-eoa',
      storageBucket: 'pythagoras-eoa.firebasestorage.app'
    });
  }
  db = getFirestore();
  bucket = getStorage().bucket();
} catch (fout) {
  console.log('');
  console.log(`Geen verbinding met Firebase (${fout.message}). Log in met Application Default Credentials en draai opnieuw.`);
  process.exit(0);
}

const [vakken, hoofdstukken, paragrafen, blokken, publiek, klassen] = await Promise.all([
  db.collection('vak').get(),
  db.collection('hoofdstuk').get(),
  db.collection('paragraaf').get(),
  db.collection('contentBlocks').get(),
  db.collection('publicContentBlocks').get(),
  db.collection('klassen').get()
]);

kop('Lesstof in Firestore');
for (const vak of vakken.docs) {
  const eigenHoofdstukken = hoofdstukken.docs.filter((d) => d.get('vakId') === vak.id);
  if (eigenHoofdstukken.length === 0) continue;
  const eigenParagrafen = paragrafen.docs.filter((d) => d.get('vakId') === vak.id);
  const eigenBlokken = blokken.docs.filter((d) => d.get('vakId') === vak.id);
  console.log(`${vak.get('name') || vak.id} (${vak.id}): ${eigenHoofdstukken.length} hoofdstuk(ken), ${eigenParagrafen.length} paragrafen, ${eigenBlokken.length} lesblokken`);
  eigenHoofdstukken
    .sort((a, b) => (a.get('number') ?? 99) - (b.get('number') ?? 99))
    .forEach((h) => {
      const aantal = paragrafen.docs.filter((p) => p.get('hoofdstukId') === h.id).length;
      console.log(`   nr ${String(h.get('number') ?? '-').padEnd(2)} ${h.id.padEnd(34)} ${aantal} paragrafen  "${h.get('title')}"`);
    });
}

kop('Klassen');
const paragraafIds = new Set(paragrafen.docs.map((d) => d.id));
const leerlingen = await db.collection('users').where('role', '==', 'student').get();
for (const klas of klassen.docs.sort((a, b) => String(a.get('name')).localeCompare(String(b.get('name'))))) {
  const toegewezen = klas.get('enabledParagrafen') || [];
  const kapot = toegewezen.filter((id) => !paragraafIds.has(id));
  const aantalLeerlingen = leerlingen.docs.filter((d) => d.get('klasId') === klas.id).length;
  console.log(
    `${String(klas.get('name')).padEnd(8)} ${klas.id.padEnd(24)} route: ${(klas.get('niveauId') || '(geen)').padEnd(26)} ` +
    `${String(toegewezen.length).padStart(2)} paragra(a)f(en), ${String(aantalLeerlingen).padStart(3)} leerling(en)` +
    `${kapot.length ? `  LET OP: ${kapot.length} verwijzing(en) naar een verdwenen paragraaf` : ''}`
  );
}

kop('Voortgang en samenhang');
// Voortgangsdocumenten hebben GEEN vakId; tellen gaat per paragraafId.
const voortgang = await db.collection('voortgang').get();
const perVak = new Map();
const paragraafVak = new Map(paragrafen.docs.map((d) => [d.id, d.get('vakId') || 'onbekend']));
voortgang.docs.forEach((d) => {
  const vakId = paragraafVak.get(d.get('paragraafId')) || 'onbekend';
  perVak.set(vakId, (perVak.get(vakId) || 0) + 1);
});
console.log(`voortgangsrecords: ${voortgang.size} totaal`);
[...perVak.entries()].sort((a, b) => b[1] - a[1]).forEach(([vakId, aantal]) => console.log(`   ${String(aantal).padStart(4)} ${vakId}`));

const hoofdstukIds = new Set(hoofdstukken.docs.map((d) => d.id));
const blokIds = new Set(blokken.docs.map((d) => d.id));
const weesParagrafen = paragrafen.docs.filter((d) => d.get('hoofdstukId') && !hoofdstukIds.has(d.get('hoofdstukId')));
const weesBlokken = blokken.docs.filter((d) => d.get('paragraafId') && !paragraafIds.has(d.get('paragraafId')));
const weesSnapshots = publiek.docs.filter((d) => !blokIds.has(d.id));
const zonderSnapshot = blokken.docs.filter((d) => d.get('status') === 'published' && !publiek.docs.some((p) => p.id === d.id));
console.log(`wezen: ${weesParagrafen.length} paragraaf zonder hoofdstuk, ${weesBlokken.length} lesblok zonder paragraaf, ${weesSnapshots.length} snapshot zonder lesblok`);
console.log(`gepubliceerde lesblokken zonder publieke snapshot: ${zonderSnapshot.length}${zonderSnapshot.length ? ` (${zonderSnapshot.slice(0, 3).map((d) => d.id).join(', ')}...)` : ''}`);

kop('Storage');
try {
  const [metadata] = await bucket.getMetadata();
  const origins = (metadata.cors || []).flatMap((regel) => regel.origin || []);
  const liveErin = origins.includes('https://dvdacapo.vercel.app');
  console.log(`CORS-origins: ${origins.join(', ') || '(geen)'}`);
  console.log(`   ${liveErin ? 'de live site staat erin; presentaties laden als dia\'s' : 'LET OP: de live site ontbreekt; elke presentatie valt terug op de trage iframe (scripts/zet-storage-cors.mjs)'}`);
} catch (fout) {
  console.log(`kon de bucketinstelling niet lezen: ${fout.message}`);
}
const pakketten = await db.collection('slidedeckPackages').get();
const zonderTelling = pakketten.docs.filter((d) => !(Number(d.get('generatedDeckPdf.pageCount')) > 0));
console.log(`slidedeckpakketten: ${pakketten.size}, zonder diatelling: ${zonderTelling.length}${zonderTelling.length ? ' (scripts/vul-slidedeck-paginatellingen.mjs)' : ''}`);

console.log('');
console.log('Klaar. Wat hiervan afwijkt van docs/HANDOFF.md: het document bijwerken, niet de stand.');
process.exit(0);
