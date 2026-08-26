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

// Een optionele paragraaf is een aanrader, geen voorwaarde: de plusparagraaf
// van de theoretische leerweg. Hij levert wel tokens op, maar telt niet mee in
// het percentage dat een leerling van een hoofdstuk af moet hebben, en de
// hoofdstuktoets stelt er geen vragen over. De seed schrijft optioneel en
// verplicht allebei; oudere documenten hebben soms alleen een van de twee, en
// een paragraaf die er niets over zegt is gewoon verplicht.
// Eén bron voor hoe een plusparagraaf heet en wat hij belooft. De lesstofpagina
// van de leerling en het klasoverzicht van de docent lezen allebei hiervan, dus
// een leerling en zijn docent zien gegarandeerd dezelfde belofte staan.
export const PLUS_LABEL = 'Plus - vrijwillig';
export const PLUS_KORT = 'Plus';
export const PLUS_UITLEG_LEERLING =
  'Deze paragraaf is vrijwillig. Hij telt niet mee voor je hoofdstuk en je hoeft hem niet af te '
  + 'hebben om verder te mogen. Een aanrader als je later naar de havo wilt - en je verdient er '
  + 'gewoon tokens mee.';
export const PLUS_UITLEG_DOCENT =
  'Vrijwillige plusparagraaf. Telt niet mee voor het hoofdstuk; een aanrader voor wie naar de havo wil.';

export const isOptionalParagraph = (paragraaf = {}) => {
  if (paragraaf.optioneel !== undefined) return paragraaf.optioneel === true;
  if (paragraaf.optional !== undefined) return paragraaf.optional === true;
  if (paragraaf.verplicht !== undefined) return paragraaf.verplicht === false;
  if (paragraaf.required !== undefined) return paragraaf.required === false;
  return false;
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

  const optioneel = isOptionalParagraph(paragraaf);

  return {
    learningGoals,
    evidenceProduct,
    sloKerndoelen,
    targetGroup,
    estimatedMinutes,
    optioneel,
    verplicht: !optioneel,
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
