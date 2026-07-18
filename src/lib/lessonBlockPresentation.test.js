import assert from 'node:assert/strict';
import test from 'node:test';
import { getLessonBlockAccent, hasRenderableLessonHtml } from './lessonBlockPresentation.js';

test('lege of ontbrekende html telt niet als inhoud', () => {
  assert.equal(hasRenderableLessonHtml(''), false);
  assert.equal(hasRenderableLessonHtml(null), false);
  assert.equal(hasRenderableLessonHtml(undefined), false);
  assert.equal(hasRenderableLessonHtml('<p></p>'), false);
  assert.equal(hasRenderableLessonHtml('<p>   </p>'), false);
  assert.equal(hasRenderableLessonHtml('<p>&nbsp;</p><p>&#160;</p>'), false);
  assert.equal(hasRenderableLessonHtml('<div><span></span></div>'), false);
});

test('tekstinhoud telt als inhoud', () => {
  assert.equal(hasRenderableLessonHtml('<p>De stelling van Pythagoras</p>'), true);
  assert.equal(hasRenderableLessonHtml('Gewone tekst zonder tags'), true);
});

test('visuele elementen tellen ook zonder tekst als inhoud', () => {
  assert.equal(hasRenderableLessonHtml('<p><img src="/x.png" alt="" /></p>'), true);
  assert.equal(hasRenderableLessonHtml('<iframe src="https://example.com"></iframe>'), true);
  assert.equal(hasRenderableLessonHtml('<video src="/x.mp4"></video>'), true);
  assert.equal(hasRenderableLessonHtml('<table><tr><td></td></tr></table>'), true);
});

test('voorbeeld en samenvatting hebben een eigen accent, andere types niet', () => {
  const example = getLessonBlockAccent('example');
  assert.equal(example.eyebrow, 'Voorbeeld');
  assert.match(example.className, /border/);

  const summary = getLessonBlockAccent('summary');
  assert.equal(summary.eyebrow, 'Samenvatting');
  assert.match(summary.className, /border/);

  assert.equal(getLessonBlockAccent('theory'), null);
  assert.equal(getLessonBlockAccent('media'), null);
  assert.equal(getLessonBlockAccent(undefined), null);
});
