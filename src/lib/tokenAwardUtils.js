const getTokenTotal = (block = {}) => {
  const tokenConfig = block.content?.tokenConfig || block.tokenConfig || {};
  return Math.max(0, Math.round(Number(tokenConfig.totalTokens) || 0));
};

const getSourceVersion = (block = {}) => (
  String(
    block.publishedVersion ||
      block.version ||
      block.updatedAt ||
      block.id ||
      'v1'
  )
);

export const shouldRequestTokenAward = ({ block = null, completed = false, extra = {} } = {}) => {
  if (!block || completed !== true) return false;
  if (block.type === 'game') {
    return Boolean(block.content?.gameId);
  }

  const isCorrect = extra.isCorrect === true ||
    extra.resultTier === 'independent' ||
    extra.resultTier === 'guided';
  if (!isCorrect) return false;

  return getTokenTotal(block) > 0;
};

export const buildTokenAwardPayload = ({
  block = {},
  paragraafId = '',
  completed = false,
  extra = {}
} = {}) => {
  if (!shouldRequestTokenAward({ block, completed, extra })) return null;

  if (block.type === 'game') {
    const gameId = String(block.content?.gameId || '').trim();
    const result = extra.lastAnswer || {};
    return {
      sourceKind: 'game',
      sourceId: gameId,
      sourceVersion: String(block.publishedVersion || block.version || block.id || result.attemptId || 'v1'),
      sourceTitle: block.title || '',
      paragraafId: block.paragraafId || paragraafId,
      blockId: block.id || '',
      gameId,
      result: {
        ...result,
        completed: result.completed ?? true,
        passed: result.passed ?? true
      }
    };
  }

  return {
    sourceKind: 'contentBlock',
    sourceId: block.id || '',
    sourceVersion: getSourceVersion(block),
    sourceTitle: block.title || '',
    paragraafId: block.paragraafId || paragraafId,
    blockId: block.id || '',
    result: {
      completed,
      isCorrect: extra.isCorrect === true,
      resultTier: extra.resultTier || ''
    }
  };
};
