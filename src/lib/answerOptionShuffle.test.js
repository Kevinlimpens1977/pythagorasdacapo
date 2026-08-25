import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildOptionShuffleSeed,
  hashSeed,
  looksLikeTrueFalseOptions,
  seededShuffle,
  shuffleAnswerOptions,
  withStableOptionIds,
  SHUFFLE_EXEMPT_QUESTION_TYPES
} from './answerOptionShuffle.js';
import {
  buildAssessmentItemExplanationFeedback,
  gradeAssessmentItemAnswer
} from './assessmentItemGrading.js';
import { buildQuestionExplanationFeedback } from './answerExplanationFeedback.js';
import { gradeQuestionAnswer } from './questionGrading.js';
import { buildQuestionPreviewModel } from './questionPreviewUtils.js';

// Precies het patroon uit hoofdstuk 1: het juiste antwoord is de langste optie
// en staat achteraan. Zonder schudden is dat een gratis cue.
const opties = [
  {
    id: 'optie-1',
    text: 'Op het bureaublad.',
    correct: false,
    misconception: 'Denkt dat een bestand vanzelf meereist met de leerling.'
  },
  {
    id: 'optie-2',
    text: 'Op een USB-stick in je etui.',
    correct: false,
    misconception: 'Vertrouwt op een stick die je kunt vergeten of verliezen.'
  },
  {
    id: 'optie-3',
    text: 'In je OneDrive van je schoolaccount.',
    correct: false,
    misconception: 'Kijkt naar de plek, niet naar het meereizen.'
  },
  {
    id: 'optie-4',
    text: 'In je OneDrive, want dan kun je er op elk apparaat bij waar je inlogt.',
    correct: true,
    explanation: 'Wat in OneDrive staat, staat op elk apparaat waar je inlogt.'
  }
];

const textsOf = (options = []) => options.map((option) => option.text);

const shuffleFor = (studentId, extra = {}) =>
  shuffleAnswerOptions({
    options: opties,
    questionType: 'meerkeuze',
    seed: buildOptionShuffleSeed({ studentId, blockId: 'blok-1', questionId: 'vraag-1', ...extra })
  });

test('dezelfde leerling ziet bij dezelfde vraag altijd dezelfde volgorde', () => {
  const eerst = shuffleFor('leerling-aisha');
  const nogEens = shuffleFor('leerling-aisha');
  const naVerversen = shuffleFor('leerling-aisha');

  assert.deepEqual(textsOf(nogEens), textsOf(eerst));
  assert.deepEqual(textsOf(naVerversen), textsOf(eerst));
});

test('twee leerlingen naast elkaar zien niet allemaal dezelfde volgorde', () => {
  const referentie = textsOf(shuffleFor('leerling-1')).join('|');
  const anderen = ['leerling-2', 'leerling-3', 'leerling-4', 'leerling-5', 'leerling-6']
    .map((uid) => textsOf(shuffleFor(uid)).join('|'));

  assert.ok(
    anderen.some((volgorde) => volgorde !== referentie),
    'geen enkele andere leerling kreeg een afwijkende volgorde'
  );
});

test('twee vragen van dezelfde leerling krijgen niet gegarandeerd dezelfde volgorde', () => {
  const vraagEen = textsOf(shuffleFor('leerling-aisha', { questionId: 'vraag-1' })).join('|');
  const anderevragen = ['vraag-2', 'vraag-3', 'vraag-4', 'vraag-5']
    .map((questionId) => textsOf(shuffleFor('leerling-aisha', { questionId })).join('|'));

  assert.ok(anderevragen.some((volgorde) => volgorde !== vraagEen));
});

test('de langste optie staat niet bij iedere leerling achteraan', () => {
  const posities = new Set(
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((uid) =>
      shuffleFor(`leerling-${uid}`).findIndex((option) => option.id === 'optie-4')
    )
  );

  assert.ok(posities.size > 1, 'het juiste antwoord belandde bij iedereen op dezelfde plek');
});

test('schudden is een permutatie: er verdwijnt of verdubbelt niets', () => {
  const geschud = shuffleFor('leerling-aisha');

  assert.equal(geschud.length, opties.length);
  assert.deepEqual(
    [...textsOf(geschud)].sort(),
    [...textsOf(opties)].sort()
  );
  // De bronlijst blijft ongemoeid; de beoordelingslaag leest die verderop nog.
  assert.deepEqual(textsOf(opties), [
    'Op het bureaublad.',
    'Op een USB-stick in je etui.',
    'In je OneDrive van je schoolaccount.',
    'In je OneDrive, want dan kun je er op elk apparaat bij waar je inlogt.'
  ]);
});

test('waar-niet-waar blijft ongeschud: Waar hoort boven Niet waar', () => {
  const waarNietWaar = [
    { id: 'optie-1', text: 'Waar', correct: true },
    { id: 'optie-2', text: 'Niet waar', correct: false }
  ];

  ['leerling-1', 'leerling-2', 'leerling-3', 'leerling-4', 'leerling-5'].forEach((uid) => {
    const getoond = shuffleAnswerOptions({
      options: waarNietWaar,
      questionType: 'waar-niet-waar',
      seed: buildOptionShuffleSeed({ studentId: uid, questionId: 'vraag-wnw' })
    });
    assert.deepEqual(textsOf(getoond), ['Waar', 'Niet waar']);
  });

  assert.ok(SHUFFLE_EXEMPT_QUESTION_TYPES.has('waar-niet-waar'));
});

test('een meerkeuzevraag met alleen Waar en Niet waar blijft ook staan', () => {
  const alsMeerkeuze = [
    { id: 'optie-1', text: 'Waar' },
    { id: 'optie-2', text: 'Niet waar.' }
  ];

  ['leerling-1', 'leerling-2', 'leerling-3', 'leerling-4', 'leerling-5'].forEach((uid) => {
    const getoond = shuffleAnswerOptions({
      options: alsMeerkeuze,
      questionType: 'meerkeuze',
      seed: buildOptionShuffleSeed({ studentId: uid, questionId: 'vraag-wnw' })
    });
    assert.deepEqual(textsOf(getoond), ['Waar', 'Niet waar.']);
  });

  assert.equal(looksLikeTrueFalseOptions(alsMeerkeuze), true);
  assert.equal(looksLikeTrueFalseOptions(opties), false);
});

test('zonder leerling blijft de auteursvolgorde staan (docentpreview, digibord)', () => {
  assert.equal(buildOptionShuffleSeed({ studentId: '', questionId: 'vraag-1' }), '');
  assert.equal(buildOptionShuffleSeed({ studentId: 'leerling-1', questionId: '' }), '');

  const getoond = shuffleAnswerOptions({
    options: opties,
    questionType: 'meerkeuze',
    seed: buildOptionShuffleSeed({ studentId: '', questionId: 'vraag-1' })
  });

  assert.deepEqual(textsOf(getoond), textsOf(opties));
});

test('een vraag met een of geen optie blijft ongemoeid', () => {
  assert.deepEqual(shuffleAnswerOptions({ options: [], questionType: 'meerkeuze', seed: 'x' }), []);
  assert.equal(
    shuffleAnswerOptions({
      options: [{ id: 'optie-1', text: 'Enige optie' }],
      questionType: 'meerkeuze',
      seed: 'x'
    }).length,
    1
  );
});

test('een optie zonder id houdt het id van zijn oorspronkelijke plek', () => {
  const zonderIds = [
    { text: 'Eerste' },
    { text: 'Tweede' },
    { text: 'Derde' },
    { text: 'Vierde' }
  ];

  assert.deepEqual(
    withStableOptionIds(zonderIds).map((option) => option.id),
    ['option-1', 'option-2', 'option-3', 'option-4']
  );

  const geschud = shuffleAnswerOptions({
    options: zonderIds,
    questionType: 'meerkeuze',
    seed: buildOptionShuffleSeed({ studentId: 'leerling-aisha', questionId: 'vraag-1' })
  });

  // Het id blijft bij dezelfde tekst horen, ook al staat die ergens anders.
  geschud.forEach((option) => {
    const positie = Number(option.id.replace('option-', '')) - 1;
    assert.equal(option.text, zonderIds[positie].text);
    assert.equal(option.originalIndex, positie);
  });
});

test('hashSeed en seededShuffle zijn deterministisch en seed-gevoelig', () => {
  assert.equal(hashSeed('leerling::vraag'), hashSeed('leerling::vraag'));
  assert.notEqual(hashSeed('leerling-a::vraag'), hashSeed('leerling-b::vraag'));

  const letters = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(seededShuffle(letters, 'zaad'), seededShuffle(letters, 'zaad'));
  assert.deepEqual(letters, ['a', 'b', 'c', 'd', 'e']);
});

// --- Het beoordeelpad: matchen op ID, niet op positie -----------------------

test('een toetsitem wordt op id nagekeken, niet op de plek waar de optie stond', () => {
  const item = {
    id: 'item-1',
    type: 'meerkeuze',
    prompt: 'Waar zet je je werk neer?',
    answer: { type: 'meerkeuze', options: opties },
    options: opties
  };

  ['leerling-a', 'leerling-b', 'leerling-c', 'leerling-d'].forEach((uid) => {
    const getoond = shuffleAnswerOptions({
      options: item.options,
      questionType: item.type,
      seed: buildOptionShuffleSeed({ studentId: uid, blockId: 'blok-1', questionId: item.id })
    });

    // De leerling klikt de optie aan die bij HEM bovenaan staat.
    const bovenste = getoond[0];
    const oordeel = gradeAssessmentItemAnswer({ item, answer: bovenste.id });

    assert.equal(oordeel.canGrade, true);
    // Goed is alleen goed als de aangeklikte optie echt de juiste is.
    assert.equal(oordeel.isCorrect, bovenste.id === 'optie-4');

    // En het juiste antwoord aanklikken blijft goed, waar het ook staat.
    assert.equal(gradeAssessmentItemAnswer({ item, answer: 'optie-4' }).isCorrect, true);
  });
});

test('een losse vraag wordt op id nagekeken, ook als de opties geschud getoond worden', () => {
  const vraag = { id: 'vraag-1', vraagtype: 'meerkeuze', antwoord: { type: 'meerkeuze', options: opties } };
  const preview = buildQuestionPreviewModel(vraag);

  ['leerling-a', 'leerling-b', 'leerling-c', 'leerling-d'].forEach((uid) => {
    const getoond = shuffleAnswerOptions({
      options: vraag.antwoord.options,
      questionType: vraag.vraagtype,
      seed: buildOptionShuffleSeed({ studentId: uid, questionId: vraag.id })
    });
    const bovenste = getoond[0];

    // De leerlingroute bewaart de keuze als `{ optie-id: true }` - dat is ook
    // precies wat er in de voortgang (lastAnswer) terechtkomt.
    const lastAnswer = { [bovenste.id]: true };
    const oordeel = gradeQuestionAnswer({ vraag, preview, answers: lastAnswer });

    assert.equal(oordeel.canGrade, true);
    assert.equal(oordeel.isCorrect, bovenste.id === 'optie-4');

    // De deelstatussen dragen de id's van de bronlijst, in de bronvolgorde:
    // de nakijkstapel van de docent leest dus nooit een geschudde positie.
    assert.deepEqual(oordeel.parts.map((part) => part.id), ['optie-1', 'optie-2', 'optie-3', 'optie-4']);
  });
});

test('de opgeslagen keuze blijft bruikbaar als de volgorde later anders valt', () => {
  const vraag = { id: 'vraag-1', vraagtype: 'meerkeuze', antwoord: { type: 'meerkeuze', options: opties } };
  const preview = buildQuestionPreviewModel(vraag);
  // Wat de voortgang bewaart is een id, geen index. Een tweede sessie met een
  // andere volgorde (of helemaal geen schudden) leest hem dus nog goed terug.
  const bewaard = { 'optie-4': true };

  assert.equal(gradeQuestionAnswer({ vraag, preview, answers: bewaard }).isCorrect, true);

  const getoond = shuffleAnswerOptions({
    options: vraag.antwoord.options,
    questionType: 'meerkeuze',
    seed: buildOptionShuffleSeed({ studentId: 'leerling-aisha', questionId: 'vraag-1' })
  });
  const aangevinkt = getoond.filter((option) => bewaard[option.id] === true);

  assert.deepEqual(textsOf(aangevinkt), ['In je OneDrive, want dan kun je er op elk apparaat bij waar je inlogt.']);
});

// --- De uitleg blijft bij de juiste optie horen ------------------------------

test('de uitleg hoort na het schudden nog steeds bij de optie die de leerling aanwees', () => {
  const vraag = { id: 'vraag-1', vraagtype: 'meerkeuze', antwoord: { type: 'meerkeuze', options: opties } };

  ['leerling-a', 'leerling-b', 'leerling-c', 'leerling-d'].forEach((uid) => {
    const getoond = shuffleAnswerOptions({
      options: vraag.antwoord.options,
      questionType: 'meerkeuze',
      seed: buildOptionShuffleSeed({ studentId: uid, questionId: vraag.id })
    });

    getoond.forEach((getoondeOptie) => {
      const bron = opties.find((option) => option.id === getoondeOptie.id);
      const feedback = buildQuestionExplanationFeedback({
        vraag,
        answers: { [getoondeOptie.id]: true },
        isCorrect: bron.correct === true
      });

      assert.deepEqual(
        feedback.chosen,
        [bron.correct ? bron.explanation : bron.misconception],
        `verkeerde uitleg bij ${getoondeOptie.text}`
      );
    });
  });
});

test('een toetsitem geeft na het schudden de uitleg van de aangeklikte optie', () => {
  const item = {
    id: 'item-1',
    type: 'meerkeuze',
    answer: { type: 'meerkeuze', options: opties }
  };

  const getoond = shuffleAnswerOptions({
    options: opties,
    questionType: item.type,
    seed: buildOptionShuffleSeed({ studentId: 'leerling-aisha', blockId: 'blok-1', questionId: item.id })
  });

  getoond.forEach((getoondeOptie) => {
    const bron = opties.find((option) => option.id === getoondeOptie.id);
    const feedback = buildAssessmentItemExplanationFeedback({
      item,
      answer: getoondeOptie.id,
      isCorrect: bron.correct === true
    });

    assert.deepEqual(feedback.chosen, [bron.correct ? bron.explanation : bron.misconception]);
  });
});
