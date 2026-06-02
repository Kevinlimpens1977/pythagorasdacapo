export const normalizeAiHelpCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const normalizeResultTier = ({ completed = false, isCorrect = false, aiHelpCount = 0, resultTier = '', helpTier = '' } = {}) => {
  const explicitTier = String(resultTier || '').trim();
  if (explicitTier) return explicitTier;

  const legacyTier = String(helpTier || '').trim();
  if (legacyTier === 'ai_minimal' || legacyTier === 'ai_guided') return 'guided';
  if (legacyTier === 'independent') return 'independent';
  if (legacyTier === 'failed' || legacyTier === 'pending_teacher_review') return legacyTier;

  if (!completed && !isCorrect) return 'in_progress';
  if (!isCorrect) return 'failed';
  return normalizeAiHelpCount(aiHelpCount) > 0 ? 'guided' : 'independent';
};

export const getLearningResultTone = ({ completed = false, isCorrect = false, aiHelpCount = 0, resultTier = '', helpTier = '' } = {}) => {
  const tier = normalizeResultTier({ completed, isCorrect, aiHelpCount, resultTier, helpTier });

  if (tier === 'failed') {
    return {
      tier: 'failed',
      label: 'Geparkeerd voor herstel',
      borderClass: 'border-red-700',
      fillClass: 'bg-red-100',
      ringClass: '',
      scoreWeight: 0
    };
  }

  if (tier === 'pending_teacher_review') {
    return {
      tier: 'pending_teacher_review',
      label: 'Docentbeoordeling nodig',
      borderClass: 'border-amber-500',
      fillClass: 'bg-amber-100',
      ringClass: '',
      scoreWeight: 0
    };
  }

  if (tier === 'in_progress' || !isCorrect) {
    return {
      tier: 'in_progress',
      label: 'Nog niet goed',
      borderClass: 'border-slate-300',
      fillClass: 'bg-white',
      ringClass: '',
      scoreWeight: 0
    };
  }

  const normalizedHelpCount = normalizeAiHelpCount(aiHelpCount);

  if (tier === 'independent' || normalizedHelpCount === 0) {
    return {
      tier: 'independent',
      label: 'Zelfstandig goed',
      borderClass: 'border-emerald-700',
      fillClass: 'bg-emerald-100',
      ringClass: '',
      scoreWeight: 1
    };
  }

  return {
    tier: 'guided',
    label: 'Goed met Digidocent-hulp',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-emerald-100',
    ringClass: 'outline outline-2 outline-offset-2 outline-dotted outline-rose-500',
    scoreWeight: normalizedHelpCount === 1 ? 0.75 : 0.5
  };
};

export const buildLearningResultMetadata = ({ completed = false, isCorrect = false, aiHelpCount = 0, resultTier = '', helpTier = '' } = {}) => {
  const normalizedHelpCount = normalizeAiHelpCount(aiHelpCount);
  const tone = getLearningResultTone({ completed, isCorrect, aiHelpCount: normalizedHelpCount, resultTier, helpTier });

  return {
    aiHelpCount: normalizedHelpCount,
    aiHelpUsed: normalizedHelpCount > 0,
    helpTier: tone.tier,
    resultTier: tone.tier,
    resultLabel: tone.label,
    scoreWeight: tone.scoreWeight
  };
};
