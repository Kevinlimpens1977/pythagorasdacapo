import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NAKIJK_BESLUIT,
  buildBeoordelingData,
  buildNakijkOpdrachten,
  getModelAntwoord,
  getVraagTekst,
  isBeoordeelbaar,
  telNakijkPerLeerling
} from './nakijkOpdrachten.js';
import { STAP_STATUS } from './klasVoortgangOverzicht.js';
import { buildStapStatus } from './klasVoortgangOverzicht.js';
import { buildContentBlockVoortgangUpdate } from './voortgangPayload.js';

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
