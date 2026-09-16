/**
 * Vult het aantal dia's aan bij slidedecks die al in de bibliotheek staan.
 *
 * De presentatieweergave toonde "3 / ?" zodra zij de PDF niet zelf kon
 * inlezen: de ingebouwde PDF-weergave van de browser vertelt niet hoeveel
 * pagina's er zijn. Sinds 16 september 2026 reist het aantal dia's daarom mee
 * met het lesblok (`content.deckPageCount`) en met het pakket
 * (`generatedDeckPdf.pageCount`). Nieuwe decks krijgen dat getal bij het
 * plaatsen; dit script zet het alsnog bij de decks die er al stonden.
 *
 * Per pakket: de PDF uit Storage lezen (met de Admin SDK, dus zonder CORS),
 * de pagina's tellen met dezelfde pdf.js als de app, en daarna het pakket, de
 * bijbehorende lesblokken en hun publieke snapshots bijwerken. Verder wordt er
 * niets aangeraakt: geen teksten, geen voortgang, geen toewijzingen.
 *
 * Gebruik (Admin SDK via Application Default Credentials):
 *
 *   node scripts/vul-slidedeck-paginatellingen.mjs           # dry run
 *   node scripts/vul-slidedeck-paginatellingen.mjs --apply
 *
 * Opties:
 *   --opnieuw   ook pakketten die al een telling hebben opnieuw tellen
 */

import { createRequire } from 'node:module';

import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { PROJECT_ID, STORAGE_BUCKET, cleanForFirestore, telPdfPaginas } from './lib/slidedeckPlaatsing.mjs';

const apply = process.argv.includes('--apply');
const opnieuw = process.argv.includes('--opnieuw');

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

console.log(`Paginatellingen van slidedecks vullen (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);
console.log('');

const pakketten = await db.collection('slidedeckPackages').get();
const blokken = await db.collection('contentBlocks').where('type', '==', 'slidedeck').get();

const tellingen = new Map();
const overslaan = [];

for (const pakketDoc of pakketten.docs) {
  const pakket = pakketDoc.data();
  const storagePath = pakket.generatedDeckPdf?.storagePath || '';
  const huidig = Math.round(Number(pakket.generatedDeckPdf?.pageCount || 0));

  if (!storagePath) {
    overslaan.push(`${pakketDoc.id}: geen deck-PDF`);
    continue;
  }
  if (huidig > 0 && !opnieuw) {
    tellingen.set(pakketDoc.id, huidig);
    console.log(`- ${pakketDoc.id}: heeft al ${huidig} dia's`);
    continue;
  }

  try {
    const [buffer] = await bucket.file(storagePath).download();
    const paginas = await telPdfPaginas(buffer);
    tellingen.set(pakketDoc.id, paginas);
    console.log(`- ${pakketDoc.id}: ${paginas} dia's geteld (${(buffer.length / 1e6).toFixed(1)} MB)`);
  } catch (fout) {
    overslaan.push(`${pakketDoc.id}: ${fout.message}`);
  }
}

const teSchrijvenPakketten = pakketten.docs.filter((pakketDoc) => {
  const paginas = tellingen.get(pakketDoc.id);
  return paginas > 0 && Math.round(Number(pakketDoc.get('generatedDeckPdf.pageCount') || 0)) !== paginas;
});

const teSchrijvenBlokken = blokken.docs
  .map((blokDoc) => ({ blokDoc, paginas: tellingen.get(blokDoc.get('content.slidedeckPackageId') || '') || 0 }))
  .filter(({ blokDoc, paginas }) => paginas > 0 && Math.round(Number(blokDoc.get('content.deckPageCount') || 0)) !== paginas);

console.log('');
console.log(`Bij te werken: ${teSchrijvenPakketten.length} pakketten, ${teSchrijvenBlokken.length} lesblokken (en evenveel publieke snapshots).`);
teSchrijvenBlokken.forEach(({ blokDoc, paginas }) => console.log(`  ${blokDoc.id} -> ${paginas} dia's`));
if (overslaan.length) {
  console.log('');
  console.log('Overgeslagen:');
  overslaan.forEach((regel) => console.log(`  ${regel}`));
}

if (!apply) {
  console.log('');
  console.log('Dry run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const batch = db.batch();
for (const pakketDoc of teSchrijvenPakketten) {
  batch.set(pakketDoc.ref, {
    generatedDeckPdf: { ...(pakketDoc.get('generatedDeckPdf') || {}), pageCount: tellingen.get(pakketDoc.id) },
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}
for (const { blokDoc, paginas } of teSchrijvenBlokken) {
  const blok = { id: blokDoc.id, ...blokDoc.data() };
  blok.content = { ...(blok.content || {}), deckPageCount: paginas };
  batch.set(blokDoc.ref, { content: blok.content, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  batch.set(
    db.collection('publicContentBlocks').doc(blokDoc.id),
    cleanForFirestore({ ...buildPublicContentBlockSnapshot(blok), updatedAt: FieldValue.serverTimestamp() })
  );
}
await batch.commit();

console.log('');
console.log(`Geschreven: ${teSchrijvenPakketten.length} pakketten, ${teSchrijvenBlokken.length} lesblokken + snapshots.`);
process.exit(0);
