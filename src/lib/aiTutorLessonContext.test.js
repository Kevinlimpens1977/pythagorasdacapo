import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAiTutorLessonContext } from './aiTutorLessonContext.js';

test('buildAiTutorLessonContext includes current question, answer, unit, feedback and paragraph history', () => {
  const context = buildAiTutorLessonContext({
    paragraaf: { title: '1.1 Procenten' },
    hoofdstuk: { title: 'Hoofdstuk 1' },
    currentBlock: {
      id: 'block-2',
      title: 'Vraag 2',
      linkedVraag: {
        title: 'Vraag 2',
        vraagtype: 'open',
        content: { text: '<p>Hoeveel procent is 20% van 250?</p>' },
        antwoord: { unit: 'procent' }
      }
    },
    currentPreviewAnswers: {
      openAnswer: 'dus 50%',
      mathTools: [
        {
          id: 'ratio',
          type: 'ratioTable',
          topValues: ['250', '50'],
          bottomValues: ['100%', '20%'],
          operations: ['delen door 5']
        }
      ]
    },
    currentAssessmentFeedback: 'Welke berekening hoort bij 20%?',
    progressRecords: [
      {
        blockId: 'block-1',
        blockTitle: 'Vraag 1',
        vraagType: 'open',
        attempts: 2,
        isCorrect: false,
        lastAnswer: { openAnswer: '25' },
        openAnswerAssessment: { feedback: 'Welke eenheid hoort hierbij?' }
      }
    ]
  });

  assert.match(context, /Paragraaf: 1\.1 Procenten/);
  assert.match(context, /Huidige vraag: Vraag 2/);
  assert.match(context, /Hoeveel procent is 20% van 250/);
  assert.match(context, /Antwoord of aanpak: dus 50%/);
  assert.match(context, /Eenheid volgens vraag: procent/);
  assert.match(context, /Feedback op huidige poging: Welke berekening hoort bij 20%/);
  assert.match(context, /Eerdere vragen in deze paragraaf/);
  assert.match(context, /Vraag 1/);
  assert.match(context, /2 pogingen/);
  assert.match(context, /Welke eenheid hoort hierbij/);
  assert.match(context, /Verhoudingstabel/);
});
