import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPublicContentBlockSnapshot,
  hasAssessmentItemAnswerKey
} from './publicContentBlockView.js';

test('buildPublicContentBlockSnapshot removes answer keys from multiple choice assessment items', () => {
  const publicBlock = buildPublicContentBlockSnapshot({
    id: 'block-1',
    type: 'quiz',
    status: 'published',
    content: {
      html: '<p>Maak de check.</p>',
      tokenConfig: { enabled: true, totalTokens: 5 },
      items: [
        {
          id: 'item-1',
          type: 'meerkeuze',
          prompt: 'Wat is veilig?',
          answer: {
            options: [
              { id: 'a', text: '123456', correct: false, explanation: 'Te zwak' },
              { id: 'b', text: 'Een wachtwoordzin', correct: true, explanation: 'Goed' }
            ]
          },
          feedback: 'Kies het sterke wachtwoord.'
        }
      ]
    }
  });

  assert.deepEqual(publicBlock.content.items[0].answer.options, [
    { id: 'a', text: '123456' },
    { id: 'b', text: 'Een wachtwoordzin' }
  ]);
  assert.equal(publicBlock.content.items[0].feedback, '');
  assert.equal(publicBlock.content.items[0].answerKeyAvailable, false);
  assert.equal(hasAssessmentItemAnswerKey(publicBlock.content.items[0]), false);
});

test('buildPublicContentBlockSnapshot removes numeric expected values but keeps units', () => {
  const publicBlock = buildPublicContentBlockSnapshot({
    id: 'block-2',
    type: 'toets',
    content: {
      items: [
        {
          id: 'item-2',
          type: 'numeriek',
          prompt: 'Bereken de lengte.',
          answer: { expected: 12, tolerance: 0.5, unit: 'cm' }
        }
      ]
    }
  });

  assert.deepEqual(publicBlock.content.items[0].answer, { type: 'numeriek', unit: 'cm' });
  assert.equal(hasAssessmentItemAnswerKey(publicBlock.content.items[0]), false);
});

test('buildPublicContentBlockSnapshot separates matching choices from private pairs', () => {
  const publicBlock = buildPublicContentBlockSnapshot({
    id: 'block-3',
    type: 'quiz',
    content: {
      items: [
        {
          id: 'item-3',
          type: 'koppelen',
          prompt: 'Koppel begrip en betekenis.',
          answer: {
            pairs: [
              { id: 'p1', left: 'Privacy', right: 'Persoonsgegevens beschermen' },
              { id: 'p2', left: 'Phishing', right: 'Nepbericht om gegevens te stelen' }
            ]
          }
        }
      ]
    }
  });

  assert.deepEqual(publicBlock.content.items[0].answer.pairs, [
    { id: 'p1', left: 'Privacy' },
    { id: 'p2', left: 'Phishing' }
  ]);
  assert.deepEqual(publicBlock.content.items[0].answer.options, [
    { id: 'p2-option', text: 'Nepbericht om gegevens te stelen' },
    { id: 'p1-option', text: 'Persoonsgegevens beschermen' }
  ]);
});

test('buildPublicContentBlockSnapshot keeps fill blank layout but strips answers', () => {
  const publicBlock = buildPublicContentBlockSnapshot({
    id: 'block-4',
    type: 'quiz',
    content: {
      items: [
        {
          id: 'item-4',
          type: 'invullen',
          prompt: 'Vul aan.',
          answer: {
            text: 'Een veilig wachtwoord is ___.',
            segments: [
              { type: 'text', text: 'Een veilig wachtwoord is ' },
              { type: 'gap', id: 'gap-1' },
              { type: 'text', text: '.' }
            ],
            gaps: [{ id: 'gap-1', answer: 'lang' }]
          }
        }
      ]
    }
  });

  assert.deepEqual(publicBlock.content.items[0].answer.gaps, [{ id: 'gap-1' }]);
  assert.deepEqual(publicBlock.content.items[0].answer.segments[1], { type: 'gap', id: 'gap-1' });
});

test('buildPublicContentBlockSnapshot keeps order choices but rotates private order', () => {
  const publicBlock = buildPublicContentBlockSnapshot({
    id: 'block-5',
    type: 'quiz',
    content: {
      items: [
        {
          id: 'item-5',
          type: 'volgorde',
          prompt: 'Zet de stappen goed.',
          answer: {
            items: [
              { id: 'one', text: 'Stap 1' },
              { id: 'two', text: 'Stap 2' },
              { id: 'three', text: 'Stap 3' }
            ]
          }
        }
      ]
    }
  });

  assert.deepEqual(publicBlock.content.items[0].answer.items, [
    { id: 'three', text: 'Stap 3' },
    { id: 'one', text: 'Stap 1' },
    { id: 'two', text: 'Stap 2' }
  ]);
});

test('hasAssessmentItemAnswerKey detects private items', () => {
  assert.equal(hasAssessmentItemAnswerKey({
    type: 'meerkeuze',
    answer: { options: [{ text: 'A', correct: true }] }
  }), true);
  assert.equal(hasAssessmentItemAnswerKey({
    type: 'open',
    answer: { modelAnswer: 'Kernantwoord' }
  }), true);
  assert.equal(hasAssessmentItemAnswerKey({
    type: 'koppelen',
    answer: { pairs: [{ left: 'A' }] },
    publicSnapshotVersion: 1
  }), false);
});
