import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLearningGoalsIntro,
  buildStudyStepModel,
  deriveLearningGoalsFromBlocks,
  formatStudyDuration,
  getReadConfirmLabels,
  hasLearningGoalsIntroContent,
  isStudyRoutePath,
  mergeCompletedBlockIds,
  requiresReadConfirmation,
  shouldOpenLearningGoalsIntro,
  summarizeStudySteps
} from './studyRouteState.js';

const labels = { theory: 'Theorie', question: 'Vraag', summary: 'Samenvatting' };

const blocks = [
  { id: 'b1', type: 'theory', title: 'Wat is een cel?' },
  { id: 'b2', type: 'question', title: 'Vraag 1' },
  { id: 'b3', type: 'summary', title: 'Kort samengevat' }
];

test('leesblokken vragen om een expliciete bevestiging, vragen en games niet', () => {
  assert.equal(requiresReadConfirmation({ type: 'theory' }), true);
  assert.equal(requiresReadConfirmation({ type: 'example' }), true);
  assert.equal(requiresReadConfirmation({ type: 'summary' }), true);
  assert.equal(requiresReadConfirmation({ type: 'media' }), true);
  assert.equal(requiresReadConfirmation({ type: 'question' }), false);
  assert.equal(requiresReadConfirmation({ type: 'game' }), false);
  assert.equal(requiresReadConfirmation({ type: 'slidedeck' }), false);
  assert.equal(requiresReadConfirmation(null), false);
});

test('elk leesbloktype heeft een eigen knoptekst en bevestigingstekst', () => {
  assert.equal(getReadConfirmLabels('theory').action, 'Ik heb het gelezen');
  assert.equal(getReadConfirmLabels('theory').done, 'Theorie afgerond!');
  assert.equal(getReadConfirmLabels('summary').done, 'Samenvatting afgerond!');
  assert.equal(getReadConfirmLabels('onbekend').action, 'Ik ben hier klaar mee');
  assert.match(getReadConfirmLabels('media').hint, /kijken/);
  assert.match(getReadConfirmLabels('theory').hint, /lezen/);
});

test('mergeCompletedBlockIds voegt server- en lokale bevestigingen samen', () => {
  const merged = mergeCompletedBlockIds(new Set(['b1']), new Set(['b2', '']), null);
  assert.equal(merged.has('b1'), true);
  assert.equal(merged.has('b2'), true);
  assert.equal(merged.has(''), false);
  assert.equal(merged.size, 2);
});

test('geen enkele stap zit op slot: de leerling mag vrij vooruit en terug', () => {
  const steps = buildStudyStepModel({ blocks, completedIds: new Set(['b1']), currentIndex: 0, labels });

  assert.equal(steps.length, 3);
  assert.deepEqual(
    steps.map((step) => [step.number, step.title, step.typeLabel, step.isActive, step.isDone, step.isTodo]),
    [
      [1, 'Wat is een cel?', 'Theorie', true, true, false],
      [2, 'Vraag 1', 'Vraag', false, false, true],
      [3, 'Kort samengevat', 'Samenvatting', false, false, true]
    ]
  );
  assert.equal(
    steps.some((step) => 'isLocked' in step || 'lockReason' in step),
    false
  );
});

test('buildStudyStepModel valt terug op het typelabel als een blok geen titel heeft', () => {
  const steps = buildStudyStepModel({ blocks: [{ id: 'x', type: 'theory' }], labels });
  assert.equal(steps[0].title, 'Theorie');
});

test('summarizeStudySteps telt de afgeronde stappen', () => {
  const steps = buildStudyStepModel({ blocks, completedIds: new Set(['b1', 'b2']), currentIndex: 2, labels });
  assert.deepEqual(summarizeStudySteps(steps), { total: 3, done: 2, percentage: 67 });
  assert.deepEqual(summarizeStudySteps([]), { total: 0, done: 0, percentage: 0 });
});

test('buildLearningGoalsIntro gebruikt de leerdoelen uit de paragraafmetadata', () => {
  const intro = buildLearningGoalsIntro({
    paragraaf: { learningGoals: 'Je weet wat een cel is.\nJe herkent een celkern.', estimatedMinutes: '45' },
    blocks,
    labels
  });

  assert.equal(intro.kind, 'goals');
  assert.equal(intro.heading, 'Wat je gaat leren:');
  assert.deepEqual(intro.items, ['Je weet wat een cel is.', 'Je herkent een celkern.']);
  assert.equal(intro.estimatedMinutes, 45);
  assert.equal(intro.stepCount, 3);
});

test('zonder leerdoelen leidt het startscherm korte "Je leert ..."-zinnen af', () => {
  const intro = buildLearningGoalsIntro({ paragraaf: {}, blocks });

  assert.equal(intro.kind, 'derived');
  assert.equal(intro.heading, 'Wat je gaat leren:');
  // Een theorietitel die zelf een vraag is, krijgt ook de vraagformulering:
  // "Je leert meer over wat is een cel" zou geen Nederlands zijn.
  assert.deepEqual(intro.items, [
    'Je leert antwoord geven op: Wat is een cel?',
    'Je leert meer over kort samengevat.'
  ]);
  assert.equal(intro.stepCount, 3);
});

test('afgeleide doelen: onderwerp eerst, vragen daarna, hooguit drie, nooit een stappenlijst', () => {
  const goals = deriveLearningGoalsFromBlocks([
    { id: 'a', type: 'question', title: 'Wat zit er in je digitale schooltas?' },
    { id: 'b', type: 'theory', title: '1.1 Mijn digitale schooltas' },
    { id: 'c', type: 'theory', title: 'Vraag 2' },
    { id: 'd', type: 'summary', title: 'Bestanden ordenen' },
    { id: 'e', type: 'example', title: 'Zoeken in je schijf' },
    { id: 'f', type: 'theory', title: 'Wachtwoorden' }
  ]);

  assert.deepEqual(goals, [
    'Je leert meer over mijn digitale schooltas.',
    'Je leert meer over bestanden ordenen.',
    'Je leert meer over zoeken in je schijf.'
  ]);
});

test('afgeleide doelen vallen terug op vraagtitels en slaan dubbele titels over', () => {
  const goals = deriveLearningGoalsFromBlocks([
    { id: 'a', type: 'question', title: 'Wat zit er in je digitale schooltas?' },
    { id: 'b', type: 'question', title: 'Wat zit er in je digitale schooltas' },
    { id: 'c', type: 'question', title: 'Vraag 3' }
  ]);

  assert.deepEqual(goals, ['Je leert antwoord geven op: Wat zit er in je digitale schooltas?']);
});

test('een paragraaf zonder doelen en zonder bruikbare titels opent geen startscherm', () => {
  const intro = buildLearningGoalsIntro({ paragraaf: {}, blocks: [] });

  assert.equal(hasLearningGoalsIntroContent(intro), false);
  assert.equal(shouldOpenLearningGoalsIntro({ intro }), false);
  assert.equal(
    hasLearningGoalsIntroContent(
      buildLearningGoalsIntro({ paragraaf: {}, blocks: [{ id: 'x', type: 'theory', title: 'Theorie 1' }] })
    ),
    false
  );
});

test('het startscherm opent één keer en niet boven de paragraafafsluiting', () => {
  const intro = buildLearningGoalsIntro({ paragraaf: { leerdoelen: ['Doel'] }, blocks });

  assert.equal(shouldOpenLearningGoalsIntro({ intro }), true);
  assert.equal(shouldOpenLearningGoalsIntro({ intro, alreadyOpened: true }), false);
  assert.equal(shouldOpenLearningGoalsIntro({ intro, paragraphEndVisible: true }), false);
});

test('formatStudyDuration schrijft minuten en uren uit', () => {
  assert.equal(formatStudyDuration(0), '');
  assert.equal(formatStudyDuration(45), '45 min');
  assert.equal(formatStudyDuration(60), '1 uur');
  assert.equal(formatStudyDuration(95), '1 uur 35 min');
});

test('alleen de paragraafroute telt als studeerroute', () => {
  assert.equal(isStudyRoutePath('/chapter/abc123'), true);
  assert.equal(isStudyRoutePath('/chapter/abc123?preview=concept'), true);
  assert.equal(isStudyRoutePath('chapter/abc123'), true);
  assert.equal(isStudyRoutePath('/'), false);
  assert.equal(isStudyRoutePath('/chapter'), false);
  assert.equal(isStudyRoutePath('/chapter/'), false);
  assert.equal(isStudyRoutePath('/admin/lesstof'), false);
  assert.equal(isStudyRoutePath(''), false);
  assert.equal(isStudyRoutePath(undefined), false);
});
