/**
 * Zet alle toegewezen hoofdstukken van een klas op slot, behalve het hoofdstuk
 * waar haar nulmeting in zit.
 *
 *   node scripts/zet-hoofdstukken-op-slot.mjs
 *   node scripts/zet-hoofdstukken-op-slot.mjs --apply
 *
 * Hetzelfde als de vinkjes op /admin/vrijgeven, maar dan voor alle klassen
 * tegelijk. De leerling ziet de hoofdstukken wel staan (grijs, met slotje) en
 * kan er pas in als het vinkje eraf gaat.
 *
 * **Een klas zonder nulmeting blijft ongemoeid.** Anders zou dit script de twee
 * EOA-klassen buiten hun eigen Binask-lessen sluiten, en die zijn deze week in
 * gebruik. Wil je die toch op slot, gebruik dan het raster.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/zet-hoofdstukken-op-slot.mjs';

const apply = process.argv.includes('--apply');

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const isNulmeting = (paragraaf) =>
  /nulmeting/i.test(String(paragraaf.id || '')) || /nulmeting/i.test(String(paragraaf.title || ''));

const paragrafen = (await db.collection('paragraaf').get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
const paragraafById = Object.fromEntries(paragrafen.map((paragraaf) => [paragraaf.id, paragraaf]));
const hoofdstukken = Object.fromEntries(
  (await db.collection('hoofdstuk').get()).docs.map((doc) => [doc.id, doc.get('title') || doc.id])
);

const klassen = (await db.collection('klassen').get()).docs
  .map((doc) => ({ id: doc.id, ...doc.data() }))
  .sort((a, b) => String(a.naam || a.name || '').localeCompare(String(b.naam || b.name || ''), 'nl', { numeric: true }));

console.log(`Hoofdstukken op slot, behalve de nulmeting (${apply ? 'APPLY' : 'DRY RUN'})\n`);

const plannen = [];
for (const klas of klassen) {
  const naam = klas.naam || klas.name || klas.id;
  const toegewezen = Array.isArray(klas.enabledParagrafen) ? klas.enabledParagrafen : [];
  const eigenParagrafen = toegewezen.map((id) => paragraafById[id]).filter(Boolean);

  const metNulmeting = new Set(eigenParagrafen.filter(isNulmeting).map((paragraaf) => paragraaf.hoofdstukId));
  const alleHoofdstukken = [...new Set(eigenParagrafen.map((paragraaf) => paragraaf.hoofdstukId).filter(Boolean))];

  if (!metNulmeting.size) {
    console.log(`${naam.padEnd(8)} overgeslagen: geen nulmeting toegewezen (${alleHoofdstukken.length} hoofdstukken blijven open)`);
    continue;
  }

  const opSlot = alleHoofdstukken.filter((id) => !metNulmeting.has(id));
  const huidig = Array.isArray(klas.vergrendeldeHoofdstukken) ? klas.vergrendeldeHoofdstukken : [];
  const gelijk = huidig.length === opSlot.length && opSlot.every((id) => huidig.includes(id));

  console.log(`${naam.padEnd(8)} open: ${[...metNulmeting].map((id) => hoofdstukken[id] || id).join(', ')}`);
  console.log(`${' '.repeat(8)} slot: ${opSlot.map((id) => hoofdstukken[id] || id).join(', ') || '(niets)'}${gelijk ? '  [staat al zo]' : ''}`);

  if (!gelijk) plannen.push({ klas, naam, opSlot, huidig });
}

if (!plannen.length) {
  console.log('\nEr valt niets te wijzigen.');
  process.exit(0);
}

if (!apply) {
  console.log(`\nDry-run klaar. ${plannen.length} klas(sen) zouden wijzigen. Gebruik --apply om te schrijven.`);
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `hoofdstukslot-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(plannen.map(({ klas, huidig }) => ({ id: klas.id, naam: klas.naam || klas.name, vergrendeldeHoofdstukkenVoor: huidig })), null, 2));
console.log(`\nBack-up: ${backupPad}\n`);

for (const plan of plannen) {
  await db.collection('klassen').doc(plan.klas.id).update({
    vergrendeldeHoofdstukken: plan.opSlot,
    updatedAt: FieldValue.serverTimestamp(),
    laatsteSlotwijziging: { script: SCRIPT_NAAM, op: new Date().toISOString() }
  });
  console.log(`Geschreven: ${plan.naam} (${plan.opSlot.length} hoofdstuk(ken) op slot)`);
}

console.log(`\nKlaar. ${plannen.length} klas(sen) bijgewerkt.`);
