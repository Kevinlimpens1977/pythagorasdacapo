/**
 * Overzicht van de digitale nulmeting Diff rekenen voor klas Diff_kader2.
 * ALLEEN LEZEN: dit script schrijft nooit naar Firestore. Het enige wat het
 * schrijft is een JSON-bestand in .tmp-diag/ (buiten git).
 *
 *   node scripts/diff-rekenen-nulmeting-overzicht.mjs
 *   node scripts/diff-rekenen-nulmeting-overzicht.mjs --met-test
 *   node scripts/diff-rekenen-nulmeting-overzicht.mjs --klas <klasId> --uit <pad.json>
 *
 * Wat het doet:
 *   1. leerlingen van de klas ophalen (users met klasId == klas); testaccounts
 *      (isTestaccount) alleen met --met-test;
 *   2. de vier quizblokken van hoofdstuk-diff-rekenen-2-start ophalen, één per
 *      domein (1.1 Getallen, 1.2 Verhoudingen, 1.3 Meten en meetkunde,
 *      1.4 Verbanden). Uit Firestore; lukt dat niet, dan uit de seed;
 *   3. per leerling per blok de itemvoortgang lezen uit
 *      voortgang/{uid}_{blockId}/items/{itemId}. Voortgang heeft geen vakId:
 *      de koppeling loopt via userId, blockId en paragraafId;
 *   4. rekenen met scripts/lib/diffRekenenNulmeting.mjs.
 *
 * De regels, kort (uitgebreid in scripts/lib/diffRekenenNulmeting.mjs):
 *   Per domein: gemaakt, goed, percentage goed van 12, en goed per niveau
 *   (basis vraag 1-4, plus 5-8, verdieping 9-12; elk van 4).
 *   Geschat niveau per domein:
 *     verdieping   >= 3/4 verdieping goed
 *     plus         anders >= 3/4 plus goed
 *     basis        anders >= 3/4 basis goed
 *     onder basis  anders (wel iets gemaakt)
 *     niet gemaakt geen enkele vraag gemaakt
 *   Volgorde sterk naar zwak: percentage goed; bij gelijk wie meer verdieping
 *   goed had, dan plus, dan basis. Niet gemaakte domeinen staan apart.
 *   Goed is de eerste ronde (ronde1.isCorrect) als die er is, anders isCorrect.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { NIVEAUS, beoordeelLeerling } from './lib/diffRekenenNulmeting.mjs';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const STANDAARD_KLAS = 'klas_1792053696147';
const HOOFDSTUK_ID = 'hoofdstuk-diff-rekenen-2-start';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEED_PAD = path.join(ROOT, 'docs/seeds/diff-rekenen.seed.json');
const STANDAARD_UIT = path.join(ROOT, '.tmp-diag/diff-kader2-nulmeting.json');

const NIVEAU_KORT = { basis: 'B', plus: 'P', verdieping: 'V' };

const leesArgs = (argv) => {
  const args = { metTest: false, klas: STANDAARD_KLAS, uit: STANDAARD_UIT };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--met-test') args.metTest = true;
    else if (arg === '--klas') args.klas = argv[++i];
    else if (arg === '--uit') args.uit = path.resolve(argv[++i]);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Onbekende optie: ${arg}`);
  }
  return args;
};

const codeUitTitel = (paragraaf) => {
  if (paragraaf.code) return String(paragraaf.code);
  const match = String(paragraaf.title || paragraaf.titel || '').match(/^\s*(\d+(?:\.\d+)*)/);
  return match ? match[1] : '';
};

const titelZonderCode = (paragraaf) =>
  String(paragraaf.title || paragraaf.titel || paragraaf.id).replace(/^\s*\d+(?:\.\d+)*\s*/, '').trim();

const isQuizblok = (blok) =>
  blok && blok.isArchived !== true && (blok.type === 'quiz' || blok.content?.assessmentType === 'quiz')
  && Array.isArray(blok.content?.items) && blok.content.items.length > 0;

const maakDomeinen = (paragrafen, blokken) =>
  [...paragrafen]
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map((paragraaf) => {
      const quiz = blokken
        .filter((blok) => blok.paragraafId === paragraaf.id && isQuizblok(blok))
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))[0];
      return quiz
        ? { code: codeUitTitel(paragraaf), titel: titelZonderCode(paragraaf), paragraafId: paragraaf.id, blockId: quiz.id, blockItems: quiz.content.items }
        : null;
    })
    .filter(Boolean);

const domeinenUitSeed = () => {
  const seed = JSON.parse(fs.readFileSync(SEED_PAD, 'utf8'));
  const paragrafen = (seed.paragrafen || []).filter((p) => p.hoofdstukId === HOOFDSTUK_ID);
  return maakDomeinen(paragrafen, seed.contentBlocks || []);
};

const domeinenUitFirestore = async (db) => {
  const paragrafenSnap = await db.collection('paragraaf').where('hoofdstukId', '==', HOOFDSTUK_ID).get();
  const paragrafen = paragrafenSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  if (!paragrafen.length) return [];
  const blokken = [];
  for (const paragraaf of paragrafen) {
    const snap = await db.collection('contentBlocks').where('paragraafId', '==', paragraaf.id).get();
    snap.docs.forEach((doc) => blokken.push({ id: doc.id, ...doc.data() }));
  }
  return maakDomeinen(paragrafen, blokken);
};

const leesItemRecords = async (db, userId, blockId) => {
  const snap = await db.collection('voortgang').doc(`${userId}_${blockId}`).collection('items').get();
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    // Dubbele zekerheid: alleen records van deze leerling en dit blok.
    .filter((record) => (!record.userId || record.userId === userId) && (!record.blockId || record.blockId === blockId));
};

const leerlingNaam = (user) =>
  String(user.displayName || [user.voornaam, user.achternaam].filter(Boolean).join(' ') || user.naam || user.email || user.id).trim();

const opBreedte = (tekst, breedte) => {
  const t = String(tekst ?? '');
  return t.length > breedte ? `${t.slice(0, breedte - 1)}~` : t.padEnd(breedte);
};

const printLeerling = (leerling) => {
  const { uitslag } = leerling;
  const test = leerling.isTestaccount ? ' [test]' : '';
  console.log('');
  console.log(`${leerling.naam}${test}  (${leerling.userId})`);
  console.log(`  Totaal: ${uitslag.goed} goed van ${uitslag.gemaakt} gemaakt`);
  console.log(`  ${opBreedte('Domein', 24)} ${opBreedte('Gemaakt', 8)} ${opBreedte('Goed', 5)} ${opBreedte('%', 5)} ${opBreedte('B', 4)} ${opBreedte('P', 4)} ${opBreedte('V', 4)} Niveau`);
  uitslag.domeinen.forEach((domein) => {
    const perNiveau = NIVEAUS.map((niveau) => opBreedte(`${domein.perNiveau[niveau].goed}/${domein.perNiveau[niveau].totaal}`, 4)).join(' ');
    const niveau = domein.geschatNiveau + (domein.gemaakt > 0 && !domein.volledig ? ' (onvolledig)' : '');
    console.log(`  ${opBreedte(`${domein.code} ${domein.titel}`, 24)} ${opBreedte(`${domein.gemaakt}/${domein.totaal}`, 8)} ${opBreedte(domein.goed, 5)} ${opBreedte(`${domein.percentage}%`, 5)} ${perNiveau} ${niveau}`);
  });

  const titelVan = Object.fromEntries(uitslag.domeinen.map((domein) => [domein.code, `${domein.code} ${domein.titel}`]));
  console.log(`  Sterk naar zwak: ${uitslag.volgorde.length ? uitslag.volgorde.map((code) => titelVan[code]).join(' > ') : '(nog niets gemaakt)'}`);
  if (uitslag.nietGemaakt.length && uitslag.volgorde.length) {
    console.log(`  Niet gemaakt: ${uitslag.nietGemaakt.map((code) => titelVan[code]).join(', ')}`);
  }

  uitslag.domeinen.filter((domein) => domein.gemaakt > 0).forEach((domein) => {
    console.log(`  Antwoorden ${domein.code}:`);
    domein.vragen.forEach((vraag) => {
      const oordeel = !vraag.gemaakt ? '-   ' : vraag.goed ? 'goed' : 'fout';
      const antwoord = vraag.gemaakt ? vraag.antwoord || '(leeg)' : '';
      console.log(`    ${String(vraag.nummer).padStart(2)} ${NIVEAU_KORT[vraag.niveau]} ${oordeel} ${opBreedte(antwoord, 18)} ${opBreedte(vraag.vraag, 60)}`);
    });
  });
};

const printKlasSamenvatting = (domeinen, leerlingen) => {
  const metData = leerlingen.filter((leerling) => leerling.uitslag.gemaakt > 0);
  console.log('');
  console.log(`Klas: ${metData.length} van ${leerlingen.length} leerlingen hebben iets gemaakt.`);
  if (!metData.length) return;
  const niveaus = ['verdieping', 'plus', 'basis', 'onder basis', 'niet gemaakt'];
  console.log(`  ${opBreedte('Domein', 24)} ${niveaus.map((niveau) => opBreedte(niveau, 13)).join(' ')}`);
  domeinen.forEach((domein, index) => {
    const tellingen = niveaus.map((niveau) =>
      opBreedte(leerlingen.filter((leerling) => leerling.uitslag.domeinen[index].geschatNiveau === niveau).length, 13));
    console.log(`  ${opBreedte(`${domein.code} ${domein.titel}`, 24)} ${tellingen.join(' ')}`);
  });
};

const main = async () => {
  const args = leesArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Gebruik: node scripts/diff-rekenen-nulmeting-overzicht.mjs [--met-test] [--klas <klasId>] [--uit <pad.json>]');
    return;
  }

  if (!getApps().length) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
  const db = getFirestore();

  const klasSnap = await db.collection('klassen').doc(args.klas).get();
  if (!klasSnap.exists) throw new Error(`Klas ${args.klas} bestaat niet.`);
  const klasNaam = klasSnap.data().name || klasSnap.data().naam || args.klas;

  let domeinen = await domeinenUitFirestore(db);
  let bron = 'firestore';
  if (!domeinen.length) {
    domeinen = domeinenUitSeed();
    bron = 'seed';
  }
  if (!domeinen.length) throw new Error(`Geen quizblokken gevonden voor ${HOOFDSTUK_ID}.`);

  const usersSnap = await db.collection('users').where('klasId', '==', args.klas).get();
  const users = usersSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((user) => !user.role || user.role === 'student')
    .filter((user) => args.metTest || user.isTestaccount !== true)
    .sort((a, b) => leerlingNaam(a).localeCompare(leerlingNaam(b), 'nl'));
  const aantalTest = usersSnap.docs.filter((doc) => doc.data().isTestaccount === true).length;

  console.log(`Nulmeting Diff rekenen, klas ${klasNaam} (${args.klas})`);
  console.log(`Domeinen uit ${bron}: ${domeinen.map((d) => `${d.code} ${d.titel} [${d.blockId}, ${d.blockItems.length} vragen]`).join('; ')}`);
  console.log(`Leerlingen: ${users.length}${args.metTest ? ' (met testaccounts)' : aantalTest ? ` (${aantalTest} testaccount${aantalTest === 1 ? '' : 's'} weggelaten; --met-test toont ze)` : ''}`);

  const leerlingen = [];
  for (const user of users) {
    const recordsPerBlok = {};
    for (const domein of domeinen) {
      recordsPerBlok[domein.blockId] = await leesItemRecords(db, user.id, domein.blockId);
    }
    leerlingen.push({
      userId: user.id,
      naam: leerlingNaam(user),
      isTestaccount: user.isTestaccount === true,
      uitslag: beoordeelLeerling({ domeinen, recordsPerBlok, userId: user.id })
    });
  }

  if (!leerlingen.length) console.log('\nGeen leerlingen gevonden.');
  leerlingen.forEach(printLeerling);
  printKlasSamenvatting(domeinen, leerlingen);

  const uitvoer = {
    gemaaktOp: new Date().toISOString(),
    klas: { id: args.klas, naam: klasNaam },
    hoofdstukId: HOOFDSTUK_ID,
    bronVragen: bron,
    metTest: args.metTest,
    regel: {
      geschatNiveau: 'verdieping bij >= 3/4 verdieping goed; anders plus bij >= 3/4 plus goed; anders basis bij >= 3/4 basis goed; anders onder basis; niets gemaakt = niet gemaakt',
      volgorde: 'percentage goed van 12, bij gelijk meer verdieping goed, dan plus, dan basis',
      goed: 'ronde1.isCorrect als die er is, anders isCorrect'
    },
    domeinen: domeinen.map(({ code, titel, paragraafId, blockId, blockItems }) => ({ code, titel, paragraafId, blockId, aantalVragen: blockItems.length })),
    leerlingen
  };
  fs.mkdirSync(path.dirname(args.uit), { recursive: true });
  fs.writeFileSync(args.uit, `${JSON.stringify(uitvoer, null, 2)}\n`, 'utf8');
  console.log(`\nJSON: ${path.relative(ROOT, args.uit) || args.uit}`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
