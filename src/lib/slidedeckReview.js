export const SOURCE_TAGS = {
  SOURCE_BASED: 'SOURCE_BASED',
  AI_SUGGESTION: 'AI_SUGGESTION',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  TEACHER_DECISION: 'TEACHER_DECISION'
};

export const SLIDEDECK_REVIEW_STATUSES = ['needs_review', 'approved', 'teacher_decision', 'rejected'];

export const SLIDEDECK_REVIEW_STATUS_LABELS = {
  needs_review: 'Review nodig',
  approved: 'Goedgekeurd',
  teacher_decision: 'Docentbesluit',
  rejected: 'Afgewezen'
};

const cleanText = (value) => String(value || '').trim();

const splitLines = (value) =>
  String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const createIssue = (code, message) => ({ code, message, severity: 'error' });

export const normalizeSlidedeckReviewStatus = (status) =>
  SLIDEDECK_REVIEW_STATUSES.includes(status) ? status : 'needs_review';

export const getSlidedeckReviewStatusLabel = (status) =>
  SLIDEDECK_REVIEW_STATUS_LABELS[normalizeSlidedeckReviewStatus(status)];

export const validateSlidedeckSourceInputs = ({ title = '', learningGoals = '', sourceText = '' } = {}) => {
  const errors = [];
  if (!cleanText(title)) errors.push(createIssue('title_missing', 'Geef het slidedeckpakket een onderwerp.'));
  if (splitLines(learningGoals).length === 0) {
    errors.push(createIssue('learning_goals_missing', 'Vul minimaal een leerdoel in.'));
  }
  if (!cleanText(sourceText)) {
    errors.push(createIssue('source_text_missing', 'Vul brontekst of lesinhoud in.'));
  }

  return {
    canCreate: errors.length === 0,
    errors
  };
};

const summarizeSourceTags = ({ hasSourceText = false, assetCount = 0 } = {}) => ({
  [SOURCE_TAGS.SOURCE_BASED]: (hasSourceText ? 1 : 0) + assetCount,
  [SOURCE_TAGS.AI_SUGGESTION]: 0,
  [SOURCE_TAGS.NEEDS_REVIEW]: 1,
  [SOURCE_TAGS.TEACHER_DECISION]: 0
});

export const buildInitialSlidedeckReviewMetadata = ({
  learningGoals = '',
  sourceText = '',
  imageFiles = [],
  promptTemplateId = null,
  promptTemplateName = '',
  promptSnapshot = ''
} = {}) => {
  const normalizedLearningGoals = splitLines(learningGoals);
  const assets = (Array.isArray(imageFiles) ? imageFiles : []).map((file, index) => ({
    assetId: `asset-${index + 1}`,
    fileName: file.name || `Afbeelding ${index + 1}`,
    contentType: file.type || '',
    size: file.size || 0,
    sourceTag: SOURCE_TAGS.SOURCE_BASED
  }));
  const hasSourceText = cleanText(sourceText).length > 0;

  return {
    sourceManifest: {
      learningGoals: normalizedLearningGoals,
      hasSourceText,
      sourceTextLength: cleanText(sourceText).length,
      assets
    },
    generationManifest: {
      promptTemplateId: promptTemplateId || null,
      promptTemplateName: promptTemplateName || '',
      promptSnapshotLength: cleanText(promptSnapshot).length,
      generatedDeckFileName: '',
      generatedDeckSize: 0,
      generatedAt: ''
    },
    reviewStatus: 'needs_review',
    sourceTagsSummary: summarizeSourceTags({
      hasSourceText,
      assetCount: assets.length
    }),
    citations: [],
    teacherDecisionLog: []
  };
};

export const buildSlidedeckDeckUploadMetadata = ({ file = {}, userId = 'unknown-admin' } = {}) => ({
  reviewStatus: 'needs_review',
  generationManifest: {
    generatedDeckFileName: file.name || 'notebooklm-slidedeck.pdf',
    generatedDeckSize: file.size || 0,
    generatedAt: new Date().toISOString()
  },
  teacherDecisionLog: [{
    action: 'deck_uploaded',
    reviewStatus: 'needs_review',
    note: 'NotebookLM deck geupload; docentreview vereist voor CMS-gebruik.',
    userId,
    createdAt: new Date().toISOString()
  }]
});

export const validateSlidedeckPackageForCms = (deckPackage = {}) => {
  const errors = [];
  const hasDeck = Boolean(deckPackage.generatedDeckPdf?.downloadURL || deckPackage.generatedDeckPdf?.storagePath);
  const reviewStatus = normalizeSlidedeckReviewStatus(deckPackage.reviewStatus);

  if (!hasDeck) {
    errors.push(createIssue('generated_deck_missing', 'Upload eerst de gegenereerde NotebookLM-PDF.'));
  }

  if (reviewStatus === 'needs_review') {
    errors.push(createIssue('review_required', 'Controleer en keur het NotebookLM-deck eerst goed.'));
  }

  if (reviewStatus === 'rejected') {
    errors.push(createIssue('review_rejected', 'Dit NotebookLM-deck is afgewezen.'));
  }

  if (reviewStatus === 'teacher_decision' && !cleanText(deckPackage.teacherDecisionNote)) {
    errors.push(createIssue('teacher_decision_note_missing', 'Leg het docentbesluit vast voordat dit deck in het CMS mag.'));
  }

  return {
    reviewStatus,
    canUseInCms: errors.length === 0,
    errors
  };
};

export const canUseSlidedeckPackageInCms = (deckPackage = {}) =>
  validateSlidedeckPackageForCms(deckPackage).canUseInCms;
