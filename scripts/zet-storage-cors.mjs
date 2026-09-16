/**
 * Zet de CORS-instelling van de Storage-bucket, zodat de browser van een
 * leerling de presentatie-PDF's mag ophalen.
 *
 * Waarom dit nodig is (gevonden op 16 september 2026): de bucket stond alleen
 * `http://localhost:5173` toe. Op dvdacapo.vercel.app blokkeert de browser
 * daardoor het ophalen van `slidedecks/.../generated-deck.pdf`. De
 * slidedeckviewer (PdfSlideDeckPresenter) wacht dan 12 seconden, geeft het op
 * en valt terug op een iframe met de kale PDF. De leerling ziet dus pas na
 * ruim tien seconden iets, zonder diateller en zonder onze eigen knoppen.
 * Met de juiste CORS-instelling haalt pdf.js het bestand in een paar seconden
 * op en verschijnen de dia's zoals bedoeld.
 *
 * Dit verruimt geen toegang: de bestanden zijn al opvraagbaar met hun
 * downloadtoken, en Storage-rules blijven onveranderd. CORS bepaalt alleen
 * welke website het antwoord mag lezen; hier staan alleen onze eigen adressen.
 *
 * De CORS-instelling hoort bij de bucket, niet bij firebase.json, en is dus
 * niet te deployen met `firebase deploy`. Daarom dit script.
 *
 * Gebruik (Admin SDK via Application Default Credentials):
 *
 *   node scripts/zet-storage-cors.mjs           # dry run: toont oud en nieuw
 *   node scripts/zet-storage-cors.mjs --apply   # schrijft de instelling
 *
 * De oude instelling wordt vóór het schrijven weggeschreven naar
 * exports/reset-backups/, zodat terugzetten een kwestie is van kopiëren.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const PROJECT_ID = 'pythagoras-eoa';
const STORAGE_BUCKET = 'pythagoras-eoa.firebasestorage.app';
const apply = process.argv.includes('--apply');

// Alleen onze eigen adressen, alleen lezen. Let op: een origin is exact,
// wildcards zoals *.vercel.app bestaan niet in een CORS-configuratie.
const CORS = [
  {
    origin: [
      'https://dvdacapo.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    method: ['GET', 'HEAD'],
    // Wat de browser van het antwoord mag lezen. Content-Range en
    // Accept-Ranges staan erbij zodat pdf.js desgewenst per stuk kan lezen.
    responseHeader: [
      'Content-Type',
      'Content-Length',
      'Content-Range',
      'Accept-Ranges',
      'Content-Disposition',
      'ETag'
    ],
    maxAgeSeconds: 3600
  }
];

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getStorage } = requireFromFunctions('firebase-admin/storage');

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET
  });
}

const bucket = getStorage().bucket();
const [metadata] = await bucket.getMetadata();
const huidig = metadata.cors || [];

console.log(`Storage CORS zetten (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Bucket: ${metadata.name}`);
console.log('');
console.log(`Nu:     ${JSON.stringify(huidig)}`);
console.log(`Straks: ${JSON.stringify(CORS)}`);

if (!apply) {
  console.log('');
  console.log('Dry run klaar. Gebruik --apply om de instelling te schrijven.');
  process.exit(0);
}

const backupMap = path.resolve('exports/reset-backups');
fs.mkdirSync(backupMap, { recursive: true });
const backupPad = path.join(backupMap, `storage-cors-voor-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, `${JSON.stringify(huidig, null, 2)}\n`, 'utf8');
console.log('');
console.log(`Back-up van de oude instelling: ${backupPad}`);

await bucket.setMetadata({ cors: CORS });
const [na] = await bucket.getMetadata();
console.log(`Geschreven. Nu ingesteld: ${JSON.stringify(na.cors)}`);
console.log('');
console.log('Controleer daarna een presentatie op dvdacapo.vercel.app: de dia\'s horen binnen enkele seconden te staan, met een diateller in plaats van "1 / ?".');
