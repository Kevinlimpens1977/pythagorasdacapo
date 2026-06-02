import { hasStudentPhoto } from './studentPhotoUtils.js';

export const PHOTO_IMPORT_MATCH_STATUSES = {
  CONFIDENT_MATCH: 'confident_match',
  NEEDS_REVIEW: 'needs_review',
  NO_MATCH: 'no_match',
  DUPLICATE_MATCH: 'duplicate_match',
  MISSING_NAME: 'missing_name'
};

export const PHOTO_IMPORT_DECISIONS = {
  APPROVE: 'approve',
  PENDING_NEW: 'pending_new',
  REJECT: 'reject'
};

const VALID_DECISIONS = new Set(Object.values(PHOTO_IMPORT_DECISIONS));

export const normalizePhotoImportDecision = (decision = '') => {
  if (decision === 'link') return PHOTO_IMPORT_DECISIONS.APPROVE;
  if (decision === 'pending') return PHOTO_IMPORT_DECISIONS.PENDING_NEW;
  if (decision === 'skip') return PHOTO_IMPORT_DECISIONS.REJECT;
  return decision || '';
};

const repairCommonMojibake = (value) => {
  const raw = String(value || '');
  if (!/[ÃÂ]/.test(raw)) return raw;

  try {
    return decodeURIComponent(escape(raw));
  } catch {
    return raw;
  }
};

export const normalizeStudentName = (value = '') =>
  repairCommonMojibake(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

export const sanitizeImportFileName = (value = 'leerlingfoto') =>
  String(value || 'leerlingfoto')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96) || 'leerlingfoto';

export const splitStudentFullName = (value = '') => {
  const parts = String(value || '').trim().replace(/\s+/g, ' ').split(' ').filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
};

export const joinStudentName = ({ firstName = '', lastName = '' } = {}) =>
  [firstName, lastName].map((part) => String(part || '').trim()).filter(Boolean).join(' ');

const getEmailPrefix = (email = '') => String(email || '').split('@')[0] || '';

const scoreCandidate = (proposedName, candidate = {}) => {
  const normalizedName = normalizeStudentName(proposedName);
  const displayName = normalizeStudentName(candidate.displayName || candidate.name || '');
  const emailPrefix = normalizeStudentName(getEmailPrefix(candidate.email));

  if (!normalizedName) return 0;
  if (displayName === normalizedName || emailPrefix === normalizedName) return 1;
  if (displayName.startsWith(normalizedName) || normalizedName.startsWith(displayName)) return 0.85;
  if (emailPrefix && (emailPrefix.startsWith(normalizedName) || normalizedName.startsWith(emailPrefix))) return 0.8;

  const nameParts = new Set(normalizedName.split(' ').filter(Boolean));
  const candidateParts = displayName.split(' ').filter(Boolean);
  const sharedParts = candidateParts.filter((part) => nameParts.has(part));
  if (!sharedParts.length) return 0;

  return Math.min(0.75, sharedParts.length / Math.max(nameParts.size, candidateParts.length));
};

export const buildStudentMatchCandidates = (students = [], proposedName = '') =>
  students
    .map((student) => ({
      student,
      score: scoreCandidate(proposedName, student)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

export const determinePhotoMatchStatus = ({ proposedName = '', candidates = [] } = {}) => {
  const normalizedName = normalizeStudentName(proposedName);
  if (!normalizedName) {
    return {
      status: PHOTO_IMPORT_MATCH_STATUSES.MISSING_NAME,
      matchedStudent: null,
      confidence: 0
    };
  }

  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      confidence: scoreCandidate(normalizedName, candidate)
    }))
    .filter(({ confidence }) => confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  if (!scoredCandidates.length) {
    return {
      status: PHOTO_IMPORT_MATCH_STATUSES.NO_MATCH,
      matchedStudent: null,
      confidence: 0
    };
  }

  const [best, second] = scoredCandidates;
  if (second && best.confidence - second.confidence < 0.15) {
    return {
      status: PHOTO_IMPORT_MATCH_STATUSES.DUPLICATE_MATCH,
      matchedStudent: null,
      confidence: best.confidence
    };
  }

  return {
    status:
      best.confidence >= 0.85
        ? PHOTO_IMPORT_MATCH_STATUSES.CONFIDENT_MATCH
        : PHOTO_IMPORT_MATCH_STATUSES.NEEDS_REVIEW,
    matchedStudent: best.candidate,
    confidence: best.confidence
  };
};

export const getMatchStatus = ({ proposedName = '', candidates = [], matchedUserId = '' } = {}) => {
  if (!normalizeStudentName(proposedName)) return 'naam ontbreekt';
  if (matchedUserId) return 'matched';
  if (!candidates.length) return 'geen match';

  const bestScore = Number(candidates[0]?.score || candidates[0]?.confidence || 0);
  const secondScore = Number(candidates[1]?.score || candidates[1]?.confidence || 0);
  if (secondScore > 0 && Math.abs(bestScore - secondScore) < 0.15) return 'dubbele match';
  if (bestScore >= 0.85) return 'zekere match';
  return 'controle nodig';
};

const toFiniteNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const normalizeCropBbox = (bbox = {}, originalImageSize = {}) => {
  const imageWidth = toFiniteNumber(originalImageSize.width);
  const imageHeight = toFiniteNumber(originalImageSize.height);
  if (!imageWidth || !imageHeight || imageWidth <= 0 || imageHeight <= 0) return null;

  const rawX = toFiniteNumber(bbox.x);
  const rawY = toFiniteNumber(bbox.y);
  const rawWidth = toFiniteNumber(bbox.width);
  const rawHeight = toFiniteNumber(bbox.height);
  if ([rawX, rawY, rawWidth, rawHeight].some((value) => value === null)) return null;
  if (rawWidth <= 0 || rawHeight <= 0) return null;

  const ratioBox = [rawX, rawY, rawWidth, rawHeight].every((value) => value >= 0 && value <= 1);
  const scaled = {
    x: ratioBox ? rawX * imageWidth : rawX,
    y: ratioBox ? rawY * imageHeight : rawY,
    width: ratioBox ? rawWidth * imageWidth : rawWidth,
    height: ratioBox ? rawHeight * imageHeight : rawHeight
  };

  const x = Math.max(0, Math.min(Math.round(scaled.x), imageWidth));
  const y = Math.max(0, Math.min(Math.round(scaled.y), imageHeight));
  const maxWidth = Math.round(imageWidth - x);
  const maxHeight = Math.round(imageHeight - y);
  const width = Math.max(0, Math.min(Math.round(scaled.width), maxWidth));
  const height = Math.max(0, Math.min(Math.round(scaled.height), maxHeight));

  if (width <= 0 || height <= 0) return null;
  return { x, y, width, height };
};

const findStudentById = (students = [], uid = '') =>
  students.find((student) => student.uid === uid || student.id === uid) || null;

export const getPhotoImportRowReviewState = (row = {}) => {
  const decision = normalizePhotoImportDecision(row.decision);
  if (decision === PHOTO_IMPORT_DECISIONS.REJECT) return 'rejected';
  if (decision === PHOTO_IMPORT_DECISIONS.PENDING_NEW && String(row.proposedName || '').trim()) return 'pending';
  if (decision === PHOTO_IMPORT_DECISIONS.APPROVE && row.matchedUserId) return 'approved';
  return 'unresolved';
};

export const validatePhotoImportRow = (row = {}, { students = [], klasId = '' } = {}) => {
  const proposedName = String(row.proposedName || '').trim().replace(/\s+/g, ' ');
  const bbox = normalizeCropBbox(row.bbox, row.originalImageSize);
  const matchedStudent = row.matchedUserId ? findStudentById(students, row.matchedUserId) : null;
  const errors = [];

  if (!String(row.cropId || '').trim()) errors.push('missing_crop_id');
  if (!proposedName) errors.push('missing_proposed_name');
  if (!bbox) errors.push('invalid_bbox');
  const decision = normalizePhotoImportDecision(row.decision);
  if (decision && !VALID_DECISIONS.has(decision)) errors.push('invalid_decision');
  if (decision === PHOTO_IMPORT_DECISIONS.APPROVE && !row.matchedUserId) {
    errors.push('missing_matched_student');
  }
  if (row.matchedUserId && !matchedStudent) errors.push('matched_student_not_found');
  if (matchedStudent && klasId && matchedStudent.klasId && matchedStudent.klasId !== klasId) {
    errors.push('matched_student_wrong_class');
  }
  if (decision === PHOTO_IMPORT_DECISIONS.PENDING_NEW && !proposedName) {
    errors.push('pending_student_missing_name');
  }

  const normalizedRow = {
    ...row,
    proposedName,
    bbox,
    decision,
    reviewState: getPhotoImportRowReviewState({ ...row, proposedName, decision })
  };

  return {
    isValid: errors.length === 0,
    errors,
    row: normalizedRow
  };
};

export const createPhotoImportRows = (crops = [], students = []) =>
  crops.map((crop, index) => {
    const proposedName = String(crop.proposedName || crop.label || crop.name || '').trim();
    const nameParts = splitStudentFullName(proposedName);
    const candidates = buildStudentMatchCandidates(students, proposedName);
    const [bestCandidate] = candidates;
    const isConfident = bestCandidate?.score >= 0.85;
    const cropId = crop.cropId || crop.id || `crop-${index + 1}`;
    const matchedUserId = isConfident ? (bestCandidate.student.uid || bestCandidate.student.id || '') : '';
    const matchedDisplayName = isConfident
      ? (bestCandidate.student.displayName || bestCandidate.student.name || bestCandidate.student.email || '')
      : '';
    const status = getMatchStatus({
      proposedName,
      candidates,
      matchedUserId
    });

    return {
      id: cropId,
      cropId,
      order: index + 1,
      selection: crop,
      proposedName,
      firstName: crop.firstName || nameParts.firstName,
      lastName: crop.lastName || nameParts.lastName,
      bbox: crop.bbox || null,
      cropCoordinates: crop.cropCoordinates || crop.bbox || null,
      originalImageSize: crop.originalImageSize || null,
      detectionConfidence: crop.detectionConfidence || 0,
      detectionMethod: crop.detectionMethod || 'manual',
      rawOcrText: crop.rawOcrText || '',
      cleanedOcrName: crop.cleanedOcrName || proposedName,
      ocrConfidence: crop.ocrConfidence || 0,
      labelBox: crop.labelBox || null,
      labelMatchConfidence: crop.labelMatchConfidence || 0,
      candidates,
      matchStatus: status,
      status,
      matchedUserId,
      matchedDisplayName,
      matchConfidence: bestCandidate?.score || 0,
      matchMethod: isConfident ? 'name' : 'suggested',
      decision: matchedUserId
        ? PHOTO_IMPORT_DECISIONS.APPROVE
        : proposedName
          ? PHOTO_IMPORT_DECISIONS.PENDING_NEW
          : 'review'
    };
  });

export const getPhotoImportReadiness = (rows = []) => {
  const ready = rows.filter((row) => {
    const decision = normalizePhotoImportDecision(row.decision);
    if (decision === PHOTO_IMPORT_DECISIONS.APPROVE) {
      return Boolean(row.matchedUserId);
    }
    if (decision === PHOTO_IMPORT_DECISIONS.PENDING_NEW) {
      return Boolean(String(row.proposedName || '').trim());
    }
    return decision === PHOTO_IMPORT_DECISIONS.REJECT;
  }).length;

  return {
    total: rows.length,
    ready,
    isReady: rows.length > 0 && ready === rows.length
  };
};

export const countStudentPhotos = (students = []) =>
  students.reduce(
    (counts, student = {}) => {
      if (hasStudentPhoto(student)) counts.withPhoto += 1;
      else counts.withoutPhoto += 1;
      return counts;
    },
    { withPhoto: 0, withoutPhoto: 0 }
  );

export const summarizePhotoImportRows = (rows = []) => {
  const summary = {
    total: rows.length,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
    unresolvedCount: 0,
    canSave: false
  };

  rows.forEach((row) => {
    const state = getPhotoImportRowReviewState(row);
    if (state === 'approved') summary.approvedCount += 1;
    if (state === 'pending') summary.pendingCount += 1;
    if (state === 'rejected') summary.rejectedCount += 1;
    if (state === 'unresolved') summary.unresolvedCount += 1;
  });

  summary.canSave = summary.total > 0 && summary.unresolvedCount === 0;
  return summary;
};
