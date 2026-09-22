/**
 * De nulmeting digitale vaardigheden, opgeteld per leerniveau.
 *
 *   node docs/curriculum/nulmeting-stand-per-niveau.mjs            # leesbare tabel
 *   node docs/curriculum/nulmeting-stand-per-niveau.mjs --json     # voor het rapport
 *
 * Telt de losse antwoorden (voortgang/{uid}_{blockId}/items), niet de
 * samenvatting op het blok: die teller loopt soms achter. Elk item weet uit de
 * mapping op het toetsblok bij welk onderdeel het hoort, dus de percentages per
 * kerndoel komen uit dezelfde bron als het startprofiel van de leerling.
 *
 * De inclusieklas H1i1 maakte een verkorte nulmeting (twee delen van twintig
 * vragen). Die telt apart en hoort niet in de vergelijking tussen de niveaus.
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';

const GROEPEN = [
  { id: 'basis', label: 'Basisberoepsgerichte leerweg', klassen: ['H1B1', 'H1B2'] },
  { id: 'kader', label: 'Kaderberoepsgerichte leerweg', klassen: ['H1K1', 'H1K2', 'H1K3'] },
  { id: 'tl', label: 'Theoretische leerweg', klassen: ['H1TL1', 'H1TL2', 'H1TL3'] },
  { id: 'inclusie', label: 'Inclusieklas (verkorte nulmeting)', klassen: ['H1i1'] }
];

// De namen zoals het MT ze in het rapport ziet, met het kerndoelnummer erbij.
const ONDERDELEN = [
  ['systemen', '21A Digitale systemen'],
  ['informatie', '21B Digitale media en informatie'],
  ['data', '21C Data en dataverwerking'],
  ['ai', '21D Artificiele intelligentie'],
  ['producten', '22A Digitale producten creeren'],
  ['programmeren', '22B Programmeren'],
  ['veiligheid', '23A Veiligheid en privacy'],
  ['sociaal', '23B Jezelf en de ander'],
  ['samenleving', '23C Digitale technologie en samenleving']
];

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const klassen = (await db.collection('klassen').get()).docs
  .map((doc) => ({ id: doc.id, naam: doc.get('naam') || doc.get('name') || doc.id }));
const klasIdVanNaam = Object.fromEntries(klassen.map((klas) => [klas.naam, klas.id]));

// Per toetsblok: welk onderdeel hoort bij welk item?
const mappingPerBlok = {};
for (const doc of (await db.collection('contentBlocks').get()).docs) {
  const mapping = doc.get('content')?.nulmeting?.mapping;
  if (mapping) mappingPerBlok[doc.id] = mapping;
}

const leeg = () => Object.fromEntries(ONDERDELEN.map(([id]) => [id, { goed: 0, gemaakt: 0 }]));

const uitkomst = [];
for (const groep of GROEPEN) {
  const perOnderdeel = leeg();
  const leerlingen = [];
  let aantalLeerlingen = 0;

  for (const klasNaam of groep.klassen) {
    const klasId = klasIdVanNaam[klasNaam];
    if (!klasId) continue;
    const users = (await db.collection('users').where('klasId', '==', klasId).get()).docs
      .filter((doc) => doc.get('isTestaccount') !== true);
    aantalLeerlingen += users.length;

    for (const user of users) {
      const records = (await db.collection('voortgang').where('userId', '==', user.id).get()).docs
        .filter((doc) => /nulmeting/.test(doc.get('blockId') || ''));

      let goed = 0;
      let gemaakt = 0;
      let delenAf = 0;

      for (const record of records) {
        if (record.get('completed') === true) delenAf += 1;
        const mapping = mappingPerBlok[record.get('blockId')] || {};
        const items = await record.ref.collection('items').get();
        for (const item of items.docs) {
          const data = item.data() || {};
          if (data.completed !== true) continue;
          gemaakt += 1;
          if (data.isCorrect === true) goed += 1;
          const onderdeel = mapping[item.id]?.deelvaardigheidId;
          if (onderdeel && perOnderdeel[onderdeel]) {
            perOnderdeel[onderdeel].gemaakt += 1;
            if (data.isCorrect === true) perOnderdeel[onderdeel].goed += 1;
          }
        }
      }

      if (gemaakt > 0) {
        leerlingen.push({ gemaakt, goed, delenAf, percentage: Math.round((goed / gemaakt) * 100) });
      }
    }
  }

  const gemaakt = leerlingen.reduce((som, l) => som + l.gemaakt, 0);
  const goed = leerlingen.reduce((som, l) => som + l.goed, 0);
  const percentages = leerlingen.map((l) => l.percentage).sort((a, b) => a - b);
  const mediaan = percentages.length
    ? (percentages.length % 2
      ? percentages[(percentages.length - 1) / 2]
      : Math.round((percentages[percentages.length / 2 - 1] + percentages[percentages.length / 2]) / 2))
    : 0;

  uitkomst.push({
    ...groep,
    aantalLeerlingen,
    begonnen: leerlingen.length,
    beideDelenAf: leerlingen.filter((l) => l.delenAf >= 2).length,
    gemaakt,
    goed,
    percentage: gemaakt ? Math.round((goed / gemaakt) * 100) : 0,
    mediaan,
    laagste: percentages[0] ?? 0,
    hoogste: percentages[percentages.length - 1] ?? 0,
    onderdelen: ONDERDELEN.map(([id, label]) => ({
      id,
      label,
      goed: perOnderdeel[id].goed,
      gemaakt: perOnderdeel[id].gemaakt,
      percentage: perOnderdeel[id].gemaakt ? Math.round((perOnderdeel[id].goed / perOnderdeel[id].gemaakt) * 100) : null
    }))
  });
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ gemaaktOp: new Date().toISOString().slice(0, 10), groepen: uitkomst }, null, 2));
} else {
  for (const groep of uitkomst) {
    console.log(`\n=== ${groep.label} (${groep.klassen.join(', ')}) ===`);
    console.log(`leerlingen: ${groep.aantalLeerlingen} | begonnen: ${groep.begonnen} | beide delen af: ${groep.beideDelenAf}`);
    console.log(`goed: ${groep.goed} van ${groep.gemaakt} beantwoorde vragen = ${groep.percentage}% | mediaan per leerling ${groep.mediaan}% (${groep.laagste}-${groep.hoogste}%)`);
    groep.onderdelen.forEach((onderdeel) => {
      console.log(`   ${onderdeel.label.padEnd(40)} ${onderdeel.percentage === null ? 'geen vragen' : `${String(onderdeel.percentage).padStart(3)}%  (${onderdeel.goed}/${onderdeel.gemaakt})`}`);
    });
  }
}
