import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveLessonKeyTerms,
  enhanceLessonProseHtml,
  formatLessonReadingHtml,
  hasExplicitEmphasis,
  readExplicitKeyTerms
} from './lessonProseFormatting.js';

const SEED_THEORY =
  '<p>Met je schoolaccount kom je bij de belangrijkste digitale plekken: HELIX, OneDrive, ' +
  'Outlook en de school-ELO. Zie je account als een sleutelbos. Outlook is voor mail.</p>';

test('kernbegrippen worden uit de tekst zelf afgeleid, niet verzonnen', () => {
  const terms = deriveLessonKeyTerms(SEED_THEORY);
  assert.deepEqual(terms, ['HELIX', 'OneDrive', 'Outlook', 'school-ELO']);
});

test('een zinsopener met hoofdletter is geen kernbegrip', () => {
  const terms = deriveLessonKeyTerms('<p>Zie je account als een sleutelbos. Maak een vaste map.</p>');
  assert.deepEqual(terms, []);
});

test('kerndoelcodes tellen niet als kernbegrip', () => {
  const terms = deriveLessonKeyTerms('<p>Belangrijke kerndoelen: 21A, 23A, 22A. Bewaar in OneDrive.</p>');
  assert.deepEqual(terms, ['OneDrive']);
});

test('afleiding stopt bij de limiet en herhaalt geen begrip', () => {
  const html = '<p>a Aap, a Beer, a Cel, a Das, a Eend, a Foto, a Gans, a Aap.</p>';
  const terms = deriveLessonKeyTerms(html, { limit: 3 });
  assert.equal(terms.length, 3);
  assert.deepEqual(terms, ['Aap', 'Beer', 'Cel']);
});

test('alleen het eerste voorkomen van een begrip wordt vet', () => {
  const html = enhanceLessonProseHtml('<p>Outlook is voor mail. Outlook blijft mail.</p>', {
    keyTerms: ['Outlook'],
    caseSensitive: true
  });
  assert.equal(html, '<p><strong>Outlook</strong> is voor mail. Outlook blijft mail.</p>');
});

test('bestaande markup blijft heel en kopjes en links krijgen geen extra nadruk', () => {
  const html = enhanceLessonProseHtml(
    '<h2>Outlook</h2><p>Open <a href="/x">Outlook</a> en dan Outlook zelf.</p>',
    { keyTerms: ['Outlook'], caseSensitive: true }
  );
  assert.equal(
    html,
    '<h2>Outlook</h2><p>Open <a href="/x">Outlook</a> en dan <strong>Outlook</strong> zelf.</p>'
  );
});

test('een deel van een woord wordt nooit vet gezet', () => {
  const html = enhanceLessonProseHtml('<p>Word wordt Wordpad, niet Word-bestand.</p>', {
    keyTerms: ['Word'],
    caseSensitive: true
  });
  assert.equal(html, '<p><strong>Word</strong> wordt Wordpad, niet Word-bestand.</p>');
});

test('markdown-nadruk uit de editor wordt echte nadruk', () => {
  assert.equal(
    enhanceLessonProseHtml('<p>Dit is **belangrijk** en __ook dit__.</p>'),
    '<p>Dit is <strong>belangrijk</strong> en <strong>ook dit</strong>.</p>'
  );
  assert.equal(enhanceLessonProseHtml('<pre>**geen opmaak**</pre>'), '<pre>**geen opmaak**</pre>');
});

test('lege invoer blijft leeg', () => {
  assert.equal(enhanceLessonProseHtml(''), '');
  assert.equal(enhanceLessonProseHtml(null), '');
  assert.equal(formatLessonReadingHtml('   '), '   ');
});

test('begrippen van de docent winnen en mogen andere schrijfwijze hebben', () => {
  assert.deepEqual(readExplicitKeyTerms({ keyTerms: ['Sleutelbos', 'sleutelbos', ' '] }), ['Sleutelbos']);
  assert.deepEqual(readExplicitKeyTerms({ kernbegrippen: 'account, wachtwoord' }), ['account', 'wachtwoord']);
  assert.deepEqual(readExplicitKeyTerms({}), []);

  const html = formatLessonReadingHtml('<p>Je account is je sleutel.</p>', { keyTerms: ['Account'] });
  assert.equal(html, '<p>Je <strong>account</strong> is je sleutel.</p>');
});

test('tekst die de docent zelf al opmaakte wordt niet nog eens vet gemaakt', () => {
  const source = '<p><strong>Outlook</strong> is voor mail. Outlook en OneDrive horen erbij.</p>';
  assert.equal(hasExplicitEmphasis(source), true);
  assert.equal(formatLessonReadingHtml(source), source);
});

test('de leesstap zet de kernbegrippen uit de seedtekst vet', () => {
  const html = formatLessonReadingHtml(SEED_THEORY, {});
  assert.match(html, /<strong>HELIX<\/strong>/);
  assert.match(html, /<strong>OneDrive<\/strong>/);
  assert.match(html, /<strong>school-ELO<\/strong>/);
  // De tekst zelf verandert niet: alleen nadruk komt erbij.
  assert.equal(html.replace(/<\/?strong>/g, ''), SEED_THEORY);
});
