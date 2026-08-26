import { isOptionalParagraph } from './paragraphMetadata.js';

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

/**
 * Voortgang over toegewezen lesblokken.
 *
 * De hoofdvelden gaan over de VERPLICHTE stof. Een vrijwillige plusparagraaf
 * telt niet mee in de noemer: wie alles af heeft wat af moest hoort op 100% te
 * staan, ook als hij geen enkele plusparagraaf deed. Wat er vrijwillig extra
 * gedaan is staat compleet in `plus`, en `totaal` houdt de oude, ongesplitste
 * telling bij voor lijsten die alleen willen weten of er iets klaarstaat.
 */
export const calculateAssignedProgress = ({ assignments = [], progressRecords = [] } = {}) => {
  const relevantProgress = getAssignedProgressRecords({ assignments, progressRecords });
  const startedIds = new Set(relevantProgress.map((record) => record.assignedItemId));
  const completedIds = new Set(
    relevantProgress
      .filter((record) => record.completed === true)
      .map((record) => record.assignedItemId)
  );

  const tel = (lijst = []) => {
    const ids = unique(lijst.flatMap((assignment) => (assignment.blocks || []).map((block) => block.id)));
    const assignedItems = ids.length;
    const startedItems = ids.filter((id) => startedIds.has(id)).length;
    const completedItems = ids.filter((id) => completedIds.has(id)).length;

    return {
      assignedItems,
      startedItems,
      completedItems,
      percentage: assignedItems > 0 ? Math.round((completedItems / assignedItems) * 100) : 0,
      startedPercentage: assignedItems > 0 ? Math.round((startedItems / assignedItems) * 100) : 0
    };
  };

  const isOptioneel = (assignment = {}) => isOptionalParagraph(assignment.paragraaf || assignment);
  const verplichteAssignments = assignments.filter((assignment) => !isOptioneel(assignment));
  const plusAssignments = assignments.filter(isOptioneel);
  const verplicht = tel(verplichteAssignments);
  const plus = tel(plusAssignments);

  // Staat er alleen vrijwillige stof in beeld - bijvoorbeeld omdat er op één
  // plusparagraaf gefilterd is - dan zou 0 van 0 een leeg vakje opleveren en
  // zou de paragraaf uit de lijst vallen. De hoofdvelden beschrijven dan die
  // plusstof; `alleenPlus` vertelt de UI dat er niets afgedwongen wordt.
  const alleenPlus = verplichteAssignments.length === 0 && plusAssignments.length > 0;

  return {
    ...(alleenPlus ? plus : verplicht),
    alleenPlus,
    plus,
    totaal: tel(assignments)
  };
};
