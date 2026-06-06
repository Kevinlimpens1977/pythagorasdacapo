import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSlidedeckExportFileName,
  buildSlidedeckExportMetadata,
  buildSlidedeckHtmlExport,
  buildSlidedeckJsonExport
} from './slidedeckExport.js';

const deckPackage = {
  id: 'pkg-123',
  title: 'Pythagoras: schuine zijde',
  status: 'deckUploaded',
  reviewStatus: 'approved',
  learningGoals: 'Ik bereken de schuine zijde.\nIk controleer mijn antwoord.',
  sourceText: 'Bron met <script>ongewenste html</script>.',
  linkedContext: {
    vakTitle: 'Wiskunde',
    paragraafTitle: '7.3 Langste zijde'
  },
  promptTemplateId: 'template-1',
  promptTemplateName: 'VMBO uitleg',
  promptSnapshot: 'Maak een korte presentatie.',
  sourcePdf: {
    downloadURL: 'https://example.test/source.pdf',
    storagePath: 'slidedecks/pkg-123/source.pdf'
  },
  generatedDeckPdf: {
    downloadURL: 'https://example.test/deck.pdf',
    storagePath: 'slidedecks/pkg-123/generated-deck.pdf',
    fileName: 'deck.pdf'
  },
  sourceManifest: {
    learningGoals: ['Ik bereken de schuine zijde.', 'Ik controleer mijn antwoord.'],
    assets: [{ assetId: 'asset-1', fileName: 'driehoek.png', sourceTag: 'SOURCE_BASED' }]
  },
  sourceTagsSummary: {
    SOURCE_BASED: 2,
    NEEDS_REVIEW: 0
  },
  reviewChecklist: {
    sourceFaithful: true,
    answersChecked: true,
    languageLevelChecked: true,
    privacyChecked: false
  },
  citations: [{ slide: 1, source: 'Bron-PDF', note: 'Definitie.' }]
};

test('buildSlidedeckExportMetadata preserves source, files and review metadata', () => {
  const metadata = buildSlidedeckExportMetadata(deckPackage, { exportedAt: '2026-06-06T10:00:00.000Z' });

  assert.equal(metadata.exportContract, 'helix-slidedeck-package');
  assert.equal(metadata.packageId, 'pkg-123');
  assert.deepEqual(metadata.learningGoals, ['Ik bereken de schuine zijde.', 'Ik controleer mijn antwoord.']);
  assert.equal(metadata.files.sourcePdf.downloadURL, 'https://example.test/source.pdf');
  assert.equal(metadata.files.generatedDeckPdf.fileName, 'deck.pdf');
  assert.equal(metadata.review.reviewStatus, 'approved');
  assert.deepEqual(metadata.review.checklist, {
    sourceFaithful: true,
    answersChecked: true,
    languageLevelChecked: true,
    privacyChecked: false
  });
  assert.equal(metadata.sourceText, deckPackage.sourceText);
  assert.equal(metadata.prompt.snapshot, deckPackage.promptSnapshot);
});

test('buildSlidedeckJsonExport returns stable formatted JSON', () => {
  const json = buildSlidedeckJsonExport(deckPackage, { exportedAt: '2026-06-06T10:00:00.000Z' });
  const parsed = JSON.parse(json);

  assert.equal(parsed.packageId, 'pkg-123');
  assert.match(json, /\n {2}"title": "Pythagoras: schuine zijde"/);
});

test('buildSlidedeckHtmlExport escapes source text and includes PDF links', () => {
  const html = buildSlidedeckHtmlExport(deckPackage, { exportedAt: '2026-06-06T10:00:00.000Z' });

  assert.match(html, /HELIX slidedeck export/);
  assert.match(html, /https:\/\/example\.test\/source\.pdf/);
  assert.match(html, /https:\/\/example\.test\/deck\.pdf/);
  assert.match(html, /Checklist compleet/);
  assert.match(html, /&lt;script&gt;ongewenste html&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>ongewenste html<\/script>/);
});

test('buildSlidedeckExportFileName creates safe export filenames', () => {
  assert.equal(buildSlidedeckExportFileName(deckPackage, 'json'), 'pythagoras-schuine-zijde-pkg-123.json');
  assert.equal(buildSlidedeckExportFileName({ title: '' }, 'html'), 'slidedeck-export.html');
});
