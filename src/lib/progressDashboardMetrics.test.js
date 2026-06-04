import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildClassMetricCards,
  buildClassProgressMetrics,
  buildClassProgressSignalItems,
  buildDashboardLensTabs,
  buildKlasFilterOptions,
  buildStudentProgressSignalItems,
  filterStudentsByKlas,
  buildParagraphProgressSummary,
  buildStudentMetricCards,
  buildStudentProgressMetrics,
  getVisibleStudentProgressParagraphs,
  summarizeLearningQuality
} from './progressDashboardMetrics.js';

test('buildKlasFilterOptions exposes all option plus known classes with student counts', () => {
  const options = buildKlasFilterOptions({
    students: [
      { id: 's1', klasId: 'h1b', displayName: 'Ada' },
      { id: 's2', klasId: 'h1b', displayName: 'Bo' },
      { id: 's3', klasId: 'eoa', displayName: 'Cin' },
      { id: 's4', displayName: 'No class' }
    ],
    klassenMap: {
      h1b: { name: 'H1bk1' },
      eoa: { klasNaam: 'EOA' }
    }
  });

  assert.deepEqual(options, [
    { value: '', label: 'Alle klassen', count: 4 },
    { value: 'eoa', label: 'EOA', count: 1 },
    { value: 'h1b', label: 'H1bk1', count: 2 }
  ]);
});

test('filterStudentsByKlas limits class dashboard data to the selected class', () => {
  const students = [
    { id: 's1', klasId: 'h1b' },
    { id: 's2', klasId: 'eoa' },
    { id: 's3', klasId: 'h1b' }
  ];

  assert.deepEqual(filterStudentsByKlas(students, 'h1b').map((student) => student.id), ['s1', 's3']);
  assert.deepEqual(filterStudentsByKlas(students, '').map((student) => student.id), ['s1', 's2', 's3']);
});

test('summarizeLearningQuality counts independent, guided, failed and review records separately', () => {
  const quality = summarizeLearningQuality([
    { completed: true, isCorrect: true, aiHelpCount: 0, blockType: 'vraag' },
    { completed: true, isCorrect: true, aiHelpCount: 2, blockType: 'vraag' },
    { completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
    { completed: true, isCorrect: false, resultTier: 'pending_teacher_review', blockType: 'vraag' },
    { completed: true, blockType: 'theorie' }
  ]);

  assert.deepEqual(quality.counts, {
    independent: 1,
    guided: 1,
    failed: 1,
    pendingTeacherReview: 1,
    inProgress: 0
  });
  assert.equal(quality.questionRecordCount, 4);
  assert.equal(quality.signalCount, 2);
});

test('buildStudentProgressMetrics prioritizes teacher action over route percentage', () => {
  const metrics = buildStudentProgressMetrics({
    summary: {
      assignedItems: 10,
      startedItems: 8,
      completedItems: 7,
      percentage: 70,
      startedPercentage: 80
    },
    records: [
      { paragraafId: 'p1', completed: true, isCorrect: true, aiHelpCount: 0, blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', attempts: 4, maxAttempts: 4, blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', attempts: 4, maxAttempts: 4, blockType: 'vraag' }
    ]
  });

  assert.equal(metrics.route.label, '7/10 afgerond');
  assert.equal(metrics.nextAction.type, 'remediation');
  assert.equal(metrics.nextAction.label, 'Herstel begeleiden');
  assert.equal(metrics.attention.total, 1);
});

test('buildStudentProgressMetrics keeps not-started assigned work out of teacher signals', () => {
  const notStarted = buildStudentProgressMetrics({
    summary: {
      assignedItems: 5,
      startedItems: 0,
      completedItems: 0,
      percentage: 0,
      startedPercentage: 0
    },
    records: []
  });
  const completed = buildStudentProgressMetrics({
    summary: {
      assignedItems: 5,
      startedItems: 5,
      completedItems: 5,
      percentage: 100,
      startedPercentage: 100
    },
    records: [{ completed: true, isCorrect: true, aiHelpCount: 0, blockType: 'vraag' }]
  });

  assert.equal(notStarted.nextAction.type, 'continue');
  assert.equal(notStarted.attention.notStarted, 1);
  assert.equal(notStarted.attention.total, 0);
  assert.equal(completed.nextAction.type, 'continue');
  assert.equal(completed.attention.total, 0);
});

test('buildStudentProgressMetrics only flags remediation after more than forty percent failed in a paragraph', () => {
  const oneLooseMistake = buildStudentProgressMetrics({
    summary: { assignedItems: 5, startedItems: 2, completedItems: 2, percentage: 40 },
    records: [
      { paragraafId: 'p1', completed: true, isCorrect: true, resultTier: 'independent', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' }
    ]
  });

  const belowThreshold = buildStudentProgressMetrics({
    summary: { assignedItems: 5, startedItems: 5, completedItems: 5, percentage: 100 },
    records: [
      { paragraafId: 'p1', completed: true, isCorrect: true, resultTier: 'independent', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: true, resultTier: 'guided', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' }
    ]
  });

  const aboveThreshold = buildStudentProgressMetrics({
    summary: { assignedItems: 5, startedItems: 5, completedItems: 5, percentage: 100 },
    records: [
      { paragraafId: 'p1', completed: true, isCorrect: true, resultTier: 'independent', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' }
    ]
  });

  assert.equal(oneLooseMistake.attention.failed, 0);
  assert.equal(oneLooseMistake.attention.total, 0);
  assert.equal(belowThreshold.attention.failed, 0);
  assert.equal(aboveThreshold.attention.failed, 1);
  assert.equal(aboveThreshold.nextAction.type, 'remediation');
});

test('buildClassProgressMetrics counts unique attention students and keeps median progress visible', () => {
  const students = [
    { id: 's1', displayName: 'Ada' },
    { id: 's2', displayName: 'Bo' },
    { id: 's3', displayName: 'Cin' }
  ];
  const metrics = buildClassProgressMetrics({
    students,
    summariesByStudentId: {
      s1: { assignedItems: 10, startedItems: 10, completedItems: 9, percentage: 90, startedPercentage: 100 },
      s2: { assignedItems: 10, startedItems: 5, completedItems: 5, percentage: 50, startedPercentage: 50 },
      s3: { assignedItems: 10, startedItems: 0, completedItems: 0, percentage: 0, startedPercentage: 0 }
    },
    recordsByStudentId: {
      s1: [
        { paragraafId: 'p1', completed: true, isCorrect: true, resultTier: 'independent', blockType: 'vraag' },
        { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
        { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' }
      ],
      s2: [{ completed: true, isCorrect: true, aiHelpCount: 1, blockType: 'vraag' }],
      s3: []
    }
  });

  assert.equal(metrics.attention.studentCount, 1);
  assert.equal(metrics.attention.recordCount, 1);
  assert.equal(metrics.progress.averagePercentage, 47);
  assert.equal(metrics.progress.medianPercentage, 50);
  assert.equal(metrics.progress.belowFortyCount, 1);
  assert.deepEqual(metrics.quality.counts, {
    independent: 1,
    guided: 1,
    failed: 2,
    pendingTeacherReview: 0,
    inProgress: 0
  });
});

test('buildStudentProgressSignalItems creates stable teacher-facing signal rows', () => {
  const signals = buildStudentProgressSignalItems({
    student: { id: 's1', displayName: 'Ada Lovelace', klasId: 'h1b' },
    summary: { assignedItems: 5, startedItems: 5, completedItems: 5, percentage: 100 },
    records: [
      { id: 'r1', paragraafId: 'p1', paragraafTitle: '1.1 Start', completed: true, isCorrect: true, resultTier: 'independent', blockType: 'vraag' },
      { id: 'r2', paragraafId: 'p1', paragraafTitle: '1.1 Start', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
      { id: 'r3', paragraafId: 'p1', paragraafTitle: '1.1 Start', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
      { id: 'r4', paragraafId: 'p1', paragraafTitle: '1.1 Start', completed: true, resultTier: 'pending_teacher_review', blockTitle: 'Open vraag', blockType: 'vraag' },
      { id: 'r5', paragraafId: 'p2', completed: false, attempts: 3, maxAttempts: 4, blockTitle: 'Sleepvraag', blockType: 'vraag' }
    ]
  });

  assert.deepEqual(signals.map((signal) => signal.type), ['failedParagraph', 'teacherReview', 'stuck']);
  assert.equal(signals[0].id, 'progressSignal__s1__failedParagraph__p1');
  assert.equal(signals[0].studentName, 'Ada Lovelace');
  assert.equal(signals[1].label, 'Antwoord beoordelen');
  assert.equal(signals[2].detail, 'Sleepvraag: 3 pogingen');
});

test('buildClassProgressSignalItems filters globally acknowledged signals', () => {
  const openSignals = buildClassProgressSignalItems({
    students: [{ id: 's1', displayName: 'Ada' }],
    summariesByStudentId: {
      s1: { assignedItems: 4, startedItems: 4, completedItems: 4, percentage: 100 }
    },
    recordsByStudentId: {
      s1: [
        { id: 'r1', paragraafId: 'p1', completed: true, resultTier: 'pending_teacher_review', blockType: 'vraag' },
        { id: 'r2', paragraafId: 'p1', completed: false, attempts: 3, blockType: 'vraag' }
      ]
    },
    acknowledgedSignalIds: ['progressSignal__s1__teacherReview__r1']
  });

  assert.deepEqual(openSignals.map((signal) => signal.id), ['progressSignal__s1__stuck__r2']);
});

test('buildClassMetricCards turns class metrics into the three teacher-facing top blocks', () => {
  const cards = buildClassMetricCards({
    attention: { studentCount: 3, recordCount: 5 },
    progress: { averagePercentage: 64, medianPercentage: 70, belowFortyCount: 2 },
    quality: {
      questionRecordCount: 12,
      counts: {
        independent: 6,
        guided: 3,
        failed: 2,
        pendingTeacherReview: 1,
        inProgress: 0
      }
    }
  });

  assert.deepEqual(cards.map((card) => card.label), ['Nu aandacht', 'Klasbeheersing', 'Lesvoortgang']);
  assert.equal(cards[0].value, '3');
  assert.equal(cards[1].value, '6/12');
  assert.equal(cards[1].detail, '3 met Digidocent, 5 signalen');
  assert.equal(cards[2].detail, 'Gem. 64%, 2 onder 40%');
});

test('buildStudentMetricCards turns student metrics into next action, route and quality cards', () => {
  const cards = buildStudentMetricCards({
    nextAction: { type: 'review', label: 'Antwoord beoordelen', priority: 2 },
    attention: { total: 2 },
    route: { completedItems: 7, assignedItems: 10, percentage: 70, label: '7/10 afgerond' },
    quality: {
      questionRecordCount: 8,
      counts: {
        independent: 4,
        guided: 2,
        failed: 1,
        pendingTeacherReview: 1,
        inProgress: 0
      }
    }
  });

  assert.deepEqual(cards.map((card) => card.label), ['Volgende actie', 'Routepositie', 'Leerkwaliteit']);
  assert.equal(cards[0].value, 'Antwoord beoordelen');
  assert.equal(cards[1].value, '7/10');
  assert.equal(cards[2].detail, '2 met Digidocent, 2 signalen');
});

test('buildDashboardLensTabs exposes the four teacher lenses with one active tab', () => {
  const tabs = buildDashboardLensTabs('signals');

  assert.deepEqual(tabs.map((tab) => tab.key), ['class', 'signals', 'paragraph', 'student']);
  assert.deepEqual(tabs.map((tab) => tab.label), ['Klas', 'Signalen', 'Paragraaf', 'Leerling']);
  assert.deepEqual(tabs.map((tab) => tab.active), [false, true, false, false]);
});

test('buildParagraphProgressSummary summarizes paragraph status without exposing raw records', () => {
  const summary = buildParagraphProgressSummary({
    summary: { assignedItems: 4, startedItems: 4, completedItems: 3, percentage: 75 },
    paragraafId: 'p1',
    records: [
      { paragraafId: 'p1', completed: true, isCorrect: true, aiHelpCount: 0, blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
      { paragraafId: 'p1', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' },
      { paragraafId: 'p2', completed: true, isCorrect: false, resultTier: 'failed', blockType: 'vraag' }
    ]
  });

  assert.equal(summary.statusLabel, 'Herstel nodig');
  assert.equal(summary.signalCount, 1);
  assert.equal(summary.evidenceCount, 3);
  assert.equal(summary.qualityLabel, '1 zelfstandig, 0 met Digidocent');
});

test('getVisibleStudentProgressParagraphs hides paragraphs without assigned work for the selected student', () => {
  const visible = getVisibleStudentProgressParagraphs({
    paragraphen: [
      { id: 'p1', title: 'Niet opengezet' },
      { id: 'p2', title: 'Wel opengezet' },
      { id: 'p3', title: 'Geen blokken' }
    ],
    summariesByParagraafId: {
      p1: { assignedItems: 0 },
      p2: { assignedItems: 3 },
      p3: { assignedItems: 0 }
    }
  });

  assert.deepEqual(visible.map((paragraaf) => paragraaf.id), ['p2']);
});
