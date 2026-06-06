import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPublicQuestionSnapshot,
  hasQuestionAnswerKey
} from './publicQuestionView.js';

test('buildPublicQuestionSnapshot removes private answer keys from multiple choice questions', () => {
  const publicQuestion = buildPublicQuestionSnapshot({
    id: 'vraag-1',
    title: 'Veilig wachtwoord',
    status: 'published',
    vraagtype: 'meerkeuze',
    content: { text: '<p>Welke keuze is veilig?</p>', images: ['image-a'] },
    antwoord: {
      type: 'meerkeuze',
      options: [
        { id: 'a', text: '123456', correct: false, explanation: 'Te raden', misconception: 'Kort lijkt makkelijker.' },
        { id: 'b', text: 'Een unieke wachtwoordzin', correct: true, explanation: 'Sterk', misconception: 'Sterke optie.' }
      ]
    },
    vraagMetadata: {
      difficulty: 2,
      hints: ['Denk aan lengte.'],
      tokenConfig: { totalTokens: 5 }
    }
  });

  assert.deepEqual(publicQuestion.antwoord.options, [
    { id: 'a', text: '123456' },
    { id: 'b', text: 'Een unieke wachtwoordzin' }
  ]);
  assert.equal(publicQuestion.antwoord.options.some((option) => 'correct' in option), false);
  assert.equal(publicQuestion.antwoord.options.some((option) => 'explanation' in option), false);
  assert.equal(publicQuestion.antwoord.options.some((option) => 'misconception' in option), false);
  assert.deepEqual(publicQuestion.vraagMetadata, { difficulty: 2 });
  assert.equal(hasQuestionAnswerKey(publicQuestion), false);
});

test('buildPublicQuestionSnapshot removes model answers and numeric expected values', () => {
  const openQuestion = buildPublicQuestionSnapshot({
    id: 'open-1',
    vraagtype: 'open',
    content: { text: '<p>Leg uit.</p>' },
    antwoord: { type: 'open', modelAnswer: 'Modelantwoord', rubric: 'Rubric' }
  });
  const numericQuestion = buildPublicQuestionSnapshot({
    id: 'num-1',
    vraagtype: 'numeriek',
    content: { text: '<p>Bereken.</p>' },
    antwoord: { type: 'numeriek', expected: 42, correctValue: 42, unit: 'cm' }
  });

  assert.deepEqual(openQuestion.antwoord, { type: 'open' });
  assert.deepEqual(numericQuestion.antwoord, { type: 'numeriek', unit: 'cm' });
  assert.equal(hasQuestionAnswerKey(openQuestion), false);
  assert.equal(hasQuestionAnswerKey(numericQuestion), false);
});

test('buildPublicQuestionSnapshot keeps fill blank layout but strips gap answers', () => {
  const publicQuestion = buildPublicQuestionSnapshot({
    id: 'fill-1',
    vraagtype: 'invullen',
    content: { text: '<p>Vul aan.</p>' },
    antwoord: {
      type: 'invullen',
      segments: [
        { type: 'text', text: 'De eenheid is ' },
        { type: 'gap', id: 'gap-1', answer: 'cm2' },
        { type: 'text', text: '.' }
      ],
      gaps: [{ id: 'gap-1', answer: 'cm2', alternatives: ['cm²'] }]
    }
  });

  assert.deepEqual(publicQuestion.antwoord.segments, [
    { type: 'text', text: 'De eenheid is ' },
    { type: 'gap', id: 'gap-1' },
    { type: 'text', text: '.' }
  ]);
  assert.deepEqual(publicQuestion.antwoord.gaps, [{ id: 'gap-1' }]);
  assert.equal(hasQuestionAnswerKey(publicQuestion), false);
});

test('buildPublicQuestionSnapshot keeps order items but does not expose the private order', () => {
  const publicQuestion = buildPublicQuestionSnapshot({
    id: 'order-1',
    vraagtype: 'volgorde',
    content: { text: '<p>Zet in de juiste volgorde.</p>' },
    antwoord: {
      type: 'volgorde',
      items: [
        { id: 'first', text: 'Eerst' },
        { id: 'second', text: 'Daarna' },
        { id: 'third', text: 'Tot slot' }
      ]
    }
  });

  assert.deepEqual(publicQuestion.antwoord.items, [
    { id: 'third', text: 'Tot slot' },
    { id: 'first', text: 'Eerst' },
    { id: 'second', text: 'Daarna' }
  ]);
  assert.equal(hasQuestionAnswerKey(publicQuestion), false);
});

test('hasQuestionAnswerKey detects private authoring questions but not public snapshots', () => {
  assert.equal(hasQuestionAnswerKey({
    vraagtype: 'meerkeuze',
    antwoord: { options: [{ text: 'A', correct: true }, { text: 'B', correct: false }] }
  }), true);
  assert.equal(hasQuestionAnswerKey({
    vraagtype: 'open',
    antwoord: { modelAnswer: 'Kern' }
  }), true);
  assert.equal(hasQuestionAnswerKey({
    vraagtype: 'invullen',
    antwoord: { gaps: [{ id: 'gap-1' }] }
  }), false);
});
