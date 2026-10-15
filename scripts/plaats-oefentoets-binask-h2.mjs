/**
 * Zet de oefentoets achteraan Binask H2 (Kevin, 15 okt 2026): paragraaf "2.T
 * Oefentoets" met één tekstblok dat de leerling in zijn schrift maakt.
 *
 *   node scripts/plaats-oefentoets-binask-h2.mjs            dry run
 *   node scripts/plaats-oefentoets-binask-h2.mjs --apply    afbeeldingen uploaden en schrijven
 *
 * - De paragraaf krijgt `ontgrendelNaVoorgaande: true`: hij gaat pas open als
 *   alle paragrafen ervoor helemaal af zijn, ook alle toetsvragen (niet paars).
 * - Het blok krijgt `minimaleTijdSeconden`, `bevestigLabel` en `rekenmachine`
 *   (knop rechtsboven die de rekenmachine opent).
 * - De vragen staan in docs/seeds/binask-oefentoets-h2.json; de antwoorden
 *   daar zijn voor de docent en komen niet in de leerlingtekst.
 * - Afbeeldingen uit exports/oefentoets-h2/*.png gaan naar Storage.
 *
 * Toewijzen aan ER3L1A en ER3L2A daarna met scripts/zet-klas-lesstof-klaar.mjs --vak binask.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { STORAGE_BUCKET } from './lib/slidedeckPlaatsing.mjs';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');

const apply = process.argv.includes('--apply');
const SCRIPT_NAAM = 'scripts/plaats-oefentoets-binask-h2.mjs';
const bron = JSON.parse(fs.readFileSync(path.resolve('docs/seeds/binask-oefentoets-h2.json'), 'utf8'));
const { meta } = bron;
const AFB = { blokje: 'Een blokje aluminium: lengte 5 cm, breedte 4 cm, hoogte 2 cm', cilinders: 'Twee maatcilinders: links V begin, rechts V eind met het schaakstuk erin', weegschaal: 'Het schaakstuk op de weegschaal; het scherm toont 102,0 g' };

// Vaste tokens per afbeelding, zodat een tweede run dezelfde link geeft.
const token = (naam) => crypto.createHash('sha256').update(`${meta.blokId}-${naam}`).digest('hex').slice(0, 32).replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
const opslagPad = (naam) => `pythagoras/oefentoetsen/${meta.blokId}/${naam}.png`;
const url = (naam) => `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(opslagPad(naam))}?alt=media&token=${token(naam)}`;
const img = (naam) => `<p><img src="${url(naam)}" alt="${AFB[naam]}"></p>`;

const letters = 'abcdefgh';
const vraagHtml = (v) => {
  let html = `<p><strong>Vraag ${v.nr}.</strong> ${v.vraag}</p>`;
  if (v.afbeelding) html += img(v.afbeelding);
  if (v.afbeelding2) html += img(v.afbeelding2);
  if (v.sub?.length) html += `<ol type="a">${v.sub.map((s) => `<li>${s}</li>`).join('')}</ol>`;
  return html;
};
const tabel = `<h3>Tabel met dichtheden</h3><table><thead><tr><th>Stof</th><th>ρ (g/cm³)</th></tr></thead><tbody>${bron.tabel.map(([stof, rho]) => `<tr><td>${stof}</td><td>${rho}</td></tr>`).join('')}</tbody></table>`;
const html = `<p>${bron.intro}</p>${bron.delen.map((d) => `<h3>${d.titel}</h3>${d.vragen.map(vraagHtml).join('')}`).join('')}${tabel}`;

const paragraaf = {
  id: meta.paragraafId, vakId: meta.vakId, leerjaarId: meta.leerjaarId, niveauId: meta.niveauId, hoofdstukId: meta.hoofdstukId,
  code: meta.code, title: `${meta.code} ${meta.titel}`,
  beschrijving: 'Oefentoets van hoofdstuk 1 en 2 voor in je schrift. Gaat open als alle paragrafen hierboven helemaal af zijn.',
  order: meta.order, published: true, aiCompanionEnabled: false, cropCount: 0, isArchived: false,
  optioneel: false, verplicht: true, ontgrendelNaVoorgaande: true,
  learningGoals: ['Je kunt laten zien dat je de leerdoelen van hoofdstuk 1 en 2 beheerst.', 'Je kunt de dichtheid berekenen en daarmee een stof herkennen.'],
  leerdoelen: ['Je kunt laten zien dat je de leerdoelen van hoofdstuk 1 en 2 beheerst.', 'Je kunt de dichtheid berekenen en daarmee een stof herkennen.']
};
const blok = {
  id: meta.blokId, vakId: meta.vakId, leerjaarId: meta.leerjaarId, niveauId: meta.niveauId, hoofdstukId: meta.hoofdstukId, paragraafId: meta.paragraafId,
  type: 'theory', order: 1, title: 'Oefentoets hoofdstuk 1 en 2', status: 'published',
  content: { html, crops: [], minimaleTijdSeconden: meta.minimaleTijdSeconden, bevestigLabel: meta.bevestigLabel, rekenmachine: true, sourceBasis: ['docent-bron'], sourceNotes: `Bron: ${meta.bron}` },
  settings: normalizeContentBlockSettings({ allowAiHelp: false }, 'theory'),
  linkedVraagId: null, createdBy: SCRIPT_NAAM, isArchived: false
};

const fouten = [];
for (const naam of Object.keys(AFB)) if (!fs.existsSync(`exports/oefentoets-h2/${naam}.png`)) fouten.push(`afbeelding ontbreekt: ${naam}.png`);
const readiness = validateContentBlockReadiness(blok);
if (readiness.ready === false) fouten.push(`blok niet klaar: ${(readiness.issues || []).join('; ')}`);
if (/antwoord:/i.test(html)) fouten.push('Er staat een antwoord in de leerlingtekst.');
if (fouten.length) { console.error('Niet geplaatst:'); fouten.forEach((f) => console.error(`- ${f}`)); process.exit(1); }

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa', storageBucket: STORAGE_BUCKET });
const db = getFirestore();
const bestaat = (await db.collection('paragraaf').doc(meta.paragraafId).get()).exists;
const botsing = (await db.collection('paragraaf').where('hoofdstukId', '==', meta.hoofdstukId).get()).docs.filter((d) => d.id !== meta.paragraafId && d.get('code') === meta.code);
if (botsing.length) { console.error(`Code ${meta.code} bestaat al.`); process.exit(1); }
const vragen = bron.delen.reduce((n, d) => n + d.vragen.length, 0);
console.log(`${bestaat ? 'Bijwerken' : 'Nieuw'}: ${meta.paragraafId} "${paragraaf.title}" (volgnummer ${meta.order}, slot tot alles hierboven strikt af)`);
console.log(`  blok ${meta.blokId}: ${vragen} vragen in ${bron.delen.length} delen, ${html.length} tekens, afvinken na ${meta.minimaleTijdSeconden} s`);
console.log(`  afbeeldingen: ${Object.keys(AFB).map(opslagPad).join(', ')}`);

if (!apply) {
  fs.writeFileSync('exports/oefentoets-h2/voorbeeld.html', `<!doctype html><meta charset=utf-8><style>body{font-family:Arial;max-width:800px;margin:20px auto;line-height:1.5}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #999;padding:4px 10px}</style>${html.replace(/https:\/\/firebasestorage[^"]+%2F([a-z]+)\.png[^"]*/g, '$1.png')}`);
  console.log('\nDry run: niets geschreven. Voorbeeld in exports/oefentoets-h2/voorbeeld.html. Draai met --apply.');
  process.exit(0);
}

const bucket = getStorage().bucket(STORAGE_BUCKET);
for (const naam of Object.keys(AFB)) {
  await bucket.file(opslagPad(naam)).save(fs.readFileSync(`exports/oefentoets-h2/${naam}.png`), {
    resumable: false, contentType: 'image/png',
    metadata: { cacheControl: 'public, max-age=86400', metadata: { firebaseStorageDownloadTokens: token(naam) } }
  });
}
const schoon = (w) => JSON.parse(JSON.stringify(w));
const batch = db.batch();
batch.set(db.collection('paragraaf').doc(meta.paragraafId), { ...schoon(paragraaf), updatedAt: FieldValue.serverTimestamp(), ...(bestaat ? {} : { createdAt: FieldValue.serverTimestamp() }) }, { merge: true });
batch.set(db.collection('contentBlocks').doc(meta.blokId), { ...schoon(blok), updatedAt: FieldValue.serverTimestamp() });
const snapshot = buildPublicContentBlockSnapshot(blok);
batch.set(db.collection('publicContentBlocks').doc(snapshot.id), { ...schoon(snapshot), updatedAt: FieldValue.serverTimestamp() });
await batch.commit();
console.log('\nGeschreven: 3 afbeeldingen, de paragraaf, het blok en de snapshot.');
process.exit(0);
