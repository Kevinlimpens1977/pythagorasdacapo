export const shouldFallbackToUserProgressQuery = ({ klasId = '', classScopedCount = 0 } = {}) =>
  !klasId || Number(classScopedCount || 0) === 0;
