import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAiTutorStudentAnswerSummary } from './aiTutorAnswerSummary.js';

test('buildAiTutorStudentAnswerSummary marks a selected wrong multiple-choice option without revealing the correct option', () => {
  const summary = buildAiTutorStudentAnswerSummary({
    vraag: {
      title: '2+2=',
      vraagtype: 'meerkeuze',
      antwoord: {
        options: [
          { id: 'option-a', text: 'fout', correct: false },
          { id: 'option-b', text: 'goed', correct: true },
          { id: 'option-c', text: 'c', correct: false },
          { id: 'option-d', text: 'd', correct: false }
        ]
      }
    },
    preview: { type: 'meerkeuze' },
    previewAnswers: { 'option-d': true }
  });

  assert.match(summary, /Vraagtype: meerkeuze/);
  assert.match(summary, /Gekozen optie\(s\): d: d \(onjuist\)/);
  assert.match(summary, /Antwoordstatus: gekozen antwoord is onjuist/);
  assert.match(summary, /verklap het juiste antwoord niet/i);
  assert.doesNotMatch(summary, /goed/);
});

test('buildAiTutorStudentAnswerSummary includes manually filled math toolbox work', () => {
  const summary = buildAiTutorStudentAnswerSummary({
    vraag: { title: 'Hoeveel procent is 42 van 70?', vraagtype: 'open' },
    preview: { type: 'open' },
    previewAnswers: {
      openAnswer: 'Ik gebruik een tabel.',
      mathTools: [
        {
          id: 'ratio',
          type: 'ratioTable',
          topValues: ['70', '42'],
          bottomValues: ['100%', ''],
          operations: ['']
        }
      ]
    }
  });

  assert.match(summary, /Leerlingpoging/);
  assert.match(summary, /Verhoudingstabel/);
  assert.match(summary, /2 kolommen/);
});
