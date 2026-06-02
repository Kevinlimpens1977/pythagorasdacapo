export const shouldCollapseAiTutorOnMouseLeave = ({ draftInput = '' } = {}) =>
  !String(draftInput || '').trim();
