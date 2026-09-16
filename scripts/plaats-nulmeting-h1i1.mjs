/**
 * Korte nulmeting digitale vaardigheden voor klas H1i1.
 *
 * H1i1 raakt snel afgeleid en had de volledige blauwe-routenulmeting van 54
 * vragen toegewezen. Kevin vroeg op 16 september 2026 om een kortere versie,
 * alleen voor deze klas, met zoveel mogelijk onderwerpen erin.
 *
 * Wat eruit gaat, en waarom:
 *   - de vier vragen van het niveau "verdieping": inhoudelijk het zwaarst;
 *   - alles waar de leerling meer moet doen dan klikken, dus invullen, koppelen
 *     en volgorde. Invullen is voor deze klas het grootste struikelblok en de
 *     andere twee kosten net zoveel tijd en aandacht.
 * Wat overblijft zijn 40 aanklikvragen, en alle negen onderwerpen van het
 * analysemodel blijven vertegenwoordigd.
 *
 * De twee delen worden gelijk verdeeld, 20 om 20. Dat kan alleen omdat de items
 * met hun EIGEN herkomstslug gebouwd worden: de item-id is `slug-nr`, dus een
 * vraag uit deel A die naar deel B verhuist houdt zijn id en botst niet met
 * vraag B-nr. De zes vragen die naar een situatieplaatje verwijzen blijven wel
 * in hun eigen deel, want het plaatje van deel A toont situatie A tot en met C
 * en dat van deel B situatie D tot en met F.
 *
 * De inleiding boven de vragen begint bij deze blokken meteen ingeklapt
 * (`content.presentatie.inleidingIngeklapt`). Dat is een instelling op het blok,
 * zodat er nergens een uitzondering voor één klas in de code staat.
 *
 * Vaste id's: opnieuw draaien overschrijft, verdubbelt niet.
 *
 *   node scripts/plaats-nulmeting-h1i1.mjs            # dry run
 *   node scripts/plaats-nulmeting-h1i1.mjs --apply
 *   node scripts/plaats-nulmeting-h1i1.mjs --verwijder --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwNulmetingMapping } from '../src/lib/nulmetingProfiel.js';
import { bouwToetsitems } from './lib/toetsitems-uit-seed.mjs';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const SCRIPT_NAAM = 'scripts/plaats-nulmeting-h1i1.mjs';
const KLAS_NAAM = 'H1i1';
const SEED_DIR = path.resolve('docs/seeds/nulmeting-dv');
const PARAGRAAF_ID = 'paragraaf-dv-h1i1-nulmeting-kort';
const BLOK_ID = (letter) => `block-dv-h1i1-nulmeting-kort-toets-${letter.toLowerCase()}`;
// De bestaande blauwe-routeblokken leveren de inleidingstekst met het
// situatieplaatje; die hoeft niet opnieuw naar Storage.
const BRON_BLOK = (letter) => `block-dv-bb-nulmeting-dv-toets-${letter.toLowerCase()}`;
const BRON_PARAGRAAF = 'paragraaf-dv-bb-nulmeting-dv';

const ZWARE_TYPES = new Set(['invullen', 'koppelen', 'volgorde']);
const PER_DEEL = 20;

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const verwijder = argumenten.includes('--verwijder');

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const lees = (naam) => JSON.parse(fs.readFileSync(path.join(SEED_DIR, naam), 'utf8'));
const seedA = lees('nulmeting-a.json');
const seedB = lees('nulmeting-b.json');
const analysemodel = lees('analysemodel.json');

const mapping = bouwNulmetingMapping({
  analysemodel,
  slugA: seedA.meta.slug,
  slugB: seedB.meta.slug
});

const itemIdVan = (slug, vraag) => `${slug}-${String(vraag.nr).padStart(2, '0')}`;
const niveauVan = (letter, nr) =>
  analysemodel.vraagmapping.find((regel) => regel.les === letter && regel.nr === nr)?.niveau || '';
const verwijstNaarSituatie = (vraag) => /\bsituaties?\s+[A-F]\b/i.test(String(vraag.vraag || ''));

/** De vragen die we houden, met alles erbij wat we verderop nodig hebben. */
const kandidaten = (seed, letter) => seed.vragen
  .filter((vraag) => niveauVan(letter, vraag.nr) !== 'verdieping' && !ZWARE_TYPES.has(vraag.type))
  .map((vraag) => ({
    vraag,
    letter,
    slug: seed.meta.slug,
    itemId: itemIdVan(seed.meta.slug, vraag),
    situatie: verwijstNaarSituatie(vraag)
  }));

const uitA = kandidaten(seedA, 'A');
const uitB = kandidaten(seedB, 'B');

// Deel 1 vult zich met vragen uit A; wat niet past schuift door naar deel 2.
// Vragen met een situatieplaatje staan vooraan, zodat ze nooit doorschuiven.
const gesorteerdA = [...uitA].sort((links, rechts) => (rechts.situatie ? 1 : 0) - (links.situatie ? 1 : 0));
const deel1 = gesorteerdA.slice(0, PER_DEEL).sort((links, rechts) => links.vraag.nr - rechts.vraag.nr);
const doorgeschoven = gesorteerdA.slice(PER_DEEL).sort((links, rechts) => links.vraag.nr - rechts.vraag.nr);
const deel2 = [...uitB, ...doorgeschoven];

if (doorgeschoven.some((kandidaat) => kandidaat.situatie)) {
  console.error('Er schuift een situatievraag door naar het andere deel; dat zou het verkeerde plaatje geven.');
  process.exit(1);
}

const DELEN = [
  { letter: 'A', seed: seedA, kandidaten: deel1 },
  { letter: 'B', seed: seedB, kandidaten: deel2 }
];

console.log(`Korte nulmeting voor ${KLAS_NAAM} (${verwijder ? 'VERWIJDEREN' : apply ? 'APPLY' : 'DRY RUN'})\n`);
console.log(`Van ${seedA.vragen.length + seedB.vragen.length} vragen naar ${deel1.length + deel2.length}.`);
for (const deel of DELEN) {
  const uitEigenDeel = deel.kandidaten.filter((kandidaat) => kandidaat.letter === deel.letter).length;
  const overgekomen = deel.kandidaten.length - uitEigenDeel;
  console.log(`  deel ${deel.letter}: ${deel.kandidaten.length} vragen` +
    (overgekomen ? ` (${overgekomen} overgekomen uit deel A)` : '') +
    ` | situatievragen: ${deel.kandidaten.filter((k) => k.situatie).length}`);
}

const perOnderwerp = {};
[...deel1, ...deel2].forEach((kandidaat) => {
  const naam = mapping[kandidaat.itemId]?.deelvaardigheidId || '(onbekend)';
  perOnderwerp[naam] = (perOnderwerp[naam] || 0) + 1;
});
console.log('\nVragen per onderwerp:');
Object.entries(perOnderwerp).sort().forEach(([naam, aantal]) => console.log(`  ${naam.padEnd(16)} ${aantal}`));
if (Object.values(perOnderwerp).some((aantal) => aantal < 2) || Object.keys(perOnderwerp).length < 9) {
  console.error('\nNiet elk onderwerp houdt genoeg vragen over; het startprofiel zou dan gaten hebben.');
  process.exit(1);
}

const klasSnap = await db.collection('klassen').where('name', '==', KLAS_NAAM).get();
if (klasSnap.empty) {
  console.error(`Klas ${KLAS_NAAM} niet gevonden.`);
  process.exit(1);
}
const klas = klasSnap.docs[0];
const leerlingen = await db.collection('users').where('klasId', '==', klas.id).get();
console.log(`\nKlas ${KLAS_NAAM}: ${klas.id} | route ${klas.get('niveauId') || '(geen)'} | ${leerlingen.size} leerlingen`);
if (leerlingen.empty) console.log('  Let op: er zitten nog geen leerlingen in deze klas.');

if (verwijder) {
  console.log('\nTe verwijderen: de korte paragraaf, beide blokken, hun snapshots en de toewijzing.');
  if (!apply) { console.log('Dry run; --apply verwijdert.'); process.exit(0); }
  for (const deel of DELEN) {
    await db.collection('contentBlocks').doc(BLOK_ID(deel.letter)).delete();
    await db.collection('publicContentBlocks').doc(BLOK_ID(deel.letter)).delete();
  }
  await db.collection('paragraaf').doc(PARAGRAAF_ID).delete();
  await db.collection('klassen').doc(klas.id).update({
    enabledParagrafen: FieldValue.arrayRemove(PARAGRAAF_ID),
    updatedAt: FieldValue.serverTimestamp()
  });
  console.log('Verwijderd. Zet zelf de volledige nulmeting terug als je die weer wilt.');
  process.exit(0);
}

// De bronparagraaf levert de plek in de boom; het bronblok de inleidingstekst.
const bronParagraaf = await db.collection('paragraaf').doc(BRON_PARAGRAAF).get();
if (!bronParagraaf.exists) {
  console.error(`Bronparagraaf ${BRON_PARAGRAAF} niet gevonden.`);
  process.exit(1);
}

const introPerDeel = {};
for (const deel of DELEN) {
  const bron = await db.collection('contentBlocks').doc(BRON_BLOK(deel.letter)).get();
  if (!bron.exists) {
    console.error(`Bronblok ${BRON_BLOK(deel.letter)} niet gevonden; daar komt de inleiding vandaan.`);
    process.exit(1);
  }
  introPerDeel[deel.letter] = bron.get('content')?.html || '';
}

const nu = new Date().toISOString();
const paragraaf = {
  id: PARAGRAAF_ID,
  vakId: bronParagraaf.get('vakId'),
  leerjaarId: bronParagraaf.get('leerjaarId'),
  niveauId: bronParagraaf.get('niveauId'),
  hoofdstukId: bronParagraaf.get('hoofdstukId'),
  code: '1.0',
  title: 'Nulmeting digitale vaardigheden (kort)',
  beschrijving: `Kortere nulmeting voor ${KLAS_NAAM}: ${deel1.length + deel2.length} aanklikvragen over alle negen onderdelen, zonder invullen, koppelen of slepen.`,
  order: 0,
  published: true,
  aiCompanionEnabled: false,
  cropCount: 0,
  isArchived: false,
  optioneel: false,
  verplicht: true,
  reviewStatus: 'approved',
  seedMeta: { seedId: 'nulmeting-dv-kort', importedAt: nu, script: SCRIPT_NAAM }
};

const bouwBlok = (deel, order) => {
  const items = bouwToetsitems(deel.kandidaten.map((kandidaat) => kandidaat.vraag), {
    slug: deel.seed.meta.slug,
    leerdoel: deel.seed.meta.leerdoel
  });
  // De items zijn per deel gebouwd met de slug van dat deel. Een doorgeschoven
  // vraag moet zijn oorspronkelijke id houden, anders klopt de mapping niet.
  const gecorrigeerd = items.map((item, index) => {
    const kandidaat = deel.kandidaten[index];
    return item.id === kandidaat.itemId ? item : { ...item, id: kandidaat.itemId };
  });
  const eigenMapping = Object.fromEntries(
    deel.kandidaten
      .map((kandidaat) => [kandidaat.itemId, mapping[kandidaat.itemId]])
      .filter(([, regel]) => Boolean(regel))
  );

  return {
    id: BLOK_ID(deel.letter),
    vakId: paragraaf.vakId,
    leerjaarId: paragraaf.leerjaarId,
    niveauId: paragraaf.niveauId,
    hoofdstukId: paragraaf.hoofdstukId,
    paragraafId: PARAGRAAF_ID,
    type: 'toets',
    order,
    title: `${deel.seed.meta.titel} (kort)`,
    status: 'published',
    content: {
      html: introPerDeel[deel.letter],
      assessmentType: 'toets',
      items: gecorrigeerd,
      attemptPolicy: { maxAttempts: 1, scoring: 'best', allowTeacherReset: true },
      tokenConfig: { enabled: false, totalTokens: 0 },
      retryPolicy: { enabled: false, aiHelp: false },
      // Deze klas raakt snel afgeleid: bij vraag 1 staat de inleiding dicht,
      // met de knop "Inleiding tonen" ernaast.
      presentatie: { mode: 'een-voor-een', terugbladeren: false, inleidingIngeklapt: true },
      sourceBasis: [],
      sourceNotes: `Korte nulmeting voor ${KLAS_NAAM}, afgeleid van het pakket van 3 september 2026 (${analysemodel.kerndoelenBron}).`,
      crops: [],
      nulmeting: {
        versie: analysemodel.versie,
        deel: deel.letter,
        slug: deel.seed.meta.slug,
        mapping: eigenMapping,
        analysemodel: {
          versie: analysemodel.versie,
          doel: analysemodel.doel,
          kerndoelenBron: analysemodel.kerndoelenBron,
          regels: analysemodel.regels,
          deelvaardigheden: analysemodel.deelvaardigheden
        }
      }
    },
    settings: normalizeContentBlockSettings({ allowAiHelp: false, scaffoldingRole: 'bewijs_leveren' }, 'toets'),
    linkedVraagId: null,
    createdBy: SCRIPT_NAAM,
    isArchived: false
  };
};

const blokken = DELEN.map((deel, index) => bouwBlok(deel, index + 1));

// Bewaking: geen sleutel en geen mapping in wat de leerling leest.
const fouten = [];
blokken.forEach((blok) => {
  const readiness = validateContentBlockReadiness(blok);
  if (readiness.errors.length > 0) fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
  const snapshot = buildPublicContentBlockSnapshot(blok);
  if (snapshot.content.nulmeting?.mapping || snapshot.content.nulmeting?.analysemodel) fouten.push(`${blok.id}: mapping lekt naar de leerlingversie`);
  if (snapshot.content.items.some((item) => item.answerKeyAvailable !== false)) fouten.push(`${blok.id}: antwoordsleutel lekt`);
  if (snapshot.content.presentatie?.inleidingIngeklapt !== true) fouten.push(`${blok.id}: de ingeklapte inleiding reist niet mee naar de leerling`);
  const ids = blok.content.items.map((item) => item.id);
  if (new Set(ids).size !== ids.length) fouten.push(`${blok.id}: dubbele item-id's`);
});
const alleIds = blokken.flatMap((blok) => blok.content.items.map((item) => item.id));
if (new Set(alleIds).size !== alleIds.length) fouten.push('item-id komt in beide delen voor');

if (fouten.length) {
  console.error('\nControle mislukt:');
  fouten.forEach((fout) => console.error(`  - ${fout}`));
  process.exit(1);
}
console.log('\nControle: geen sleutel, geen mapping en geen dubbele id\'s in de leerlingversie.');

const huidig = klas.get('enabledParagrafen') || [];
console.log(`\nToewijzing van ${KLAS_NAAM}:`);
console.log(`  nu:    ${JSON.stringify(huidig)}`);
console.log(`  wordt: ${JSON.stringify([PARAGRAAF_ID])}`);
console.log(`  (de volledige nulmeting ${BRON_PARAGRAAF} gaat eraf)`);

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(
  path.join(backupDir, `h1i1-voor-korte-nulmeting-${new Date().toISOString().slice(0, 10)}.json`),
  JSON.stringify({ klasId: klas.id, ...klas.data() }, null, 2)
);

const batch = db.batch();
batch.set(db.collection('paragraaf').doc(PARAGRAAF_ID), {
  ...paragraaf,
  createdAt: FieldValue.serverTimestamp(),
  updatedAt: FieldValue.serverTimestamp()
}, { merge: true });
blokken.forEach((blok) => {
  batch.set(db.collection('contentBlocks').doc(blok.id), {
    ...blok,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
  const snapshot = buildPublicContentBlockSnapshot(blok);
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), {
    ...snapshot,
    updatedAt: FieldValue.serverTimestamp()
  });
});
await batch.commit();
console.log(`\nGeschreven: 1 paragraaf, ${blokken.length} toetsblokken en hun leerlingversies.`);

await db.collection('klassen').doc(klas.id).update({
  enabledParagrafen: [PARAGRAAF_ID],
  updatedAt: FieldValue.serverTimestamp()
});
console.log(`Toegewezen aan ${KLAS_NAAM}; de volledige nulmeting staat er niet meer bij.`);

// Narekenen op wat de leerling werkelijk krijgt.
const controle = await db.collection('klassen').doc(klas.id).get();
console.log('\nControle achteraf:');
console.log(`  enabledParagrafen: ${JSON.stringify(controle.get('enabledParagrafen'))}`);
for (const blok of blokken) {
  const pub = await db.collection('publicContentBlocks').doc(blok.id).get();
  const content = pub.get('content') || {};
  console.log(`  ${blok.id}: ${(content.items || []).length} vragen | inleiding ingeklapt=${content.presentatie?.inleidingIngeklapt} | pogingen=${content.attemptPolicy?.maxAttempts} | deel=${content.nulmeting?.deel}`);
}
console.log('\nKlaar.');
process.exit(0);
