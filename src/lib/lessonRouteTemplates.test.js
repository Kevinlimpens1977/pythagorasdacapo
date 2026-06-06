import test from 'node:test';
import assert from 'node:assert/strict';

import {
  LESSON_ROUTE_TEMPLATES,
  buildLessonRouteTemplateBlocks,
  getLessonRouteTemplate
} from './lessonRouteTemplates.js';

test('LESSON_ROUTE_TEMPLATES exposes the expected starter patterns', () => {
  assert.deepEqual(
    LESSON_ROUTE_TEMPLATES.map((template) => template.id),
    ['uitleg_oefenen', 'notebooklm_check', 'herhalen', 'steunroute', 'plusroute']
  );
});

test('buildLessonRouteTemplateBlocks creates editable block drafts', () => {
  const blocks = buildLessonRouteTemplateBlocks('uitleg_oefenen');

  assert.deepEqual(blocks.map((block) => block.type), ['theory', 'example', 'question', 'question', 'question', 'summary']);
  assert.equal(blocks[0].status, 'draft');
  assert.equal(blocks[0].settings.differentiationLevel, 'basis');
  assert.equal(blocks[2].question.title, 'Checkvraag 1');
});

test('buildLessonRouteTemplateBlocks marks support and plus routes', () => {
  const supportBlocks = buildLessonRouteTemplateBlocks('steunroute');
  const plusBlocks = buildLessonRouteTemplateBlocks('plusroute');

  assert.equal(supportBlocks.every((block) => block.settings.differentiationLevel === 'steun'), true);
  assert.equal(plusBlocks.every((block) => block.settings.differentiationLevel === 'plus'), true);
});

test('buildLessonRouteTemplateBlocks starts NotebookLM route with a slidedeck', () => {
  const blocks = buildLessonRouteTemplateBlocks('notebooklm_check');

  assert.equal(blocks[0].type, 'slidedeck');
  assert.equal(blocks.filter((block) => block.type === 'question').length, 2);
});

test('getLessonRouteTemplate and builder handle unknown ids', () => {
  assert.equal(getLessonRouteTemplate('mist'), null);
  assert.deepEqual(buildLessonRouteTemplateBlocks('mist'), []);
});
