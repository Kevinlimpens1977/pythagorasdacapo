import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NAKIJK_BESLUIT,
  beoordeelBlokkade,
  beschrijfItemLeesfout,
  buildBeoordelingData,
  buildBlokstandNaBeoordeling,
  buildNakijkOpdrachten,
  getModelAntwoord,
  getVraagTekst,
  isAssessmentItemRecord,
  isBeoordeelbaar,
  telNakijkPerLeerling
} from './nakijkOpdrachten.js';
import { STAP_STATUS } from './klasVoortgangOverzicht.js';
import {
  buildItemStap,
  buildKlasVoortgangRijen,
  buildStapStatus
} from './klasVoortgangOverzicht.js';
import {
  buildAssessmentItemVoortgangUpdate,
  buildContentBlockVoortgangUpdate
} from './voortgangPayload.js';

const wachtendRecord = (extra = {}) => ({
  userId: 'leerling-1',
  blockId: 'blok-1',
  paragraafId: 'para-1',
  hoofdstukId: 'hoofdstuk-1',
  klasId: 'klas-1',
  attempts: 2,
  aiHelpCount: 1,
  attemptStatus: 'pending_teacher_review',
  resultTier: 'pending_teacher_review',
  completed: true,
  isCorrect: false,
  questionPlainText: 'Leg uit waarom een sterk wachtwoord lang moet zijn.',
  modelAnswer: 'Hoe langer het wachtwoord, hoe meer combinaties een computer moet proberen.',
  lastAnswer: { openAnswer: 'Anders raadt iemand hem zo.' },
  updatedAt: 1700000000000,
  ...extra
});

const rijMetWachtendeStap = (extra = {}) => ({
  studentId: 'leerling-1',
  student: { id: 'leerling-1' },
  studentNaam: 'Amira',
  klasId: 'klas-1',
  rapporten: [
    {
      paragraafId: 'para-1',
      paragraafLabel: '1.2 Veilig online',
      hoofdstukId: 'hoofdstuk-1',
      hoofdstukTitel: 'Digitaal veilig',
      stappen: [
        {
          blockId: 'blok-0',
          nummer: 1,
          titel: 'Lezen',
          typeLabel: 'Theorie',
          status: STAP_STATUS.AFGEROND,
          pogingen: 1,
          aiHulp: 0,
          laatsteActiviteitMs: 1699999000000,
          record: {}
        },
        {
          blockId: 'blok-1',
          nummer: 2,
          titel: 'Open vraag over wachtwoorden',
          typeLabel: 'Vraag',
          status: STAP_STATUS.NAKIJKEN,
          pogingen: 2,
          aiHulp: 1,
          laatsteActiviteitMs: 1700000000000,
          record: wachtendRecord()
        }
      ]
    }
  ],
  ...extra
});

test('buildNakijkOpdrachten picks up only the steps that wait for the teacher', () => {
  const opdrachten = buildNakijkOpdrachten([rijMetWachtendeStap()]);

  assert.equal(opdrachten.length, 1);
  assert.equal(opdrachten[0].studentNaam, 'Amira');
  assert.equal(opdrachten[0].blockId, 'blok-1');
  assert.equal(opdrachten[0].stapNummer, 2);
  assert.equal(opdrachten[0].paragraafLabel, '1.2 Veilig online');
  assert.equal(opdrachten[0].vraag, 'Leg uit waarom een sterk wachtwoord lang moet zijn.');
  assert.deepEqual(opdrachten[0].antwoord, { openAnswer: 'Anders raadt iemand hem zo.' });
  assert.equal(opdrachten[0].beoordeelbaar, true);
});

test('buildNakijkOpdrachten puts the longest waiting answer first', () => {
  const oud = rijMetWachtendeStap({ studentId: 'leerling-2', studentNaam: 'Bram' });
  oud.rapporten[0].stappen[1].laatsteActiviteitMs = 1600000000000;
  oud.rapporten[0].stappen[1].record = wachtendRecord({ userId: 'leerling-2' });

  const opdrachten = buildNakijkOpdrachten([rijMetWachtendeStap(), oud]);

  assert.deepEqual(opdrachten.map((opdracht) => opdracht.studentNaam), ['Bram', 'Amira']);
});

test('buildNakijkOpdrachten marks a record without a lesson block as not reviewable', () => {
  const rij = rijMetWachtendeStap();
  rij.rapporten[0].stappen[1].record = { userId: 'leerling-1', vraagId: 'oud-1', paragraafId: 'para-1' };

  const [opdracht] = buildNakijkOpdrachten([rij]);

  assert.equal(opdracht.beoordeelbaar, false);
  assert.equal(isBeoordeelbaar(opdracht.record), false);
});

test('telNakijkPerLeerling counts open reviews per student', () => {
  const tweede = rijMetWachtendeStap({ studentId: 'leerling-2', studentNaam: 'Bram' });

  const telling = telNakijkPerLeerling(buildNakijkOpdrachten([rijMetWachtendeStap(), tweede]));

  assert.deepEqual(telling, { 'leerling-1': 1, 'leerling-2': 1 });
});

test('getVraagTekst and getModelAntwoord fall back without inventing text', () => {
  assert.equal(getVraagTekst({}, { titel: 'Stap 3' }), 'Stap 3');
  assert.equal(getVraagTekst({}, {}), 'Open vraag');
  assert.equal(getModelAntwoord({ expectedAnswer: 'lang' }), 'lang');
  assert.equal(getModelAntwoord({}), '');
});

test('approving marks the step as correctly finished, guided when the tutor helped', () => {
  const data = buildBeoordelingData({
    record: wachtendRecord(),
    besluit: NAKIJK_BESLUIT.GOEDGEKEURD,
    opmerking: 'Goede uitleg.',
    docent: { uid: 'docent-1', displayName: 'Mevrouw Jansen' },
    nu: new Date('2026-08-25T10:00:00.000Z')
  });

  assert.equal(data.completed, true);
  assert.equal(data.isCorrect, true);
  assert.equal(data.resultTier, 'guided');
  assert.equal(data.attemptStatus, 'completed');
  assert.equal(data.completionReason, 'teacher_approved');
  assert.equal(data.teacherSignal, '');
  assert.equal(data.teacherReview.docentNaam, 'Mevrouw Jansen');
  assert.equal(data.teacherReview.beoordeeldOp, '2026-08-25T10:00:00.000Z');
  assert.equal(data.attemptEntry.source, 'docentbeoordeling');
  assert.equal(data.attemptEntry.isCorrect, true);
});

test('approving without tutor help counts as independent', () => {
  const data = buildBeoordelingData({
    record: wachtendRecord({ aiHelpCount: 0 }),
    besluit: NAKIJK_BESLUIT.GOEDGEKEURD
  });

  assert.equal(data.resultTier, 'independent');
});

test('sending it back reopens the step instead of finishing it', () => {
  const data = buildBeoordelingData({
    record: wachtendRecord(),
    besluit: NAKIJK_BESLUIT.OPNIEUW,
    opmerking: 'Noem ook het aantal tekens.'
  });

  assert.equal(data.completed, false);
  assert.equal(data.attemptStatus, 'open');
  assert.equal(data.resultTier, 'in_progress');
  assert.equal(data.teacherFeedbackSummary, 'Noem ook het aantal tekens.');
});

test('rejecting routes the step into the existing remediation flow', () => {
  const data = buildBeoordelingData({
    record: wachtendRecord(),
    besluit: NAKIJK_BESLUIT.AFGEKEURD
  });

  assert.equal(data.completed, true);
  assert.equal(data.isCorrect, false);
  assert.equal(data.resultTier, 'failed');
  assert.equal(data.attemptStatus, 'locked');
  assert.equal(data.teacherSignal, 'remediation_needed');
  assert.equal(data.attemptEntry.isCorrect, false);
});

test('an unknown decision is refused instead of silently writing something', () => {
  assert.throws(
    () => buildBeoordelingData({ record: wachtendRecord(), besluit: 'misschien' }),
    /Onbekend beoordelingsbesluit/
  );
});

test('an approved answer no longer reads as waiting for the teacher', () => {
  const record = wachtendRecord();
  const data = buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.GOEDGEKEURD });

  const opgeslagen = buildContentBlockVoortgangUpdate({
    userId: record.userId,
    blockId: record.blockId,
    paragraafId: record.paragraafId,
    hoofdstukId: record.hoofdstukId,
    klasId: record.klasId,
    data,
    existingData: record,
    timestamp: 1700000100000
  });

  assert.equal(opgeslagen.resultTier, 'guided');
  assert.equal(opgeslagen.attemptStatus, 'completed');
  assert.equal(opgeslagen.teacherReview.besluit, NAKIJK_BESLUIT.GOEDGEKEURD);
  // De pogingen van de leerling blijven staan; een beoordeling telt niet als poging.
  assert.equal(opgeslagen.attempts, 2);
  assert.deepEqual(opgeslagen.lastAnswer, record.lastAnswer);

  const stap = buildStapStatus({ block: { id: record.blockId, title: 'Open vraag' }, record: opgeslagen, index: 1 });
  assert.equal(stap.status, STAP_STATUS.AFGEROND);
});

test('a rejected answer reads as stuck, a returned answer as in progress', () => {
  const record = wachtendRecord();

  const afgekeurd = buildContentBlockVoortgangUpdate({
    userId: record.userId,
    blockId: record.blockId,
    paragraafId: record.paragraafId,
    klasId: record.klasId,
    data: buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.AFGEKEURD }),
    existingData: record,
    timestamp: 1700000100000
  });
  assert.equal(
    buildStapStatus({ block: { id: record.blockId }, record: afgekeurd }).status,
    STAP_STATUS.VASTGELOPEN
  );

  const teruggezet = buildContentBlockVoortgangUpdate({
    userId: record.userId,
    blockId: record.blockId,
    paragraafId: record.paragraafId,
    klasId: record.klasId,
    data: buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.OPNIEUW }),
    existingData: record,
    timestamp: 1700000100000
  });
  assert.equal(
    buildStapStatus({ block: { id: record.blockId }, record: teruggezet }).status,
    STAP_STATUS.BEZIG
  );
});

// --- Toets- en quizvragen: het antwoord staat in de subcollectie 'items' ---

const wachtendItemRecord = (extra = {}) => ({
  userId: 'leerling-1',
  blockId: 'blok-quiz',
  itemId: 'vraag-2',
  progressType: 'assessmentItem',
  paragraafId: 'para-1',
  hoofdstukId: 'hoofdstuk-1',
  klasId: 'klas-1',
  itemIndex: 1,
  attempts: 1,
  aiHelpCount: 0,
  completed: true,
  isCorrect: false,
  attemptStatus: 'pending_teacher_review',
  resultTier: 'pending_teacher_review',
  vraagTitle: 'Waarom deel je je wachtwoord niet?',
  questionPlainText: 'Waarom deel je je wachtwoord niet?',
  lastAnswer: { value: 'Dan kan iemand anders bij mijn spullen.' },
  updatedAt: 1700000000000,
  ...extra
});

const rijMetToets = ({ items = [wachtendItemRecord()], stapStatus = STAP_STATUS.NAKIJKEN, blokRecord = null } = {}) => ({
  studentId: 'leerling-1',
  student: { id: 'leerling-1' },
  studentNaam: 'Amira',
  klasId: 'klas-1',
  rapporten: [
    {
      paragraafId: 'para-1',
      paragraafLabel: '1.2 Veilig online',
      hoofdstukId: 'hoofdstuk-1',
      hoofdstukTitel: 'Digitaal veilig',
      stappen: [
        {
          blockId: 'blok-quiz',
          nummer: 8,
          titel: 'Afsluitquiz',
          type: 'quiz',
          typeLabel: 'Quiz',
          status: stapStatus,
          pogingen: 1,
          aiHulp: 0,
          laatsteActiviteitMs: 1700000000000,
          record: blokRecord,
          itemsNakijken: items.filter((item) => item.attemptStatus === 'pending_teacher_review').length,
          items: items.map((record, positie) => ({
            itemId: record.itemId,
            blockId: record.blockId,
            nummer: (record.itemIndex ?? positie) + 1,
            titel: record.vraagTitle,
            typeLabel: 'Vraag',
            status: record.attemptStatus === 'pending_teacher_review'
              ? STAP_STATUS.NAKIJKEN
              : STAP_STATUS.AFGEROND,
            pogingen: record.attempts || 0,
            aiHulp: record.aiHelpCount || 0,
            laatsteActiviteitMs: record.updatedAt || 0,
            record
          }))
        }
      ]
    }
  ]
});

test('een toetsvraag komt als eigen kaart in de stapel, met vraag en antwoord van de leerling', () => {
  const opdrachten = buildNakijkOpdrachten([rijMetToets()]);

  assert.equal(opdrachten.length, 1);
  assert.equal(opdrachten[0].blockId, 'blok-quiz');
  assert.equal(opdrachten[0].itemId, 'vraag-2');
  assert.equal(opdrachten[0].vraagNummer, 2);
  assert.equal(opdrachten[0].vraag, 'Waarom deel je je wachtwoord niet?');
  assert.deepEqual(opdrachten[0].antwoord, { value: 'Dan kan iemand anders bij mijn spullen.' });
  assert.equal(opdrachten[0].beoordeelbaar, true);
  assert.equal(opdrachten[0].blokkade, '');
  assert.equal(opdrachten[0].id, 'leerling-1__blok-quiz__vraag-2');
});

test('elke wachtende toetsvraag krijgt een eigen kaart, ook binnen hetzelfde blok', () => {
  const opdrachten = buildNakijkOpdrachten([
    rijMetToets({
      items: [
        wachtendItemRecord({ itemId: 'vraag-1', itemIndex: 0, updatedAt: 1690000000000 }),
        wachtendItemRecord()
      ]
    })
  ]);

  assert.deepEqual(opdrachten.map((opdracht) => opdracht.itemId), ['vraag-1', 'vraag-2']);
  assert.equal(new Set(opdrachten.map((opdracht) => opdracht.id)).size, 2);
});

test('een toetsvraag die al beoordeeld is verdwijnt uit de stapel', () => {
  const opdrachten = buildNakijkOpdrachten([
    rijMetToets({
      items: [wachtendItemRecord({ attemptStatus: 'completed', resultTier: 'independent', isCorrect: true })],
      stapStatus: STAP_STATUS.AFGEROND
    })
  ]);

  assert.deepEqual(opdrachten, []);
});

test('een toets zonder ingelezen itemantwoorden is niet beoordeelbaar en zegt waarom', () => {
  const rij = rijMetToets({ items: [] });
  rij.rapporten[0].stappen[0].record = {
    userId: 'leerling-1',
    blockId: 'blok-quiz',
    paragraafId: 'para-1',
    itemCount: 3,
    attemptStatus: 'pending_teacher_review'
  };

  const [opdracht] = buildNakijkOpdrachten([rij], { itemsBlokkade: 'Leesrechten ontbreken.' });

  assert.equal(opdracht.beoordeelbaar, false);
  assert.equal(opdracht.blokkade, 'Leesrechten ontbreken.');
});

test('een gewone open vraag blijft gewoon beoordeelbaar op blokniveau', () => {
  const [opdracht] = buildNakijkOpdrachten([rijMetWachtendeStap()]);

  assert.equal(opdracht.beoordeelbaar, true);
  assert.equal(opdracht.blokkade, '');
  assert.equal(opdracht.itemId, '');
});

test('een itemrecord zonder itemId kan niet beoordeeld worden', () => {
  assert.equal(isBeoordeelbaar(wachtendItemRecord()), true);
  assert.equal(isBeoordeelbaar(wachtendItemRecord({ itemId: '' })), false);
  assert.equal(isAssessmentItemRecord(wachtendItemRecord({ itemId: '' })), true);
  assert.equal(isAssessmentItemRecord({ blockId: 'blok-1' }), false);
});

test('een beoordeelde toetsvraag leest daarna als afgerond', () => {
  const record = wachtendItemRecord();
  const data = buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.GOEDGEKEURD, opmerking: 'Prima.' });

  const opgeslagen = buildAssessmentItemVoortgangUpdate({
    userId: record.userId,
    blockId: record.blockId,
    itemId: record.itemId,
    itemIndex: record.itemIndex,
    paragraafId: record.paragraafId,
    hoofdstukId: record.hoofdstukId,
    klasId: record.klasId,
    data,
    existingData: record,
    timestamp: 1700000100000
  });

  assert.equal(opgeslagen.attemptStatus, 'completed');
  assert.equal(opgeslagen.teacherReview.besluit, NAKIJK_BESLUIT.GOEDGEKEURD);
  assert.deepEqual(opgeslagen.lastAnswer, record.lastAnswer);
  assert.equal(buildItemStap({ record: opgeslagen }).status, STAP_STATUS.AFGEROND);
});

test('het toetsblok volgt de vragen: na de laatste beoordeling wacht het blok niet meer', () => {
  const record = wachtendItemRecord();
  const beoordeling = buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.GOEDGEKEURD });

  const blokstand = buildBlokstandNaBeoordeling({
    record,
    beoordeling,
    items: [{ id: 'vraag-1' }, { id: 'vraag-2' }],
    itemRecords: {
      'vraag-1': { completed: true, isCorrect: true, attemptStatus: 'completed', score: 1, maxScore: 1 },
      'vraag-2': record
    }
  });

  assert.equal(blokstand.completed, true);
  assert.equal(blokstand.isCorrect, true);
  assert.equal(blokstand.attemptStatus, 'completed');
  assert.equal(blokstand.teacherSignal, '');
  assert.equal(blokstand.itemsCompleted, 2);
  assert.equal(blokstand.itemsCorrect, 2);
});

test('het toetsblok blijft wachten zolang er nog een vraag open staat', () => {
  const record = wachtendItemRecord();
  const beoordeling = buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.GOEDGEKEURD });

  const blokstand = buildBlokstandNaBeoordeling({
    record,
    beoordeling,
    items: [{ id: 'vraag-1' }, { id: 'vraag-2' }],
    itemRecords: {
      'vraag-1': wachtendItemRecord({ itemId: 'vraag-1', itemIndex: 0 }),
      'vraag-2': record
    }
  });

  assert.equal(blokstand.attemptStatus, 'pending_teacher_review');
  assert.equal(blokstand.teacherSignal, 'ai_assessment_failed');
});

test('zonder bekende vragenlijst blijft het blokdocument onaangeroerd', () => {
  const record = wachtendItemRecord();

  assert.equal(
    buildBlokstandNaBeoordeling({
      record,
      beoordeling: buildBeoordelingData({ record, besluit: NAKIJK_BESLUIT.GOEDGEKEURD }),
      items: [],
      itemRecords: {}
    }),
    null
  );
});

test('beschrijfItemLeesfout benoemt rechten en index apart', () => {
  assert.match(beschrijfItemLeesfout({ code: 'permission-denied' }), /leesregel/);
  assert.match(beschrijfItemLeesfout({ code: 'failed-precondition' }), /index/);
  assert.match(beschrijfItemLeesfout(null), /niet worden opgehaald/);
});

test('van itemdocument tot nakijkkaart: de hele keten van het docentdashboard', () => {
  // Precies de vorm die de collectionGroup-listener oplevert: het document uit
  // voortgang/{uid}_{blockId}/items/{itemId}, met de documentnaam als itemId.
  const itemDocument = {
    id: 'vraag-2',
    itemId: 'vraag-2',
    userId: 'leerling-1',
    blockId: 'dv-1-1-quiz',
    progressType: 'assessmentItem',
    paragraafId: 'paragraaf-dv-1-1',
    hoofdstukId: 'hoofdstuk-dv-h1',
    klasId: 'klas-a',
    itemIndex: 1,
    attempts: 1,
    completed: true,
    isCorrect: false,
    attemptStatus: 'pending_teacher_review',
    resultTier: 'pending_teacher_review',
    vraagTitle: 'Wat doe je bij een verdachte mail?',
    questionPlainText: 'Wat doe je bij een verdachte mail?',
    lastAnswer: { value: 'Niet klikken en het melden bij de docent.' },
    updatedAt: 1700000000000
  };

  const paragraaf = {
    id: 'paragraaf-dv-1-1',
    code: '1.1',
    title: 'Veilig online',
    hoofdstukId: 'hoofdstuk-dv-h1'
  };
  const blocks = [
    { id: 'dv-1-1-theory', order: 1, type: 'theory', title: 'Lezen' },
    { id: 'dv-1-1-quiz', order: 2, type: 'quiz', title: 'Afsluitquiz' }
  ];

  const rijen = buildKlasVoortgangRijen({
    students: [{ id: 'leerling-1', displayName: 'Amira', klasId: 'klas-a' }],
    scopesByStudentId: {
      'leerling-1': { assignments: [{ paragraafId: paragraaf.id, paragraaf, blocks }] }
    },
    // Het blokdocument staat nog op "bezig"; de quiz is niet af.
    recordsByStudentId: {
      'leerling-1': [{
        userId: 'leerling-1',
        blockId: 'dv-1-1-quiz',
        paragraafId: paragraaf.id,
        attempts: 1,
        itemCount: 3,
        itemsCompleted: 1,
        updatedAt: 1700000000000
      }]
    },
    itemRecordsByStudentId: { 'leerling-1': [itemDocument] },
    contentBlocksByParagraaf: { [paragraaf.id]: blocks },
    now: 1700000500000
  });

  const opdrachten = buildNakijkOpdrachten(rijen);

  assert.equal(opdrachten.length, 1);
  assert.equal(opdrachten[0].itemId, 'vraag-2');
  assert.equal(opdrachten[0].vraagNummer, 2);
  assert.equal(opdrachten[0].stapNummer, 2);
  assert.equal(opdrachten[0].paragraafLabel, '1.1 Veilig online');
  assert.equal(opdrachten[0].vraag, 'Wat doe je bij een verdachte mail?');
  assert.deepEqual(opdrachten[0].antwoord, { value: 'Niet klikken en het melden bij de docent.' });
  assert.equal(opdrachten[0].beoordeelbaar, true);
  assert.deepEqual(telNakijkPerLeerling(opdrachten), { 'leerling-1': 1 });
});

test('een antwoord zonder klas krijgt geen actieve knoppen maar een reden', () => {
  const zonderKlas = wachtendItemRecord({ klasId: '' });

  assert.equal(isBeoordeelbaar(zonderKlas), false);
  assert.match(beoordeelBlokkade(zonderKlas), /geen klas/);
  assert.equal(beoordeelBlokkade(wachtendItemRecord()), '');
  assert.match(beoordeelBlokkade(null), /geen voortgangrecord/);
});

test('de kaart draagt de reden mee, zodat de knoppen uitgeschakeld getoond worden', () => {
  const [opdracht] = buildNakijkOpdrachten([
    rijMetToets({ items: [wachtendItemRecord({ klasId: '' })] })
  ]);

  assert.equal(opdracht.beoordeelbaar, false);
  assert.match(opdracht.blokkade, /geen klas/);
});
