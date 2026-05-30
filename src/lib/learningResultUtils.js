export const normalizeAiHelpCount = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const getLearningResultTone = ({ isCorrect = false, aiHelpCount = 0 } = {}) => {
  if (!isCorrect) {
    return {
      tier: 'in_progress',
      label: 'Nog niet goed',
      borderClass: 'border-slate-300',
      fillClass: 'bg-white',
      scoreWeight: 0
    };
  }

  const normalizedHelpCount = normalizeAiHelpCount(aiHelpCount);

  if (normalizedHelpCount === 0) {
    return {
      tier: 'independent',
      label: 'Zelfstandig goed',
      borderClass: 'border-emerald-700',
      fillClass: 'bg-emerald-100',
      scoreWeight: 1
    };
  }

  if (normalizedHelpCount === 1) {
    return {
      tier: 'ai_minimal',
      label: 'Goed met minimale AI-hulp',
      borderClass: 'border-emerald-700',
      fillClass: 'bg-rose-100',
      scoreWeight: 0.75
    };
  }

  return {
    tier: 'ai_guided',
    label: 'Goed met veel AI-hulp',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-rose-300',
    scoreWeight: 0.5
  };
};

export const buildLearningResultMetadata = ({ isCorrect = false, aiHelpCount = 0 } = {}) => {
  const normalizedHelpCount = normalizeAiHelpCount(aiHelpCount);
  const tone = getLearningResultTone({ isCorrect, aiHelpCount: normalizedHelpCount });

  return {
    aiHelpCount: normalizedHelpCount,
    aiHelpUsed: normalizedHelpCount > 0,
    helpTier: tone.tier,
    resultLabel: tone.label,
    scoreWeight: tone.scoreWeight
  };
};
