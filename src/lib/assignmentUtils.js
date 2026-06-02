const unique = (items = []) => [...new Set(items.filter(Boolean))];

const isPublishedBlock = (block = {}) =>
  block.isArchived !== true && (block.status === 'published' || block.status === 'published'.toUpperCase() || block.status === undefined);

export const getStudentEffectiveParagrafen = (klasData, userId) => {
  if (!klasData || !userId) return [];

  const baseParagrafen = Array.isArray(klasData.enabledParagrafen)
    ? klasData.enabledParagrafen
    : [];
  const extraParagrafen = Array.isArray(klasData.studentOverrides?.[userId]?.extraParagrafen)
    ? klasData.studentOverrides[userId].extraParagrafen
    : [];

  return unique([...baseParagrafen, ...extraParagrafen]);
};

export const getAssignedContentBlockIds = (klasData, userId, paragraafId, blocks = []) => {
  const publishedBlocks = blocks.filter(isPublishedBlock);
  const publishedBlockIds = new Set(publishedBlocks.map((block) => block.id));
  const classBlockIds = klasData?.enabledContentBlocks?.[paragraafId];
  const studentExtraBlockIds = klasData?.studentOverrides?.[userId]?.extraContentBlocks?.[paragraafId] || [];
  const hasExplicitClassSelection = Array.isArray(classBlockIds);

  if (!hasExplicitClassSelection) {
    return unique([
      ...publishedBlocks.map((block) => block.id),
      ...studentExtraBlockIds
    ]).filter((id) => publishedBlockIds.has(id));
  }

  return unique([
    ...classBlockIds,
    ...studentExtraBlockIds
  ]).filter((id) => publishedBlockIds.has(id));
};

export const getEffectiveContentBlocks = (klasData, userId, paragraafId, blocks = []) => {
  const assignedBlockIds = new Set(getAssignedContentBlockIds(klasData, userId, paragraafId, blocks));

  return blocks
    .filter((block) => assignedBlockIds.has(block.id))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

const buildAssignedItemMap = (assignments = []) => {
  const itemMap = new Map();

  assignments.forEach((assignment) => {
    (assignment.blocks || []).forEach((block) => {
      if (!block?.id) return;
      itemMap.set(block.id, block.id);
      if (block.linkedVraagId) itemMap.set(block.linkedVraagId, block.id);
    });
  });

  return itemMap;
};

const getCanonicalAssignedItemId = (record = {}, itemMap = new Map()) => {
  const candidates = [record.blockId, record.vraagId].filter(Boolean);
  const match = candidates.find((candidate) => itemMap.has(candidate));
  return match ? itemMap.get(match) : '';
};

export const getAssignedProgressRecords = ({ assignments = [], progressRecords = [] } = {}) => {
  const itemMap = buildAssignedItemMap(assignments);

  return progressRecords
    .map((record) => ({
      ...record,
      assignedItemId: getCanonicalAssignedItemId(record, itemMap)
    }))
    .filter((record) => record.assignedItemId);
};

export const calculateAssignedProgress = ({ assignments = [], progressRecords = [] } = {}) => {
  const assignedIds = unique(
    assignments.flatMap((assignment) => (assignment.blocks || []).map((block) => block.id))
  );
  const relevantProgress = getAssignedProgressRecords({ assignments, progressRecords });
  const startedIds = unique(relevantProgress.map((record) => record.assignedItemId));
  const completedIds = unique(
    relevantProgress
      .filter((record) => record.completed === true)
      .map((record) => record.assignedItemId)
  );
  const assignedItems = assignedIds.length;

  return {
    assignedItems,
    startedItems: startedIds.length,
    completedItems: completedIds.length,
    percentage: assignedItems > 0 ? Math.round((completedIds.length / assignedItems) * 100) : 0,
    startedPercentage: assignedItems > 0 ? Math.round((startedIds.length / assignedItems) * 100) : 0
  };
};
