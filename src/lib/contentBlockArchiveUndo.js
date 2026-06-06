export const buildContentBlockArchiveUndo = (block = null) => {
  if (!block?.id) return null;
  const title = String(block.title || '').trim() || 'Lesblok';
  return {
    blockId: block.id,
    title,
    message: `${title} is gearchiveerd.`
  };
};

export const shouldShowContentBlockArchiveUndo = (undo = null) =>
  Boolean(undo?.blockId && undo?.message);
