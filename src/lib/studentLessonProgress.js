export const getCompletedBlockIds = (progressRecords = []) =>
  new Set(
    progressRecords
      .filter((record) => record.completed === true)
      .map((record) => record.blockId || record.vraagId)
      .filter(Boolean)
  );

export const calculateLessonProgress = (blocks = [], progressRecords = []) => {
  const completedIds = getCompletedBlockIds(progressRecords);
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter((block) => completedIds.has(block.id)).length;

  return {
    totalBlocks,
    completedBlocks,
    percentage: totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0,
    isCompleted: totalBlocks > 0 && completedBlocks === totalBlocks
  };
};

export const findResumeBlockIndex = (blocks = [], progressRecords = []) => {
  if (!blocks.length) return 0;

  const completedIds = getCompletedBlockIds(progressRecords);
  const firstIncompleteIndex = blocks.findIndex((block) => !completedIds.has(block.id));

  return firstIncompleteIndex === -1 ? blocks.length - 1 : firstIncompleteIndex;
};

// De lesstofpagina kan rechtstreeks naar één onderdeel starten (?stap=blokId).
// Dat mag de route niet openbreken: staat er nog een onafgeronde kernvraag vóór
// dat blok, dan komt de leerling gewoon uit waar hij gebleven was.
export const resolveRequestedBlockIndex = ({
  blocks = [],
  progressRecords = [],
  requestedBlockId = ''
} = {}) => {
  const resumeIndex = findResumeBlockIndex(blocks, progressRecords);
  const requestedId = String(requestedBlockId || '').trim();
  if (!requestedId) return resumeIndex;

  const requestedIndex = blocks.findIndex((block) => block?.id === requestedId);
  if (requestedIndex === -1) return resumeIndex;

  const completedIds = getCompletedBlockIds(progressRecords);
  const isBlocked = blocks
    .slice(0, requestedIndex)
    .some((block) => block?.type === 'question' && !completedIds.has(block?.id));

  return isBlocked ? resumeIndex : requestedIndex;
};

export const shouldSaveBlockProgressBeforeNavigation = ({ block = null, completedIds = new Set() } = {}) => {
  if (!block?.id) return false;
  if (block.type === 'question') return false;
  return !completedIds.has(block.id);
};

export const getLessonBlockRenderKey = (block = null) =>
  `lesson-block:${block?.id || 'missing'}`;
