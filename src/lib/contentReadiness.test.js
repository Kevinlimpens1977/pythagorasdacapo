import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONTENT_BLOCK_STATUSES,
  getContentBlockStatusLabel,
  normalizeContentBlockStatus,
  validateContentBlockReadiness,
  validateParagraphReadiness
} from './contentReadiness.js';

test('content readiness normalizes the full status model', () => {
  assert.deepEqual(CONTENT_BLOCK_STATUSES, ['draft', 'needs_review', 'ready', 'published', 'archived']);
  assert.equal(normalizeContentBlockStatus('published'), 'published');
  assert.equal(normalizeContentBlockStatus('needs_review'), 'needs_review');
  assert.equal(normalizeContentBlockStatus('bad-value'), 'draft');
  assert.equal(normalizeContentBlockStatus(''), 'draft');
  assert.equal(getContentBlockStatusLabel('needs_review'), 'Review nodig');
});

test('theory and summary blocks need visible text before publication', () => {
  const emptyTheory = validateContentBlockReadiness({
    type: 'theory',
    status: 'published',
    content: { html: '<p>   </p>' }
  });

  assert.equal(emptyTheory.canPublish, false);
  assert.deepEqual(emptyTheory.errors.map((issue) => issue.code), ['content_missing']);

  const readySummary = validateContentBlockReadiness({
    type: 'summary',
    status: 'published',
    content: { html: '<p>Drie stappen: lees, bereken, controleer.</p>' }
  });

  assert.equal(readySummary.canPublish, true);
  assert.deepEqual(readySummary.errors, []);
});

test('question blocks need a valid linked question and answer contract before publication', () => {
  const missingQuestion = validateContentBlockReadiness({
    type: 'question',
    status: 'published',
    linkedVraagId: ''
  });

  assert.equal(missingQuestion.canPublish, false);
  assert.deepEqual(missingQuestion.errors.map((issue) => issue.code), ['question_missing']);

  const unavailableQuestion = validateContentBlockReadiness({
    type: 'question',
    status: 'published',
    linkedVraagId: 'vraag-vermist'
  });

  assert.equal(unavailableQuestion.canPublish, false);
  assert.deepEqual(unavailableQuestion.errors.map((issue) => issue.code), ['question_unavailable']);

  const readyQuestion = validateContentBlockReadiness({
    type: 'question',
    status: 'published',
    linkedVraagId: 'vraag-1',
    linkedVraag: {
      id: 'vraag-1',
      status: 'published',
      vraagtype: 'open',
      content: { text: '<p>Leg uit wat een sterk wachtwoord is.</p>' },
      antwoord: { type: 'open', modelAnswer: 'Een sterk wachtwoord is lang, uniek en moeilijk te raden.' }
    }
  });

  assert.equal(readyQuestion.canPublish, true);
  assert.deepEqual(readyQuestion.errors, []);

  const draftLinkedQuestion = validateContentBlockReadiness({
    type: 'question',
    status: 'published',
    linkedVraagId: 'vraag-2',
    linkedVraag: {
      id: 'vraag-2',
      status: 'draft',
      vraagtype: 'open',
      content: { text: '<p>Leg uit wat 2FA doet.</p>' },
      antwoord: { type: 'open', modelAnswer: '2FA voegt een tweede controle toe.' }
    }
  });

  assert.equal(draftLinkedQuestion.canPublish, false);
  assert.deepEqual(draftLinkedQuestion.errors.map((issue) => issue.code), ['question_not_ready']);
});

test('assessment blocks need at least one complete item before publication', () => {
  const emptyQuiz = validateContentBlockReadiness({
    type: 'quiz',
    status: 'published',
    content: { items: [] }
  });

  assert.equal(emptyQuiz.canPublish, false);
  assert.deepEqual(emptyQuiz.errors.map((issue) => issue.code), ['assessment_items_missing']);

  const readyToets = validateContentBlockReadiness({
    type: 'toets',
    status: 'published',
    content: {
      items: [
        {
          type: 'meerkeuze',
          prompt: 'Welke regel past bij veilig wachtwoordgebruik?',
          answer: {
            type: 'meerkeuze',
            options: [
              { id: 'a', text: 'Gebruik hetzelfde wachtwoord overal.', correct: false },
              { id: 'b', text: 'Gebruik voor ieder account een uniek wachtwoord.', correct: true }
            ]
          }
        }
      ],
      tokenConfig: { enabled: true, totalTokens: 10 }
    }
  });

  assert.equal(readyToets.canPublish, true);
  assert.deepEqual(readyToets.errors, []);
});

test('slidedeck blocks need an uploaded generated deck before publication', () => {
  const missingDeck = validateContentBlockReadiness({
    type: 'slidedeck',
    status: 'published',
    content: { slidedeckPackageId: 'pkg-1', generatedDeckUrl: '', generatedDeckStoragePath: '' }
  });

  assert.equal(missingDeck.canPublish, false);
  assert.deepEqual(missingDeck.errors.map((issue) => issue.code), ['slidedeck_pdf_missing']);

  const readyDeck = validateContentBlockReadiness({
    type: 'slidedeck',
    status: 'published',
    content: {
      slidedeckPackageId: 'pkg-1',
      generatedDeckStoragePath: 'slidedecks/pkg-1/generated-deck.pdf'
    }
  });

  assert.equal(readyDeck.canPublish, true);
});

test('paragraph readiness requires learning goals and evidence before route publication', () => {
  const result = validateParagraphReadiness({
    paragraaf: {
      title: '1.1 Mijn digitale schooltas',
      learningGoals: '',
      evidenceProduct: ''
    },
    blocks: [
      { id: 'b1', type: 'summary', status: 'published', content: { html: '<p>Klaar.</p>' } }
    ]
  });

  assert.equal(result.canPublish, false);
  assert.deepEqual(result.errors.map((issue) => issue.code), ['paragraph_learning_goals_missing', 'paragraph_evidence_missing']);

  const ready = validateParagraphReadiness({
    paragraaf: {
      title: '1.1 Mijn digitale schooltas',
      learningGoals: ['Ik open mijn schoolmail.', 'Ik vind mijn bestanden terug.'],
      evidenceProduct: 'Leerling levert een correct gedeeld document in.'
    },
    blocks: [
      { id: 'b1', type: 'summary', status: 'published', content: { html: '<p>Klaar.</p>' } }
    ]
  });

  assert.equal(ready.canPublish, true);
  assert.equal(ready.blockResults.length, 1);
});
