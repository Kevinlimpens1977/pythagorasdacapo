/**
 * Leest één hoofdstuk terug uit Firestore en vergelijkt het met het
 * bronbestand waaruit het gebouwd is. Puur lezen; dit script schrijft niets.
 *
 * Bedoeld als laatste stap nadat een hoofdstuk is geplaatst: het beantwoordt
 * de vraag "ziet de leerling straks echt wat ik bedoelde?" met een lijst
 * regels die je kunt nalopen, in plaats van met een gevoel.
 *
 *   node scripts/controleer-hoofdstuk.mjs --bron docs/seeds/<bestand>.json
 *   node scripts/controleer-hoofdstuk.mjs --bron <bestand> --klassen ER3L1A,ER3L2A
 *
 * Eindigt met code 1 als er iets niet klopt, zodat je het niet over het hoofd
 * kunt zien.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';

const PROJECT_ID = 'pythagoras-eoa';
const STORAGE_BUCKET = 'pythagoras-eoa.firebasestorage.app';

const argumenten = process.argv.slice(2);
const optie = (naam, standaard = '') => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};

const bronPad = optie('--bron');
if (!bronPad) {
  console.error('Geef het bronbestand op: --bron docs/seeds/<bestand>.json');
  process.exit(1);
}

const bron = JSON.parse(fs.readFileSync(path.resolve(bronPad), 'utf8'));
const meta = bron.meta || {};
const hoofdstukId = bron.hoofdstuk.id || `hoofdstuk-${meta.blokPrefix}-h${bron.hoofdstuk.nummer}`;
const klasNamen = optie('--klassen').split(',').map((naam) => naam.trim()).filter(Boolean);

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
}

const db = getFirestore();
const bucket = getStorage().bucket();

const fouten = [];
const meld = (goed, tekst) => {
  console.log(`${goed ? 'OK  ' : 'FOUT'} ${tekst}`);
  if (!goed) fouten.push(tekst);
};

/* 1. Het hoofdstuk zelf */

const hoofdstukSnap = await db.collection('hoofdstuk').doc(hoofdstukId).get();
meld(hoofdstukSnap.exists, `hoofdstuk ${hoofdstukId} bestaat`);
if (!hoofdstukSnap.exists) {
  console.error('\nZonder hoofdstuk valt er niets te controleren. Draai eerst de seed-import.');
  process.exit(1);
}
meld(hoofdstukSnap.get('number') === bron.hoofdstuk.nummer, `hoofdstuknummer is ${hoofdstukSnap.get('number')} (bron: ${bron.hoofdstuk.nummer})`);
meld(hoofdstukSnap.get('published') === true, 'hoofdstuk is gepubliceerd');

// Twee hoofdstukken met hetzelfde nummer binnen één leerroute laten de
// leerling twee keer "Hoofdstuk 3" zien.
const zelfdeNummer = (await db.collection('hoofdstuk').where('vakId', '==', meta.vakId).get()).docs
  .filter((doc) => doc.get('niveauId') === meta.niveauId && doc.get('number') === bron.hoofdstuk.nummer);
meld(zelfdeNummer.length === 1, `precies één hoofdstuk ${bron.hoofdstuk.nummer} in deze leerroute (${zelfdeNummer.map((doc) => doc.id).join(', ')})`);

/* 2. Paragrafen en blokken */

const paragraafId = (paragraaf) => paragraaf.id || `paragraaf-${meta.blokPrefix}-${String(paragraaf.code).replace(/\./g, '')}`;
const liveParagrafen = (await db.collection('paragraaf').where('hoofdstukId', '==', hoofdstukId).get()).docs
  .sort((a, b) => (a.get('order') || 0) - (b.get('order') || 0));

meld(
  liveParagrafen.map((doc) => doc.get('code')).join(',') === bron.paragrafen.map((p) => p.code).join(','),
  `paragrafen in de goede volgorde: ${liveParagrafen.map((doc) => `${doc.get('order')}:${doc.get('code')}`).join(' ')}`
);

const alleHtml = [];
let totaalBlokken = 0;

for (const paragraaf of bron.paragrafen) {
  const id = paragraafId(paragraaf);
  const live = liveParagrafen.find((doc) => doc.id === id);
  if (!live) {
    meld(false, `paragraaf ${paragraaf.code} (${id}) ontbreekt in Firestore`);
    continue;
  }
  meld(live.get('published') === true && live.get('isArchived') === false, `${paragraaf.code} is gepubliceerd en niet gearchiveerd`);

  const blokken = (await db.collection('contentBlocks').where('paragraafId', '==', id).get()).docs
    .sort((a, b) => (a.get('order') || 0) - (b.get('order') || 0));
  totaalBlokken += blokken.length;

  const verwacht = (paragraaf.blokken || []).length + (paragraaf.slidedeck ? 1 : 0);
  const types = blokken.map((doc) => doc.get('type'));
  meld(blokken.length === verwacht, `${paragraaf.code}: ${blokken.length} blokken (bron: ${verwacht}) - ${types.join(', ')}`);
  meld(
    blokken.map((doc) => doc.get('order')).join(',') === blokken.map((_, index) => String(index + 1)).join(','),
    `${paragraaf.code}: volgnummers lopen van 1 tot ${blokken.length} zonder gat`
  );

  const deck = blokken.find((doc) => doc.get('type') === 'slidedeck');
  if (paragraaf.slidedeck) {
    meld(Boolean(deck) && deck.get('order') === 1, `${paragraaf.code}: de presentatie staat vooraan`);
    if (deck) {
      const pakketId = deck.get('content.slidedeckPackageId');
      const pakket = pakketId ? (await db.collection('slidedeckPackages').doc(pakketId).get()).data() : null;
      meld(
        pakket?.reviewStatus === 'approved' && pakket?.status === 'deckUploaded',
        `${paragraaf.code}: pakket ${pakketId || '(geen)'} is goedgekeurd en heeft een deck`
      );

      const storagePad = deck.get('content.generatedDeckStoragePath') || '';
      let bestandMeta = null;
      try {
        [bestandMeta] = await bucket.file(storagePad).getMetadata();
      } catch {
        bestandMeta = null;
      }
      const token = bestandMeta?.metadata?.firebaseStorageDownloadTokens || '';
      const link = deck.get('content.generatedDeckUrl') || '';
      const grootte = bestandMeta ? Number(bestandMeta.size) : 0;
      meld(
        Boolean(bestandMeta) && token && link.includes(token),
        `${paragraaf.code}: PDF staat in Storage (${(grootte / 1e6).toFixed(1)} MB) en de downloadlink klopt`
      );
      // Boven ongeveer 8 MB wacht een leerling op schoolwifi merkbaar lang.
      meld(grootte > 0 && grootte < 8e6, `${paragraaf.code}: de PDF is klein genoeg om vlot te laden`);
      meld(
        Number(pakket?.generatedDeckPdf?.pageCount || 0) > 0,
        `${paragraaf.code}: het aantal dia's staat vast (${pakket?.generatedDeckPdf?.pageCount || 0}), zodat de teller klopt`
      );
    }
  } else {
    meld(!deck, `${paragraaf.code}: geen presentatie, zoals de bron aangeeft`);
  }

  for (const blok of blokken) {
    const data = { id: blok.id, ...blok.data() };
    const readiness = validateContentBlockReadiness(data);
    if (readiness.errors.length) {
      fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
    }
    if (data.status !== 'published') fouten.push(`${blok.id}: status is "${data.status}"`);

    // Zonder publieke snapshot ziet de leerling het blok niet, ook al staat het er.
    const snapshot = await db.collection('publicContentBlocks').doc(blok.id).get();
    if (!snapshot.exists) fouten.push(`${blok.id}: geen publieke snapshot; de leerling ziet dit blok niet`);
    else if (snapshot.get('content.html') !== (data.content?.html || '')) {
      fouten.push(`${blok.id}: de snapshot loopt achter op het blok`);
    }

    alleHtml.push(data.content?.html || '');
  }
  meld(true, `${paragraaf.code}: ${blokken.length} blokken gecontroleerd op leesbaarheid en snapshot`);
}

meld(totaalBlokken > 0, `${totaalBlokken} blokken in dit hoofdstuk`);

/* 3. De inhoud zelf */

const tekst = alleHtml.join('\n');
(meta.controleerTeksten || []).forEach((zin) => {
  meld(tekst.includes(zin), `komt letterlijk voor in de lesstof: ${zin}`);
});
meld(!/<input|<textarea|<form|contenteditable/i.test(tekst), 'geen eigen invoervelden in de lesstof');
meld(!/Antwoord:|Antwoorden:|Uitwerking:/i.test(tekst), 'geen antwoorden zichtbaar in de leerlingtekst');

/* 4. Wie ziet het? */

if (klasNamen.length) {
  const paragraafIds = bron.paragrafen.map(paragraafId);
  for (const naam of klasNamen) {
    const klassen = await db.collection('klassen').where('name', '==', naam).get();
    if (klassen.size !== 1) {
      meld(false, `klas ${naam}: ${klassen.size} gevonden`);
      continue;
    }
    const klas = klassen.docs[0];
    const toegewezen = klas.get('enabledParagrafen') || [];
    const mist = paragraafIds.filter((id) => !toegewezen.includes(id));
    meld(mist.length === 0, `klas ${naam}: alle ${paragraafIds.length} paragrafen toegewezen${mist.length ? ` (mist: ${mist.join(', ')})` : ''}`);

    // Een klas met een leerroute ziet alleen lesstof van dat niveau, ook als
    // die van een ander niveau wel is toegewezen.
    const route = klas.get('niveauId') || '';
    meld(
      !route || route === meta.niveauId,
      `klas ${naam}: leerroute "${route || 'geen'}" laat dit hoofdstuk zien (hoofdstuk staat onder ${meta.niveauId})`
    );
  }
}

/* 5. Voortgang */

const voortgang = await db.collection('voortgang').where('hoofdstukId', '==', hoofdstukId).get();
console.log(`     voortgang in dit hoofdstuk: ${voortgang.size} record(s)`);

console.log('');
if (fouten.length) {
  console.log(`${fouten.length} probleem(en):`);
  fouten.forEach((fout) => console.log(`- ${fout}`));
  process.exit(1);
}
console.log('Alles in orde.');
process.exit(0);
