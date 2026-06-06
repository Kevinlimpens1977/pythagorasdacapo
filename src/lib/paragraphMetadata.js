export const PARAGRAPH_REVIEW_STATUSES = ['needs_review', 'ready', 'approved'];

export const PARAGRAPH_REVIEW_STATUS_LABELS = {
  needs_review: 'Review nodig',
  ready: 'Klaar voor review',
  approved: 'Goedgekeurd'
};

const splitLines = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  return String(value || '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const cleanText = (value) => String(value || '').trim();

const parseMinutes = (value) => {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.round(parsed));
};

export const normalizeParagraphReviewStatus = (status) =>
  PARAGRAPH_REVIEW_STATUSES.includes(status) ? status : 'needs_review';

export const getParagraphReviewStatusLabel = (status) =>
  PARAGRAPH_REVIEW_STATUS_LABELS[normalizeParagraphReviewStatus(status)];

export const normalizeParagraphMetadata = (paragraaf = {}) => {
  const learningGoals = splitLines(
    paragraaf.learningGoals ?? paragraaf.leerdoelen ?? paragraaf.goals ?? paragraaf.doelen
  );
  const sloKerndoelen = splitLines(
    paragraaf.sloKerndoelen ?? paragraaf.kerndoelen ?? paragraaf.kerndoel ?? paragraaf.slo
  );
  const evidenceProduct = cleanText(
    paragraaf.evidenceProduct ?? paragraaf.bewijsproduct ?? paragraaf.finalProduct ?? paragraaf.eindprestatie
  );
  const targetGroup = cleanText(
    paragraaf.targetGroup ?? paragraaf.doelgroep ?? paragraaf.niveauTitle ?? paragraaf.niveau ?? ''
  );
  const estimatedMinutes = parseMinutes(
    paragraaf.estimatedMinutes ?? paragraaf.geschatteLestijd ?? paragraaf.estimatedTimeMinutes
  );

  return {
    learningGoals,
    evidenceProduct,
    sloKerndoelen,
    targetGroup,
    estimatedMinutes,
    reviewStatus: normalizeParagraphReviewStatus(paragraaf.reviewStatus)
  };
};

export const buildParagraphMetadataUpdate = ({
  learningGoalsText = '',
  evidenceProduct = '',
  sloKerndoelenText = '',
  targetGroup = '',
  estimatedMinutes = 0,
  reviewStatus = 'needs_review'
} = {}) => {
  const learningGoals = splitLines(learningGoalsText);
  const sloKerndoelen = splitLines(sloKerndoelenText);
  const cleanEvidenceProduct = cleanText(evidenceProduct);
  const cleanTargetGroup = cleanText(targetGroup);
  const minutes = parseMinutes(estimatedMinutes);
  const normalizedReviewStatus = normalizeParagraphReviewStatus(reviewStatus);

  return {
    learningGoals,
    leerdoelen: learningGoals,
    evidenceProduct: cleanEvidenceProduct,
    bewijsproduct: cleanEvidenceProduct,
    sloKerndoelen,
    targetGroup: cleanTargetGroup,
    doelgroep: cleanTargetGroup,
    estimatedMinutes: minutes,
    geschatteLestijd: minutes,
    reviewStatus: normalizedReviewStatus
  };
};
