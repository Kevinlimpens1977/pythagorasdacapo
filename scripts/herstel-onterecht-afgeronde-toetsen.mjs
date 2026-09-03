/**
 * Herstelt quiz- en toetsrecords die door doorklikken op "afgerond" kwamen te
 * staan terwijl niet elke vraag was ingeleverd (bug tot 4 sep 2026: de
 * navigatie sloeg elk niet-vraagblok als afgerond op, ook een toets).
 *
 * Dry-run zonder vlag; `--apply` schrijft. Per record: completed false,
 * attemptStatus open, resultTier in_progress, itemsCompleted/itemsCorrect uit
 * de echte itemvoortgang. Een paragraphEnd-record van dezelfde paragraaf gaat
 * mee weg, anders komt het afsluitscherm later niet meer terug.
 * Tokenclaims worden alleen gemeld, niet aangepast.
 */
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const snap = await db.collection('voortgang').where('completed', '==', true).get();
const gevonden = [];

for (const d of snap.docs) {
  const x = d.data();
  if (!['quiz', 'toets'].includes(x.blockType)) continue;
  const blok = await db.doc(`contentBlocks/${x.blockId}`).get();
  const totaal = blok.exists ? (blok.data().content?.items || []).length : 0;
  const items = await d.ref.collection('items').get();
  const af = items.docs.filter((i) => i.data().completed === true || i.data().attemptStatus === 'pending_teacher_review').length;
  const goed = items.docs.filter((i) => i.data().isCorrect === true).length;
  if (totaal > 0 && af >= totaal) continue;

  const claims = await db.collection('tokenAwardClaims')
    .where('studentUid', '==', x.userId).get().catch(() => ({ docs: [] }));
  const claimIds = claims.docs.map((c) => c.id).filter((id) => id.includes(`_${x.blockId}_`));
  const paragraafEnd = await db.collection('voortgang')
    .where('userId', '==', x.userId)
    .where('paragraafId', '==', x.paragraafId)
    .where('progressType', '==', 'paragraphEnd')
    .get();

  gevonden.push({ ref: d.ref, id: d.id, userId: x.userId, klasId: x.klasId, blockId: x.blockId, totaal, af, goed, claimIds, paragraafEndRefs: paragraafEnd.docs.map((p) => p.ref), tokens: x.tokens || 0 });
}

console.log(`${apply ? 'APPLY' : 'DRY RUN'} - onterecht afgerond: ${gevonden.length}`);
for (const g of gevonden) {
  console.log(`- ${g.id}: ${g.af} van ${g.totaal} vragen ingeleverd (${g.goed} goed), tokenclaims: ${g.claimIds.length ? g.claimIds.join(', ') : 'geen'}, paragraafEnd-records: ${g.paragraafEndRefs.length}`);
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te herstellen.');
  process.exit(0);
}

for (const g of gevonden) {
  await g.ref.set({
    completed: false,
    isCorrect: false,
    attemptStatus: 'open',
    resultTier: 'in_progress',
    completionReason: '',
    itemCount: g.totaal,
    itemsCompleted: g.af,
    itemsCorrect: g.goed,
    completedAt: FieldValue.delete(),
    hersteldOp: FieldValue.serverTimestamp(),
    herstelReden: 'onterecht-afgerond-door-navigatie'
  }, { merge: true });
  for (const p of g.paragraafEndRefs) await p.delete();
}
console.log(`Hersteld: ${gevonden.length} records.`);
