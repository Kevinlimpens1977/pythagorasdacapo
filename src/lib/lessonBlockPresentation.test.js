import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLessonBlockAccent,
  getLessonReadingPresentation,
  hasRenderableLessonHtml,
  resolveLessonReadingSections,
  splitLessonExampleSection
} from './lessonBlockPresentation.js';

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

test('alleen voorbeeld en samenvatting krijgen een labeltje, de kaart blijft gelijk', () => {
  const example = getLessonReadingPresentation('example');
  assert.equal(example.eyebrow, 'Voorbeeld');
  assert.ok(example.chipClass);
  assert.equal(example.cardClass, undefined);

  const summary = getLessonReadingPresentation('summary');
  assert.equal(summary.eyebrow, 'Samenvatting');
  assert.ok(summary.chipClass);

  // Theorie is de neutrale standaard: geen labeltje, geen eigen kaartvorm.
  assert.equal(getLessonReadingPresentation('theory'), null);
  assert.equal(getLessonReadingPresentation('question'), null);
  assert.equal(getLessonReadingPresentation(undefined), null);
});

test('een voorbeeldkopje in de theorietekst wordt een apart voorbeeldblok', () => {
  const result = splitLessonExampleSection(
    '<p>Een cel is de bouwsteen van elk organisme.</p><h3>Voorbeeld</h3><p>Een bloedcel vervoert zuurstof.</p>'
  );

  assert.equal(result.theoryHtml, '<p>Een cel is de bouwsteen van elk organisme.</p>');
  assert.equal(result.exampleHtml, '<p>Een bloedcel vervoert zuurstof.</p>');
  assert.equal(result.exampleLabel, 'Voorbeeld');
});

test('splitsen gebeurt alleen als er theorie en voorbeeld overblijven', () => {
  const leadingHeading = splitLessonExampleSection('<h3>Voorbeeld</h3><p>Alleen een voorbeeld.</p>');
  assert.equal(leadingHeading.exampleHtml, '');
  assert.equal(leadingHeading.theoryHtml, '<h3>Voorbeeld</h3><p>Alleen een voorbeeld.</p>');

  const emptyExample = splitLessonExampleSection('<p>Theorie.</p><h3>Voorbeeld</h3>');
  assert.equal(emptyExample.exampleHtml, '');

  const noHeading = splitLessonExampleSection('<p>Theorie zonder voorbeeldkopje.</p>');
  assert.equal(noHeading.exampleHtml, '');
  assert.equal(noHeading.theoryHtml, '<p>Theorie zonder voorbeeldkopje.</p>');

  assert.deepEqual(splitLessonExampleSection(''), { theoryHtml: '', exampleHtml: '', exampleLabel: '' });
});

test('een los voorbeeldveld wint van de split en andere bloktypes worden niet gesplitst', () => {
  const explicit = resolveLessonReadingSections({
    type: 'theory',
    bodyHtml: '<p>Theorie.</p><h3>Voorbeeld</h3><p>Uit de tekst.</p>',
    content: { exampleHtml: '<p>Uit het losse veld.</p>' }
  });
  assert.equal(explicit.exampleHtml, '<p>Uit het losse veld.</p>');
  assert.equal(explicit.theoryHtml, '<p>Theorie.</p><h3>Voorbeeld</h3><p>Uit de tekst.</p>');

  const summary = resolveLessonReadingSections({
    type: 'summary',
    bodyHtml: '<p>Samenvatting.</p><h3>Voorbeeld</h3><p>Toch niet splitsen.</p>',
    content: {}
  });
  assert.equal(summary.exampleHtml, '');
});
