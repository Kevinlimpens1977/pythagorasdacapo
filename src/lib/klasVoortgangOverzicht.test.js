import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ACHTERSTAND_MARGE,
  STAP_STATUS,
  STIL_NA_DAGEN,
  VASTGELOPEN_POGINGEN,
  buildAandachtsLijst,
  buildHoofdstukRapport,
  buildKlasStatusTelling,
  buildKlasVoortgangRijen,
  buildMatrixRijen,
  buildParagraafKolommen,
  buildParagraafRapport,
  buildRecordIndex,
  buildStapKolommen,
  buildStapMatrixRijen,
  buildStapStatus,
  getParagraafLabel,
  getStatusPresentatie,
  groepeerParagrafenPerHoofdstuk,
  resolveStudentAssignments,
  toMillis
} from './klasVoortgangOverzicht.js';

const DAG = 24 * 60 * 60 * 1000;
const NU = Date.UTC(2026, 7, 25, 9, 0, 0);

const blok = (id, order, extra = {}) => ({
  id,
  order,
  title: `Stap ${order}`,
  type: 'question',
  status: 'published',
  isArchived: false,
  ...extra
});

const negenBlokken = () => [
  blok('dv-1-1-slidedeck', 1, { type: 'slidedeck', title: '1.1 Startpresentatie' }),
  blok('dv-1-1-theory-1', 2, { type: 'theory', title: 'Je schoolaccount' }),
  blok('dv-1-1-theory-2', 3, { type: 'theory', title: 'Bewijs opslaan' }),
  blok('dv-1-1-media', 4, { type: 'media', title: 'Microsoft 365 basis' }),
  blok('dv-1-1-question-check', 5, { type: 'question', title: 'Korte check' }),
  blok('dv-1-1-question-practice', 6, { type: 'question', title: 'Praktijkopdracht' }),
  blok('dv-1-1-summary', 7, { type: 'summary', title: 'Samenvatting' }),
  blok('dv-1-1-quiz', 8, { type: 'quiz', title: 'Afsluitquiz' }),
  blok('dv-1-1-game', 9, { type: 'game', title: 'Account Escape' })
];

const paragraaf11 = {
  id: 'paragraaf-dv-1-1',
  code: '1.1',
  title: 'Mijn digitale schooltas: HELIX, OneDrive en Outlook',
  hoofdstukId: 'hoofdstuk-dv-h1',
  hoofdstukTitle: 'H1: Starten en Account & Veilig'
};

const record = (blockId, extra = {}) => ({
  userId: 'leerling-1',
  blockId,
  paragraafId: 'paragraaf-dv-1-1',
  attempts: 1,
  completed: false,
  isCorrect: false,
  updatedAt: new Date(NU - DAG),
  ...extra
});

test('toMillis leest Firestore-timestamps, Date, getal en ISO-tekst', () => {
  assert.equal(toMillis(null), 0);
  assert.equal(toMillis(NU), NU);
  assert.equal(toMillis(new Date(NU)), NU);
  assert.equal(toMillis({ toDate: () => new Date(NU) }), NU);
  assert.equal(toMillis({ seconds: NU / 1000 }), NU);
  assert.equal(toMillis(new Date(NU).toISOString()), NU);
});

test('buildRecordIndex laat het nieuwste record winnen en kent ook vraagId', () => {
  const oud = record('blok-a', { updatedAt: new Date(NU - 5 * DAG), attempts: 1 });
  const nieuw = record('blok-a', { updatedAt: new Date(NU), attempts: 4 });
  const viaVraag = record(null, { vraagId: 'vraag-9', attempts: 2 });

  const index = buildRecordIndex([oud, nieuw, viaVraag]);

  assert.equal(index.get('blok-a').attempts, 4);
  assert.equal(index.get('vraag-9').attempts, 2);
});

test('een stap zonder record is niet gestart', () => {
  const stap = buildStapStatus({ block: blok('blok-a', 1), record: null, index: 0 });

  assert.equal(stap.status, STAP_STATUS.NIET_GESTART);
  assert.equal(stap.nummer, 1);
  assert.equal(stap.pogingen, 0);
});

test('een afgeronde stap toont of er Digidocent-hulp bij nodig was', () => {
  const zelfstandig = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { completed: true, isCorrect: true })
  });
  const metHulp = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { completed: true, isCorrect: true, aiHelpCount: 2 })
  });

  assert.equal(zelfstandig.status, STAP_STATUS.AFGEROND);
  assert.match(zelfstandig.toelichting, /Zelfstandig/);
  assert.equal(metHulp.status, STAP_STATUS.AFGEROND);
  assert.match(metHulp.toelichting, /2x Digidocent/);
});

test('drie pogingen zonder afronding heet vastgelopen', () => {
  const bezig = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { attempts: VASTGELOPEN_POGINGEN - 1 })
  });
  const vast = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { attempts: VASTGELOPEN_POGINGEN })
  });

  assert.equal(bezig.status, STAP_STATUS.BEZIG);
  assert.equal(vast.status, STAP_STATUS.VASTGELOPEN);
});

test('pogingen op binnen een eigen maximum telt ook als vastgelopen', () => {
  const stap = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { attempts: 2, maxAttempts: 2 })
  });

  assert.equal(stap.status, STAP_STATUS.VASTGELOPEN);
});

test('een afgekeurd antwoord is vastgelopen, een open antwoord is nakijken', () => {
  const afgekeurd = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { completed: true, isCorrect: false, resultTier: 'failed', attempts: 2 })
  });
  const nakijken = buildStapStatus({
    block: blok('blok-a', 1),
    record: record('blok-a', { attemptStatus: 'pending_teacher_review', attempts: 1 })
  });

  assert.equal(afgekeurd.status, STAP_STATUS.VASTGELOPEN);
  assert.equal(nakijken.status, STAP_STATUS.NAKIJKEN);
});

test('paragraafrapport volgt de lesroute en wijst de huidige stap aan', () => {
  const rapport = buildParagraafRapport({
    paragraaf: paragraaf11,
    blocks: negenBlokken(),
    records: [
      record('dv-1-1-slidedeck', { completed: true, isCorrect: true }),
      record('dv-1-1-theory-1', { completed: true, isCorrect: true }),
      record('dv-1-1-theory-2', { completed: true, isCorrect: true }),
      record('dv-1-1-media', { completed: true, isCorrect: true }),
      record('dv-1-1-question-check', { attempts: 1 })
    ]
  });

  assert.equal(rapport.totaalStappen, 9);
  assert.equal(rapport.afgerondeStappen, 4);
  assert.equal(rapport.percentage, 44);
  assert.equal(rapport.status, STAP_STATUS.BEZIG);
  assert.equal(rapport.huidigeStap.nummer, 5);
  assert.equal(rapport.huidigeStap.titel, 'Korte check');
  assert.equal(rapport.telling[STAP_STATUS.NIET_GESTART], 4);
  assert.equal(rapport.paragraafLabel, '1.1 Mijn digitale schooltas: HELIX, OneDrive en Outlook');
});

test('paragraafrapport houdt de lesroutevolgorde aan, ook bij losse volgorde', () => {
  const rapport = buildParagraafRapport({
    paragraaf: paragraaf11,
    blocks: [blok('blok-c', 3), blok('blok-a', 1), blok('blok-b', 2)],
    records: []
  });

  assert.deepEqual(rapport.stappen.map((stap) => stap.blockId), ['blok-a', 'blok-b', 'blok-c']);
  assert.deepEqual(rapport.stappen.map((stap) => stap.nummer), [1, 2, 3]);
});

test('een vastgelopen stap kleurt de hele paragraaf, ook als de rest afgerond is', () => {
  const rapport = buildParagraafRapport({
    paragraaf: paragraaf11,
    blocks: [blok('blok-a', 1), blok('blok-b', 2)],
    records: [
      record('blok-a', { completed: true, isCorrect: true }),
      record('blok-b', { attempts: 4 })
    ]
  });

  assert.equal(rapport.status, STAP_STATUS.VASTGELOPEN);
  assert.equal(rapport.eersteProbleem.blockId, 'blok-b');
});

test('alles af is afgerond', () => {
  const rapport = buildParagraafRapport({
    paragraaf: paragraaf11,
    blocks: [blok('blok-a', 1), blok('blok-b', 2)],
    records: [
      record('blok-a', { completed: true, isCorrect: true }),
      record('blok-b', { completed: true, isCorrect: true })
    ]
  });

  assert.equal(rapport.status, STAP_STATUS.AFGEROND);
  assert.equal(rapport.percentage, 100);
  assert.equal(rapport.huidigeStap, null);
});

test('hoofdstukrapport telt paragrafen op', () => {
  const rapportA = buildParagraafRapport({
    paragraaf: paragraaf11,
    blocks: [blok('a1', 1), blok('a2', 2)],
    records: [record('a1', { completed: true, isCorrect: true }), record('a2', { completed: true, isCorrect: true })]
  });
  const rapportB = buildParagraafRapport({
    paragraaf: { ...paragraaf11, id: 'paragraaf-dv-1-2', code: '1.2' },
    blocks: [blok('b1', 1), blok('b2', 2)],
    records: []
  });

  const hoofdstuk = buildHoofdstukRapport({
    hoofdstukId: 'hoofdstuk-dv-h1',
    hoofdstukTitel: 'H1',
    rapporten: [rapportA, rapportB]
  });

  assert.equal(hoofdstuk.totaalStappen, 4);
  assert.equal(hoofdstuk.afgerondeStappen, 2);
  assert.equal(hoofdstuk.percentage, 50);
  assert.equal(hoofdstuk.status, STAP_STATUS.BEZIG);
  assert.equal(hoofdstuk.afgerondeParagrafen, 1);
});

test('zonder klasselectie valt de omvang terug op de volledige gepubliceerde lesstof', () => {
  const scope = resolveStudentAssignments({
    student: { id: 'leerling-1' },
    klasData: null,
    paragrafen: [paragraaf11],
    contentBlocksByParagraaf: {
      'paragraaf-dv-1-1': [...negenBlokken(), blok('concept', 10, { status: 'draft' })]
    }
  });

  assert.equal(scope.scopeSource, 'volledigeLesstof');
  assert.equal(scope.assignments.length, 1);
  assert.equal(scope.assignments[0].blocks.length, 9);
});

test('met een klasselectie blijft de klas leidend', () => {
  const scope = resolveStudentAssignments({
    student: { id: 'leerling-1' },
    klasData: {
      enabledParagrafen: ['paragraaf-dv-1-1'],
      enabledContentBlocks: { 'paragraaf-dv-1-1': ['dv-1-1-theory-1', 'dv-1-1-question-check'] }
    },
    paragrafen: [paragraaf11, { ...paragraaf11, id: 'paragraaf-dv-1-2', code: '1.2' }],
    contentBlocksByParagraaf: {
      'paragraaf-dv-1-1': negenBlokken(),
      'paragraaf-dv-1-2': negenBlokken()
    }
  });

  assert.equal(scope.scopeSource, 'klas');
  assert.equal(scope.assignments.length, 1);
  assert.deepEqual(scope.assignments[0].blocks.map((b) => b.id), ['dv-1-1-theory-1', 'dv-1-1-question-check']);
});

const bouwRijen = (overrides = {}) => {
  const paragrafen = [paragraaf11, { ...paragraaf11, id: 'paragraaf-dv-1-2', code: '1.2', title: 'Wachtwoorden' }];
  const contentBlocksByParagraaf = {
    'paragraaf-dv-1-1': negenBlokken(),
    'paragraaf-dv-1-2': negenBlokken().map((b) => ({ ...b, id: `p2-${b.id}` }))
  };
  const students = [
    { id: 'leerling-1', displayName: 'Amir', klasId: 'klas-a' },
    { id: 'leerling-2', displayName: 'Bo', klasId: 'klas-a' },
    { id: 'leerling-3', displayName: 'Chris', klasId: 'klas-a' }
  ];
  const scopesByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      resolveStudentAssignments({ student, klasData: null, paragrafen, contentBlocksByParagraaf })
    ])
  );

  return buildKlasVoortgangRijen({
    students,
    scopesByStudentId,
    contentBlocksByParagraaf,
    now: NU,
    ...overrides
  });
};

test('klasoverzicht geeft per leerling een stand en sorteert op naam', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': negenBlokken().map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-2': [record('dv-1-1-question-check', { attempts: 5, updatedAt: new Date(NU) })],
      'leerling-3': []
    }
  });

  assert.deepEqual(rijen.map((rij) => rij.studentNaam), ['Amir', 'Bo', 'Chris']);
  assert.equal(rijen[0].totaalStappen, 18);
  assert.equal(rijen[0].afgerondeStappen, 9);
  assert.equal(rijen[0].percentage, 50);
  assert.equal(rijen[0].rapportByParagraafId['paragraaf-dv-1-1'].status, STAP_STATUS.AFGEROND);
  assert.equal(rijen[1].status, STAP_STATUS.VASTGELOPEN);
  assert.equal(rijen[2].status, STAP_STATUS.NIET_GESTART);
  assert.equal(rijen[2].gestarteStappen, 0);
});

test('vastgelopen leerlingen staan bovenaan de aandachtslijst met stap en paragraaf', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': [record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) })],
      'leerling-2': [record('dv-1-1-question-check', { attempts: 5, updatedAt: new Date(NU) })],
      'leerling-3': [record('dv-1-1-question-practice', { attemptStatus: 'pending_teacher_review', updatedAt: new Date(NU) })]
    }
  });
  const lijst = buildAandachtsLijst(rijen);

  assert.equal(lijst[0].studentNaam, 'Bo');
  assert.equal(lijst[0].hoofdreden.type, STAP_STATUS.VASTGELOPEN);
  assert.match(lijst[0].hoofdreden.detail, /1\.1/);
  assert.match(lijst[0].hoofdreden.detail, /stap 5/);
  assert.equal(lijst[1].studentNaam, 'Chris');
  assert.equal(lijst[1].hoofdreden.type, STAP_STATUS.NAKIJKEN);
});

test('een leerling die nog niets deed wordt gemeld als niet begonnen', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': negenBlokken().map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-2': negenBlokken().map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-3': []
    }
  });
  const chris = rijen.find((rij) => rij.studentNaam === 'Chris');

  assert.equal(chris.aandacht.nodig, true);
  assert.equal(chris.aandacht.redenen[0].type, 'nietGestart');
});

test('stilte langer dan een week is een eigen signaal', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': [record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) })],
      'leerling-2': [record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) })],
      'leerling-3': [record('dv-1-1-slidedeck', {
        completed: true,
        isCorrect: true,
        updatedAt: new Date(NU - (STIL_NA_DAGEN + 2) * DAG)
      })]
    }
  });
  const chris = rijen.find((rij) => rij.studentNaam === 'Chris');

  assert.equal(chris.aandacht.redenen.some((reden) => reden.type === 'stil'), true);
  assert.equal(chris.aandacht.dagenStil, STIL_NA_DAGEN + 2);
});

test('achterstand wordt gemeten tegen de klasmediaan', () => {
  const alles = negenBlokken();
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': alles.map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-2': alles.map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-3': [record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) })]
    }
  });
  const chris = rijen.find((rij) => rij.studentNaam === 'Chris');

  assert.equal(chris.klasMediaan, 50);
  assert.ok(chris.klasMediaan - chris.percentage >= ACHTERSTAND_MARGE);
  assert.equal(chris.aandacht.redenen.some((reden) => reden.type === 'achterstand'), true);
});

test('een leerling die alles af heeft vraagt geen aandacht', () => {
  const alleBlokken = [
    ...negenBlokken(),
    ...negenBlokken().map((b) => ({ ...b, id: `p2-${b.id}` }))
  ];
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': alleBlokken.map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-2': alleBlokken.map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) })),
      'leerling-3': alleBlokken.map((b) => record(b.id, { completed: true, isCorrect: true, updatedAt: new Date(NU) }))
    }
  });

  assert.deepEqual(rijen.map((rij) => rij.status), [STAP_STATUS.AFGEROND, STAP_STATUS.AFGEROND, STAP_STATUS.AFGEROND]);
  assert.deepEqual(rijen.map((rij) => rij.aandacht.nodig), [false, false, false]);
  assert.deepEqual(buildAandachtsLijst(rijen), []);
});

test('klastelling vat de statussen samen', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': [record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) })],
      'leerling-2': [record('dv-1-1-question-check', { attempts: 5, updatedAt: new Date(NU) })],
      'leerling-3': []
    }
  });
  const telling = buildKlasStatusTelling(rijen);

  assert.equal(telling.leerlingen, 3);
  assert.equal(telling[STAP_STATUS.BEZIG], 1);
  assert.equal(telling[STAP_STATUS.VASTGELOPEN], 1);
  assert.equal(telling[STAP_STATUS.NIET_GESTART], 1);
  // Amir werkt rustig door zonder signaal; alleen Bo en Chris vragen aandacht.
  assert.equal(telling.aandacht, 2);
});

test('matrixcellen tonen stand, en een niet-toegewezen paragraaf blijft leeg', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-1': [
        record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) }),
        record('dv-1-1-theory-1', { completed: true, isCorrect: true, updatedAt: new Date(NU) })
      ]
    }
  });
  const kolommen = buildParagraafKolommen([
    paragraaf11,
    { ...paragraaf11, id: 'paragraaf-dv-1-2', code: '1.2' },
    { ...paragraaf11, id: 'paragraaf-dv-9-9', code: '9.9' }
  ]);
  const [amir] = buildMatrixRijen({ rijen, kolommen });

  assert.deepEqual(kolommen.map((kolom) => kolom.kort), ['1.1', '1.2', '9.9']);
  assert.equal(amir.cellen[0].kort, '2/9');
  assert.equal(amir.cellen[0].status, STAP_STATUS.BEZIG);
  assert.match(amir.cellen[0].detail, /Stap 3/);
  assert.equal(amir.cellen[1].kort, '0/9');
  assert.equal(amir.cellen[2].toegewezen, false);
  assert.equal(amir.cellen[2].label, 'Niet toegewezen');
  // De balk links telt alleen de zichtbare kolommen: 2 van 18 stappen.
  assert.equal(amir.totaalStappen, 18);
  assert.equal(amir.afgerondeStappen, 2);
  assert.equal(amir.percentage, 11);
  assert.equal(amir.percentageVolledigeRoute, 11);
  assert.equal(amir.status, STAP_STATUS.BEZIG);

  // Alleen hoofdstukkolom 1.1 in beeld: de balk gaat mee omlaag naar 2 van 9.
  const [amirSmal] = buildMatrixRijen({ rijen, kolommen: [kolommen[0]] });
  assert.equal(amirSmal.totaalStappen, 9);
  assert.equal(amirSmal.percentage, 22);
  assert.equal(amirSmal.percentageVolledigeRoute, 11);
});

test('paragraafweergave zet elke stap in een eigen kolom', () => {
  const rijen = bouwRijen({
    recordsByStudentId: {
      'leerling-2': [
        record('dv-1-1-slidedeck', { completed: true, isCorrect: true, updatedAt: new Date(NU) }),
        record('dv-1-1-question-check', { attempts: 5, updatedAt: new Date(NU) })
      ]
    }
  });
  const kolommen = buildStapKolommen(negenBlokken());
  const stapRijen = buildStapMatrixRijen({ rijen, paragraafId: 'paragraaf-dv-1-1', kolommen });
  const bo = stapRijen.find((rij) => rij.studentNaam === 'Bo');

  assert.equal(kolommen.length, 9);
  assert.match(kolommen[4].titel, /Stap 5: Korte check/);
  assert.equal(bo.totaalStappen, 9);
  assert.equal(bo.afgerondeStappen, 1);
  assert.equal(bo.percentage, 11);
  assert.equal(bo.status, STAP_STATUS.VASTGELOPEN);
  assert.equal(bo.cellen[0].status, STAP_STATUS.AFGEROND);
  assert.equal(bo.cellen[4].status, STAP_STATUS.VASTGELOPEN);
  assert.equal(bo.cellen[8].status, STAP_STATUS.NIET_GESTART);
});

test('paragrafen groeperen per hoofdstuk behoudt de volgorde', () => {
  const groepen = groepeerParagrafenPerHoofdstuk([
    paragraaf11,
    { ...paragraaf11, id: 'paragraaf-dv-1-2', code: '1.2' },
    { ...paragraaf11, id: 'paragraaf-dv-2-1', code: '2.1', hoofdstukId: 'hoofdstuk-dv-h2', hoofdstukTitle: 'H2' }
  ]);

  assert.deepEqual(groepen.map((groep) => groep.hoofdstukId), ['hoofdstuk-dv-h1', 'hoofdstuk-dv-h2']);
  assert.equal(groepen[0].paragrafen.length, 2);
});

test('statuspresentatie geeft altijd een bruikbare kleur terug', () => {
  assert.equal(getStatusPresentatie(STAP_STATUS.AFGEROND).label, 'Afgerond');
  assert.equal(getStatusPresentatie('onbekend').status, STAP_STATUS.NIET_GESTART);
  assert.equal(getParagraafLabel({ title: 'Zonder nummer' }), 'Zonder nummer');
});
