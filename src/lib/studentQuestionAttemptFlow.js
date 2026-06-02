export const MAX_CORE_QUESTION_ATTEMPTS = 4;

const normalizeAttempts = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

const normalizeAiHelpCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const buildQuestionAttemptOutcome = ({
  currentAttempts = 0,
  maxAttempts = MAX_CORE_QUESTION_ATTEMPTS,
  isCorrect = false,
  aiAssessmentFailed = false,
  aiHelpCount = 0
} = {}) => {
  const safeCurrentAttempts = normalizeAttempts(currentAttempts);
  const safeMaxAttempts = Math.max(1, normalizeAttempts(maxAttempts) || MAX_CORE_QUESTION_ATTEMPTS);

  if (aiAssessmentFailed) {
    return {
      attempts: safeCurrentAttempts,
      maxAttempts: safeMaxAttempts,
      completed: true,
      isCorrect: false,
      resultTier: 'pending_teacher_review',
      attemptStatus: 'pending_teacher_review',
      completionReason: 'teacher_review_pending',
      teacherSignal: 'ai_assessment_failed',
      shouldAutoAdvance: true
    };
  }

  const nextAttempts = Math.min(safeCurrentAttempts + 1, safeMaxAttempts);

  if (isCorrect) {
    return {
      attempts: nextAttempts,
      maxAttempts: safeMaxAttempts,
      completed: true,
      isCorrect: true,
      resultTier: normalizeAiHelpCount(aiHelpCount) > 0 ? 'guided' : 'independent',
      attemptStatus: 'completed',
      completionReason: 'correct',
      teacherSignal: '',
      shouldAutoAdvance: true
    };
  }

  if (nextAttempts >= safeMaxAttempts) {
    return {
      attempts: nextAttempts,
      maxAttempts: safeMaxAttempts,
      completed: true,
      isCorrect: false,
      resultTier: 'failed',
      attemptStatus: 'locked',
      completionReason: 'max_attempts',
      teacherSignal: 'remediation_needed',
      shouldAutoAdvance: true
    };
  }

  return {
    attempts: nextAttempts,
    maxAttempts: safeMaxAttempts,
    completed: false,
    isCorrect: false,
    resultTier: 'in_progress',
    attemptStatus: 'open',
    completionReason: '',
    teacherSignal: '',
    shouldAutoAdvance: false
  };
};

const isFailedCoreQuestion = (record = {}) =>
  record.resultTier === 'failed' || record.completionReason === 'max_attempts';

const isGreenCoreQuestion = (record = {}) =>
  record.completed === true &&
  record.isCorrect === true &&
  (record.resultTier === 'independent' || record.resultTier === 'guided' || !record.resultTier);

const isTeacherReviewPending = (record = {}) =>
  record.resultTier === 'pending_teacher_review' || record.attemptStatus === 'pending_teacher_review';

export const buildParagraphEndPlan = ({ coreQuestionRecords = [] } = {}) => {
  if (coreQuestionRecords.some((record) => !record)) {
    return { kind: 'in_progress', assignmentKind: '', required: false };
  }

  const questionRecords = coreQuestionRecords.filter(Boolean);

  if (!questionRecords.length) {
    return { kind: 'none', assignmentKind: '', required: false };
  }

  const failedRecords = questionRecords.filter(isFailedCoreQuestion);
  if (failedRecords.length > 0) {
    return {
      kind: 'remediation',
      assignmentKind: 'remediation',
      required: true,
      sourceRecords: failedRecords
    };
  }

  if (questionRecords.some(isTeacherReviewPending)) {
    return {
      kind: 'teacher_review_pending',
      assignmentKind: '',
      required: false,
      sourceRecords: questionRecords.filter(isTeacherReviewPending)
    };
  }

  if (questionRecords.every(isGreenCoreQuestion)) {
    return {
      kind: 'challenge',
      assignmentKind: 'challenge',
      required: true,
      sourceRecords: questionRecords
    };
  }

  return { kind: 'in_progress', assignmentKind: '', required: false };
};
