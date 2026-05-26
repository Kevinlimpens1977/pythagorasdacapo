import test from 'node:test';
import assert from 'node:assert/strict';

import { buildQuestionPreviewModel } from './questionPreviewUtils.js';

test('buildQuestionPreviewModel renders fill blank segments as display parts', () => {
  assert.deepEqual(
    buildQuestionPreviewModel({
      vraagtype: 'invullen',
      content: { text: '<p></p>' },
      antwoord: {
        segments: [
          { type: 'text', text: 'De oppervlakte is ' },
          { type: 'gap', id: 'gap-1', answer: 'cm2' },
          { type: 'text', text: '.' }
        ]
      }
    }),
    {
      type: 'invullen',
      promptHtml: '',
      segments: [
        { type: 'text', text: 'De oppervlakte is ' },
        { type: 'gap', id: 'gap-1', answer: 'cm2' },
        { type: 'text', text: '.' }
      ],
      fields: [{ id: 'gap-1', answer: 'cm2', smartCheck: true, label: 'Invulveld 1' }],
      empty: false
    }
  );
});

test('buildQuestionPreviewModel falls back to prompt html for open questions', () => {
  assert.deepEqual(
    buildQuestionPreviewModel({
      vraagtype: 'open',
      content: { text: '<p>Leg uit wat digitale vaardigheden zijn.</p>' },
      antwoord: { modelAnswer: 'Goed omgaan met digitale middelen.' }
    }),
    {
      type: 'open',
      promptHtml: '<p>Leg uit wat digitale vaardigheden zijn.</p>',
      segments: [],
      fields: [],
      empty: false
    }
  );
});
