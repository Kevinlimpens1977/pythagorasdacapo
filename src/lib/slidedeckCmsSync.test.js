import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSlidedeckCmsBlockSyncPatch } from './slidedeckCmsSync.js';

const deckPackage = {
  id: 'pkg-1',
  title: 'Veilig starten met HELIX',
  reviewStatus: 'needs_review',
  sourceTagsSummary: {
    SOURCE_BASED: 2,
    AI_SUGGESTION: 0,
    NEEDS_REVIEW: 1,
    TEACHER_DECISION: 0
  },
  citations: [{ slide: 1, source: 'bron-pdf' }],
  teacherDecisionNote: '',
  generatedDeckPdf: {
    downloadURL: 'https://example.test/deck.pdf',
    storagePath: 'slidedecks/pkg-1/generated-deck.pdf'
  },
  sourcePdf: {
    downloadURL: 'https://example.test/source.pdf',
    storagePath: 'slidedecks/pkg-1/source.pdf'
  }
};

test('buildSlidedeckCmsBlockSyncPatch links uploaded deck data and protects published blocks pending review', () => {
  const patch = buildSlidedeckCmsBlockSyncPatch({
    block: {
      id: 'block-1',
      type: 'slidedeck',
      status: 'published',
      content: {
        html: '<p>Intro</p>',
        slidedeckPackageId: ''
      }
    },
    deckPackage
  });

  assert.equal(patch.status, 'needs_review');
  assert.deepEqual(patch.content, {
    html: '<p>Intro</p>',
    slidedeckPackageId: 'pkg-1',
    deckTitle: 'Veilig starten met HELIX',
    generatedDeckUrl: 'https://example.test/deck.pdf',
    generatedDeckStoragePath: 'slidedecks/pkg-1/generated-deck.pdf',
    sourcePdfUrl: 'https://example.test/source.pdf',
    sourcePdfStoragePath: 'slidedecks/pkg-1/source.pdf'
  });
  assert.deepEqual(patch.sourceReview, {
    reviewStatus: 'needs_review',
    sourceTagsSummary: deckPackage.sourceTagsSummary,
    citations: deckPackage.citations,
    teacherDecisionNote: '',
    slidedeckPackageId: 'pkg-1'
  });
});

test('buildSlidedeckCmsBlockSyncPatch keeps publishable status when deck review is approved', () => {
  const patch = buildSlidedeckCmsBlockSyncPatch({
    block: {
      id: 'block-1',
      type: 'slidedeck',
      status: 'published',
      content: {}
    },
    deckPackage: {
      ...deckPackage,
      reviewStatus: 'approved',
      sourceTagsSummary: {
        ...deckPackage.sourceTagsSummary,
        NEEDS_REVIEW: 0
      }
    }
  });

  assert.equal(patch.status, 'published');
  assert.equal(patch.sourceReview.reviewStatus, 'approved');
});

test('buildSlidedeckCmsBlockSyncPatch ignores non-slidedeck blocks', () => {
  assert.equal(buildSlidedeckCmsBlockSyncPatch({
    block: { id: 'block-2', type: 'theory', status: 'published' },
    deckPackage
  }), null);
});
