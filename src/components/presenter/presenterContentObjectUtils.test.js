import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPresenterImportedObjectKind,
  getPresenterImportedObjectModel,
  getQuestionControlState,
  getQuestionFeedbackStatus,
  isPresenterImportedObject
} from './presenterContentObjectUtils.js';

test('recognizes imported presenter content object types and aliases', () => {
  assert.equal(isPresenterImportedObject({ type: 'lessonBlock' }), true);
  assert.equal(isPresenterImportedObject({ type: 'questionWindow' }), true);
  assert.equal(isPresenterImportedObject({ type: 'mediaBlock' }), true);
  assert.equal(isPresenterImportedObject({ type: 'slidedeckBlock' }), true);
  assert.equal(isPresenterImportedObject({ type: 'rectangle' }), false);

  assert.equal(getPresenterImportedObjectKind({ type: 'theoryBlock' }), 'lesson');
  assert.equal(getPresenterImportedObjectKind({ type: 'question' }), 'question');
  assert.equal(getPresenterImportedObjectKind({ type: 'media' }), 'media');
  assert.equal(getPresenterImportedObjectKind({ type: 'slidedeck' }), 'slidedeck');
});

test('builds lesson models from imported block content without dropping html', () => {
  const model = getPresenterImportedObjectModel({
    type: 'lessonBlock',
    title: 'Stelling van Pythagoras',
    blockType: 'example',
    content: {
      html: '<p>Bij een rechthoekige driehoek geldt <strong>a² + b² = c²</strong>.</p>'
    }
  });

  assert.equal(model.kind, 'lesson');
  assert.equal(model.label, 'Voorbeeld');
  assert.equal(model.title, 'Stelling van Pythagoras');
  assert.equal(model.bodyHtml, '<p>Bij een rechthoekige driehoek geldt <strong>a² + b² = c²</strong>.</p>');
});

test('builds media models from legacy media fields and pdf urls', () => {
  const model = getPresenterImportedObjectModel({
    type: 'mediaBlock',
    title: 'Bronblad',
    content: {
      pdfUrl: 'https://example.test/pythagoras.pdf',
      caption: 'Open de bron als PDF.'
    }
  });

  assert.equal(model.kind, 'media');
  assert.equal(model.title, 'Bronblad');
  assert.equal(model.media.mediaKind, 'pdf');
  assert.equal(model.media.mediaUrl, 'https://example.test/pythagoras.pdf');
  assert.equal(model.media.caption, 'Open de bron als PDF.');
});

test('builds models from V1B import snapshot data shape', () => {
  const lesson = getPresenterImportedObjectModel({
    type: 'lessonBlock',
    data: {
      kind: 'theory',
      title: 'Snapshot theorie',
      html: '<p>Dit komt uit object.data.</p>',
      imageUrl: 'https://example.test/theorie.png'
    }
  });

  const media = getPresenterImportedObjectModel({
    type: 'lessonBlock',
    data: {
      kind: 'media',
      title: 'Snapshot media',
      media: {
        mediaKind: 'image',
        mediaUrl: 'https://example.test/media.png',
        caption: 'Een afbeelding'
      }
    }
  });

  const deck = getPresenterImportedObjectModel({
    type: 'lessonBlock',
    data: {
      kind: 'slidedeck',
      title: 'Snapshot deck',
      slidedeck: {
        deckTitle: 'Deck titel',
        pdfUrl: 'https://example.test/deck.pdf',
        slidedeckPackageId: 'package-1'
      }
    }
  });

  const question = getPresenterImportedObjectModel({
    type: 'questionWindow',
    data: {
      kind: 'question',
      title: 'Snapshot vraag',
      blockPromptHtml: '<p>Blok prompt</p>',
      question: {
        vraagtype: 'open',
        content: { text: '<p>Vraag prompt</p>' },
        antwoord: { answer: 'antwoord' }
      }
    }
  });

  assert.equal(lesson.title, 'Snapshot theorie');
  assert.equal(lesson.bodyHtml, '<p>Dit komt uit object.data.</p>');
  assert.equal(lesson.imageUrl, 'https://example.test/theorie.png');
  assert.equal(media.kind, 'media');
  assert.equal(media.media.mediaUrl, 'https://example.test/media.png');
  assert.equal(deck.kind, 'slidedeck');
  assert.equal(deck.title, 'Deck titel');
  assert.equal(deck.pdfUrl, 'https://example.test/deck.pdf');
  assert.equal(question.kind, 'question');
  assert.equal(question.title, 'Snapshot vraag');
  assert.equal(question.promptHtml, '<p>Vraag prompt</p>');
});

test('question controls stay hidden until there is input and feedback waits for checking', () => {
  const vraag = {
    vraagtype: 'open',
    content: { text: '<p>Welke zijde is de schuine zijde?</p>' },
    antwoord: { answer: 'c' }
  };
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    title: 'Controlevraag',
    linkedVraag: vraag
  });

  assert.equal(model.kind, 'question');
  assert.equal(model.promptHtml, '<p>Welke zijde is de schuine zijde?</p>');
  assert.equal(getQuestionControlState(model, { openAnswer: '' }).hasInput, false);
  assert.equal(getQuestionControlState(model, { openAnswer: 'c' }).hasInput, true);
  assert.equal(getQuestionFeedbackStatus(model, { openAnswer: 'c' }, false), 'idle');
  // Een open vraag met een tekstueel modelantwoord kijkt het bord niet zelf na;
  // dat doet de leerlingroute ook niet. Het bord toont het modelantwoord en de
  // docent beoordeelt hardop.
  assert.equal(getQuestionFeedbackStatus(model, { openAnswer: 'c' }, true), 'unknown');
  assert.equal(model.modelAnswer, 'c');
});

test('open questions with a calculable model answer are graded by the shared local assessment', () => {
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    linkedVraag: {
      vraagtype: 'open',
      content: { text: '<p>Bereken de schuine zijde.</p>' },
      antwoord: { modelAnswer: '5' }
    }
  });

  assert.equal(getQuestionFeedbackStatus(model, { openAnswer: '5' }, true), 'correct');
  assert.equal(getQuestionFeedbackStatus(model, { openAnswer: '4' }, true), 'incorrect');
});

test('a question without answer key says the teacher checks it instead of colouring everything red', () => {
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    linkedVraag: {
      vraagtype: 'numeriek',
      content: { text: '<p>Hoeveel is het?</p>' },
      antwoord: { type: 'numeriek', unit: 'cm' }
    }
  });

  assert.equal(getQuestionFeedbackStatus(model, { expectedValue: '12' }, true), 'unknown');
});

test('imported exercise blocks keep their numbered fields and are never scored', () => {
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    data: {
      kind: 'question',
      title: 'Digitale vaardigheden',
      question: {
        vraagtype: 'exercise',
        content: { text: '<p>Voer de stappen uit.</p>' },
        antwoord: {
          type: 'exercise',
          fields: [
            { id: 'f1', label: 'Noteer de bestandsnaam' },
            { id: 'f2', label: 'Noteer de mapnaam' }
          ]
        }
      }
    }
  });

  assert.equal(model.type, 'exercise');
  assert.deepEqual(model.fields.map((field) => field.label), [
    'Noteer de bestandsnaam',
    'Noteer de mapnaam'
  ]);
  assert.equal(getQuestionControlState(model, { f1: 'notulen.docx' }).hasInput, true);
  assert.equal(getQuestionFeedbackStatus(model, { f1: 'notulen.docx' }, true), 'unknown');
});

test('matching questions expose pairs and check submitted links', () => {
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    linkedVraag: {
      vraagtype: 'koppelen',
      content: { text: '<p>Koppel de begrippen.</p>' },
      antwoord: {
        pairs: [
          { id: 'p1', left: 'pi', right: '3,14' },
          { id: 'p2', left: 'rechte hoek', right: '90 graden' }
        ]
      }
    }
  });

  assert.equal(model.type, 'koppelen');
  assert.deepEqual(model.pairs.map((pair) => pair.left), ['pi', 'rechte hoek']);
  assert.equal(getQuestionControlState(model, { pairs: {} }).hasInput, false);
  assert.equal(getQuestionControlState(model, { pairs: { p1: 'p1' } }).hasInput, true);
  assert.equal(getQuestionFeedbackStatus(model, { pairs: { p1: 'p1', p2: 'p2' } }, true), 'correct');
  assert.equal(getQuestionFeedbackStatus(model, { pairs: { p1: 'p2', p2: 'p1' } }, true), 'incorrect');
});

test('question models do not expose token metadata', () => {
  const model = getPresenterImportedObjectModel({
    type: 'questionWindow',
    token: 'secret',
    content: { token: 'secret', text: '<p>Vraag</p>' },
    antwoord: { answer: '42', token: 'secret-answer' }
  });

  assert.equal(JSON.stringify(model).includes('secret'), false);
});
