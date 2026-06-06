import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PARAGRAPH_REVIEW_STATUSES,
  buildParagraphMetadataUpdate,
  normalizeParagraphMetadata
} from './paragraphMetadata.js';

test('normalizeParagraphMetadata accepts legacy and Dutch paragraph fields', () => {
  const metadata = normalizeParagraphMetadata({
    leerdoelen: 'Ik kan inloggen.\nIk vind mijn bestanden terug.',
    bewijsproduct: 'Een gedeeld document in OneDrive.',
    kerndoel: 'SLO digitale geletterdheid',
    doelgroep: 'VMBO 1',
    geschatteLestijd: '45',
    reviewStatus: 'ready'
  });

  assert.deepEqual(metadata.learningGoals, ['Ik kan inloggen.', 'Ik vind mijn bestanden terug.']);
  assert.equal(metadata.evidenceProduct, 'Een gedeeld document in OneDrive.');
  assert.deepEqual(metadata.sloKerndoelen, ['SLO digitale geletterdheid']);
  assert.equal(metadata.targetGroup, 'VMBO 1');
  assert.equal(metadata.estimatedMinutes, 45);
  assert.equal(metadata.reviewStatus, 'ready');
});

test('normalizeParagraphMetadata falls back to safe review status and non-negative lesson time', () => {
  const metadata = normalizeParagraphMetadata({
    learningGoals: ['  Leerdoel 1  ', '', 'Leerdoel 2'],
    sloKerndoelen: ['Kerndoel A', ''],
    estimatedMinutes: '-20',
    reviewStatus: 'bad-status'
  });

  assert.deepEqual(metadata.learningGoals, ['Leerdoel 1', 'Leerdoel 2']);
  assert.deepEqual(metadata.sloKerndoelen, ['Kerndoel A']);
  assert.equal(metadata.estimatedMinutes, 0);
  assert.equal(metadata.reviewStatus, 'needs_review');
});

test('buildParagraphMetadataUpdate creates the canonical Firestore fields', () => {
  const update = buildParagraphMetadataUpdate({
    learningGoalsText: 'Doel A\nDoel B',
    evidenceProduct: 'Miniportfolio',
    sloKerndoelenText: 'Kerndoel 1\nKerndoel 2',
    targetGroup: 'EOA',
    estimatedMinutes: '30',
    reviewStatus: 'approved'
  });

  assert.deepEqual(update, {
    learningGoals: ['Doel A', 'Doel B'],
    leerdoelen: ['Doel A', 'Doel B'],
    evidenceProduct: 'Miniportfolio',
    bewijsproduct: 'Miniportfolio',
    sloKerndoelen: ['Kerndoel 1', 'Kerndoel 2'],
    targetGroup: 'EOA',
    doelgroep: 'EOA',
    estimatedMinutes: 30,
    geschatteLestijd: 30,
    reviewStatus: 'approved'
  });
});

test('PARAGRAPH_REVIEW_STATUSES contains the publication review states', () => {
  assert.deepEqual(PARAGRAPH_REVIEW_STATUSES, ['needs_review', 'ready', 'approved']);
});
