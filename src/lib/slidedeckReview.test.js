import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SLIDEDECK_REVIEW_STATUSES,
  SOURCE_TAGS,
  buildInitialSlidedeckReviewMetadata,
  buildSlidedeckDeckUploadMetadata,
  canUseSlidedeckPackageInCms,
  validateSlidedeckPackageForCms,
  validateSlidedeckSourceInputs
} from './slidedeckReview.js';

test('validateSlidedeckSourceInputs requires learning goals and source text', () => {
  assert.deepEqual(
    validateSlidedeckSourceInputs({ title: '', learningGoals: '', sourceText: '' }).errors.map((issue) => issue.code),
    ['title_missing', 'learning_goals_missing', 'source_text_missing']
  );

  assert.equal(
    validateSlidedeckSourceInputs({
      title: 'Pythagoras',
      learningGoals: 'Ik bereken de schuine zijde.',
      sourceText: 'a^2 + b^2 = c^2'
    }).canCreate,
    true
  );
});

test('buildInitialSlidedeckReviewMetadata creates source and generation manifests', () => {
  const metadata = buildInitialSlidedeckReviewMetadata({
    learningGoals: 'Doel A\nDoel B',
    sourceText: 'Brontekst',
    imageFiles: [{ name: 'driehoek.png', type: 'image/png', size: 1200 }],
    promptTemplateId: 'template-1',
    promptTemplateName: 'VMBO',
    promptSnapshot: 'Maak een deck.'
  });

  assert.deepEqual(metadata.sourceManifest.learningGoals, ['Doel A', 'Doel B']);
  assert.equal(metadata.sourceManifest.hasSourceText, true);
  assert.equal(metadata.sourceManifest.assets[0].fileName, 'driehoek.png');
  assert.equal(metadata.generationManifest.promptTemplateId, 'template-1');
  assert.equal(metadata.reviewStatus, 'needs_review');
  assert.equal(metadata.sourceTagsSummary[SOURCE_TAGS.SOURCE_BASED], 2);
  assert.equal(metadata.sourceTagsSummary[SOURCE_TAGS.NEEDS_REVIEW], 1);
});

test('buildSlidedeckDeckUploadMetadata keeps uploaded AI output out of CMS until reviewed', () => {
  const metadata = buildSlidedeckDeckUploadMetadata({
    file: { name: 'deck.pdf', size: 2048 },
    userId: 'admin-1'
  });

  assert.equal(metadata.reviewStatus, 'needs_review');
  assert.equal(metadata.generationManifest.generatedDeckFileName, 'deck.pdf');
  assert.equal(metadata.teacherDecisionLog.length, 1);
  assert.equal(metadata.teacherDecisionLog[0].action, 'deck_uploaded');
});

test('validateSlidedeckPackageForCms only allows approved or documented teacher decisions', () => {
  const basePackage = {
    generatedDeckPdf: { downloadURL: 'https://example.test/deck.pdf' }
  };

  assert.equal(validateSlidedeckPackageForCms({ ...basePackage, reviewStatus: 'needs_review' }).canUseInCms, false);
  assert.equal(validateSlidedeckPackageForCms({ ...basePackage, reviewStatus: 'approved' }).canUseInCms, true);
  assert.equal(
    validateSlidedeckPackageForCms({ ...basePackage, reviewStatus: 'teacher_decision', teacherDecisionNote: '' }).canUseInCms,
    false
  );
  assert.equal(
    validateSlidedeckPackageForCms({ ...basePackage, reviewStatus: 'teacher_decision', teacherDecisionNote: 'Bewust kort klassikaal deck.' }).canUseInCms,
    true
  );
});

test('canUseSlidedeckPackageInCms returns a simple boolean for service filters', () => {
  assert.deepEqual(SLIDEDECK_REVIEW_STATUSES, ['needs_review', 'approved', 'teacher_decision', 'rejected']);
  assert.equal(canUseSlidedeckPackageInCms({ generatedDeckPdf: { downloadURL: 'url' }, reviewStatus: 'approved' }), true);
  assert.equal(canUseSlidedeckPackageInCms({ generatedDeckPdf: { downloadURL: 'url' }, reviewStatus: 'rejected' }), false);
});
