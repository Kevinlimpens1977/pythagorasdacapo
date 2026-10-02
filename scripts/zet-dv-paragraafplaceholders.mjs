/**
 * Zet in de DV-placeholders (hoofdstuk 4 tot en met 23) de paragrafen klaar:
 * titel, leerdoel en een korte docentnotitie met de beeldspraak. Ongepubliceerd:
 * een leerling ziet er niets van, de docent ziet in de bibliotheek wat er komt.
 *
 *   node scripts/zet-dv-paragraafplaceholders.mjs            dry run
 *   node scripts/zet-dv-paragraafplaceholders.mjs --apply    schrijven
 *
 * Bron: docs/curriculum/dv-klas1-curriculum.json (paragrafen en leerdoelen) en
 * docs/curriculum/lesideeen-h4-h23.json (beeldspraak en opening). De id's zijn
 * dezelfde die scripts/bouw-hoofdstuk-seed.mjs later maakt
 * (paragraaf-dv-klas1-<hoofdstuk><nr>); bouw je het hoofdstuk, dan vult de
 * import deze documenten aan en zet ze op gepubliceerd.
 *
 * Een paragraaf die al gepubliceerd is of al lesblokken heeft, blijft ongemoeid.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const lees = (pad) => JSON.parse(readFileSync(new URL(pad, import.meta.url), 'utf8'));
const curriculum = lees('../docs/curriculum/dv-klas1-curriculum.json');
const ideeen = lees('../docs/curriculum/lesideeen-h4-h23.json').hoofdstukken;

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const plan = [];
for (const les of curriculum.lessen.filter((l) => l.hoofdstuk >= 4)) {
  const hoofdstukId = `hoofdstuk-dv-klas1-h${les.hoofdstuk}`;
  const hoofdstuk = await db.collection('hoofdstuk').doc(hoofdstukId).get();
  if (!hoofdstuk.exists) throw new Error(`${hoofdstukId} bestaat niet; draai eerst scripts/zet-dv-placeholders.mjs.`);
  const h = hoofdstuk.data();
  const idee = ideeen[String(les.hoofdstuk)];
  for (const [index, titel] of les.paragrafen.entries()) {
    const code = `${les.hoofdstuk}.${index + 1}`;
    const id = `paragraaf-dv-klas1-${les.hoofdstuk}${index + 1}`;
    const bestaand = await db.collection('paragraaf').doc(id).get();
    const blokken = await db.collection('contentBlocks').where('paragraafId', '==', id).limit(1).get();
    if ((bestaand.exists && bestaand.get('published') === true) || !blokken.empty) {
      plan.push({ id, code, titel, overslaan: 'al gebouwd' });
      continue;
    }
    const leerdoel = les.leerdoelen[index] ? [les.leerdoelen[index]] : [];
    plan.push({
      id, code, titel,
      doc: {
        id,
        vakId: h.vakId,
        leerjaarId: h.leerjaarId,
        niveauId: h.niveauId,
        hoofdstukId,
        code,
        title: `${code} ${titel}`,
        beschrijving: '',
        order: index + 1,
        published: false,
        isArchived: false,
        optioneel: false,
        verplicht: true,
        aiCompanionEnabled: true,
        cropCount: 0,
        learningGoals: leerdoel,
        leerdoelen: leerdoel,
        docentNotitie: index === 0
          ? `Opening: ${idee.opening} Beeldspraak: ${idee.beeldspraak}`
          : `Zie docs/curriculum/lesideeen-h4-h23.md, H${les.hoofdstuk}.`,
        placeholder: true
      }
    });
  }
}

for (const p of plan) console.log(`${p.overslaan ? 'SKIP' : (apply ? 'SCHRIJF' : 'NIEUW ')}  ${p.id}  ${p.code} ${p.titel}${p.overslaan ? ` (${p.overslaan})` : ''}`);
const teSchrijven = plan.filter((p) => p.doc);
console.log(`\n${teSchrijven.length} paragrafen, ongepubliceerd.`);
if (!apply) {
  console.log('Dry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}
for (let i = 0; i < teSchrijven.length; i += 400) {
  const batch = db.batch();
  for (const p of teSchrijven.slice(i, i + 400)) {
    batch.set(db.collection('paragraaf').doc(p.id), { ...p.doc, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  await batch.commit();
}
console.log('Geschreven.');
