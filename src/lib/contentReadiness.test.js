import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CONTENT_BLOCK_STATUSES,
  getContentBlockStatusLabel,
  getReadinessIssueRenderKey,
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

test('readiness issue render keys stay unique when multiple blocks have the same issue code', () => {
  const issues = [
    { code: 'block_question_missing', message: 'Vraag: Koppel eerst een vraag.' },
    { code: 'block_question_missing', message: 'Vraag: Koppel eerst een vraag.' },
    { code: 'block_question_missing', message: 'Vraag: Koppel eerst een vraag.' }
  ];

  assert.deepEqual(
    issues.map((issue, index) => getReadinessIssueRenderKey(issue, index)),
    [
      'block_question_missing-0',
      'block_question_missing-1',
      'block_question_missing-2'
    ]
  );
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

test('publication override allows admin publication only with a reason', () => {
  const invalidPublishedBlock = {
    type: 'summary',
    status: 'published',
    content: { html: '<p>   </p>' }
  };

  const withoutOverride = validateContentBlockReadiness(invalidPublishedBlock);

  assert.equal(withoutOverride.canPublish, false);
  assert.equal(withoutOverride.publicationOverride.isActive, false);

  const blankOverride = validateContentBlockReadiness({
    ...invalidPublishedBlock,
    publicationOverride: {
      enabled: true,
      reason: '   ',
      createdBy: 'admin-1'
    }
  });

  assert.equal(blankOverride.canPublish, false);
  assert.equal(blankOverride.publicationOverride.isActive, false);
  assert.deepEqual(blankOverride.publicationOverride.errors.map((issue) => issue.code), ['override_reason_missing']);

  const withOverride = validateContentBlockReadiness({
    ...invalidPublishedBlock,
    publicationOverride: {
      enabled: true,
      reason: 'Kort live gezet voor klassikale demonstratie; wordt na de les aangevuld.',
      createdBy: 'admin-1'
    }
  });

  assert.equal(withOverride.canPublish, true);
  assert.equal(withOverride.publicationOverride.isActive, true);
  assert.deepEqual(withOverride.publicationOverride.issueCodes, ['content_missing']);
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

test('content blocks with AI or source review flags need approval before publication', () => {
  const baseBlock = {
    type: 'theory',
    status: 'published',
    content: { html: '<p>Brongebaseerde uitleg.</p>' }
  };

  const needsReview = validateContentBlockReadiness({
    ...baseBlock,
    sourceReview: {
      reviewStatus: 'needs_review',
      sourceTagsSummary: { NEEDS_REVIEW: 1 }
    }
  });

  assert.equal(needsReview.canPublish, false);
  assert.deepEqual(needsReview.errors.map((issue) => issue.code), ['source_review_required']);

  const aiSuggestion = validateContentBlockReadiness({
    ...baseBlock,
    sourceReview: {
      sourceTagsSummary: { AI_SUGGESTION: 1 }
    }
  });

  assert.equal(aiSuggestion.canPublish, false);
  assert.deepEqual(aiSuggestion.errors.map((issue) => issue.code), ['source_ai_review_required']);

  const aiSuggestionWithGenericOverride = validateContentBlockReadiness({
    ...baseBlock,
    sourceReview: {
      sourceTagsSummary: { AI_SUGGESTION: 1 }
    },
    publicationOverride: {
      enabled: true,
      reason: 'Algemene override is niet genoeg voor AI-output.',
      createdBy: 'admin-1'
    }
  });

  assert.equal(aiSuggestionWithGenericOverride.canPublish, false);
  assert.equal(aiSuggestionWithGenericOverride.publicationOverride.isActive, false);

  const teacherDecisionWithoutNote = validateContentBlockReadiness({
    ...baseBlock,
    sourceReview: {
      reviewStatus: 'teacher_decision',
      sourceTagsSummary: { AI_SUGGESTION: 1 },
      teacherDecisionNote: ''
    }
  });

  assert.equal(teacherDecisionWithoutNote.canPublish, false);
  assert.deepEqual(teacherDecisionWithoutNote.errors.map((issue) => issue.code), ['source_teacher_decision_note_missing']);

  const teacherDecisionWithNote = validateContentBlockReadiness({
    ...baseBlock,
    sourceReview: {
      reviewStatus: 'teacher_decision',
      sourceTagsSummary: { AI_SUGGESTION: 1 },
      teacherDecisionNote: 'Docent heeft voorbeeld herschreven en gecontroleerd.'
    }
  });

  assert.equal(teacherDecisionWithNote.canPublish, true);
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
      { id: 'b1', type: 'summary', status: 'published', content: { html: '<p>Klaar.</p>' } },
      {
        id: 'q1',
        type: 'question',
        status: 'published',
        linkedVraagId: 'vraag-1',
        linkedVraag: {
          id: 'vraag-1',
          status: 'published',
          vraagtype: 'open',
          content: { text: '<p>Wat lever je in?</p>' },
          antwoord: { type: 'open', modelAnswer: 'Een correct gedeeld document.' }
        }
      }
    ]
  });

  assert.equal(ready.canPublish, true);
  assert.equal(ready.blockResults.length, 2);
});

test('paragraph readiness requires a complete closing check block', () => {
  const paragraph = {
    title: '1.1 Mijn digitale schooltas',
    learningGoals: ['Ik open mijn schoolmail.'],
    evidenceProduct: 'Leerling levert een correct gedeeld document in.'
  };

  const withoutClosingCheck = validateParagraphReadiness({
    paragraaf: paragraph,
    blocks: [
      { id: 'b1', type: 'summary', status: 'published', content: { html: '<p>Onthoud de stappen.</p>' } }
    ]
  });

  assert.equal(withoutClosingCheck.canPublish, false);
  assert.deepEqual(withoutClosingCheck.errors.map((issue) => issue.code), ['paragraph_closing_check_missing']);

  const withDraftQuestion = validateParagraphReadiness({
    paragraaf: paragraph,
    blocks: [
      {
        id: 'q1',
        type: 'question',
        status: 'draft',
        linkedVraagId: 'vraag-1',
        linkedVraag: {
          id: 'vraag-1',
          status: 'published',
          vraagtype: 'open',
          content: { text: '<p>Wat doe je na het openen van je schoolmail?</p>' },
          antwoord: { type: 'open', modelAnswer: 'Ik controleer de afzender en onderwerpregel.' }
        }
      }
    ]
  });

  assert.equal(withDraftQuestion.canPublish, false);
  assert.deepEqual(withDraftQuestion.errors.map((issue) => issue.code), ['paragraph_closing_check_missing']);

  const withClosingCheck = validateParagraphReadiness({
    paragraaf: paragraph,
    blocks: [
      {
        id: 'q1',
        type: 'question',
        status: 'published',
        linkedVraagId: 'vraag-1',
        linkedVraag: {
          id: 'vraag-1',
          status: 'published',
          vraagtype: 'open',
          content: { text: '<p>Wat doe je na het openen van je schoolmail?</p>' },
          antwoord: { type: 'open', modelAnswer: 'Ik controleer de afzender en onderwerpregel.' }
        }
      }
    ]
  });

  assert.equal(withClosingCheck.canPublish, true);
});
