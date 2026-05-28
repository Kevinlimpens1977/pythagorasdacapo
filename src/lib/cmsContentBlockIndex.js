export const replaceContentBlocksForParagraaf = (currentBlocks = [], paragraafId, nextBlocks = []) => {
  if (!paragraafId) return currentBlocks;

  return [
    ...currentBlocks.filter((block) => block?.paragraafId !== paragraafId),
    ...nextBlocks
  ];
};

export const selectContentBlocksForParagraaf = (blocks = [], paragraafId) => {
  if (!paragraafId) return [];
  return blocks.filter((block) => block?.paragraafId === paragraafId);
};
